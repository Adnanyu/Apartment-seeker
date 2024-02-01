import { Router } from "express";
import { ChatModel } from "../models/chat.js";
import { MessageModel } from "../models/message.js";
import { Types } from 'mongoose';

const { ObjectId } = Types;

export const ChatRouter = Router()

const getChatsWithLastMessage = async (id) => {
    try {
      const chats = await ChatModel.aggregate([
      {
        $lookup: {
          from: 'messages', 
          localField: '_id',
          foreignField: 'chatId', 
          as: 'messages',
        },
      },
      {
        $addFields: {
          lastMessage: { $last: '$messages' },
        },
          },
      {
        $lookup: {
            from: 'users', 
            localField: 'members',
            foreignField: '_id',
            as: 'members',
          },
        },
      {
      $match: {
        'members._id': id,
      },
    },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
    ]);
        return chats
    } catch (error) {
      console.error('Error:', error);
    }
  };


export const getChatRooms = async (req, res) => {
    const { id } = req.user
    const chats = await ChatModel.find({
        members: {$in: [id]}
    }).populate('members')
    const con = new ObjectId(id)
    const filteredChats = chats.map(({members, _id, createdAt, updatedAt, __v}) => ({ _id, createdAt, updatedAt, __v, members: members.map(({_id, email, username, profile_picture, ...others}) => ({_id, email, username, profile_picture}))}))
    const temp = await getChatsWithLastMessage(con)
    res.render('chats/index',{chats: temp})
}

export const newChatRoom = async (req, res) => {
  const { id: senderId } = req.user
  const { receiverId } = req.body
  
  const foundChat = await ChatModel.findOne({
      $or: [
          { members: [senderId, receiverId] },
          { members: [receiverId, senderId] }
      ]
  }).populate('members')
  
  const otherChats =  await ChatModel.find({
      members: { $in: [senderId] }
  }).populate('members')

  if (foundChat) {
      console.log('found chat:', foundChat)
      return res.render('chats/index', { chats: otherChats , foundChat})
  }

  const createdChat = new ChatModel({
      members: [senderId, receiverId]
  })
  
  await createdChat.save()

  await createdChat.populate('members')

  otherChats.unshift(createdChat)
      
  res.render('chats/index', { chats: otherChats, createdChat })
    }

export const getSingleChatRoom = async (req, res) => {
  const { id: senderId } = req.user
  const { receiverId } = req.params

  const chatRoom = await ChatModel.find({
      members: { $all: [senderId, receiverId] }
  }).populate('members')
  const filteredChats = chatRoom.map(({members, _id, createdAt, updatedAt, __v}) => ({ _id, createdAt, updatedAt, __v, members: members.map(({_id, email, username, profile_picture, ...others}) => ({_id, email, username, profile_picture}))}))
  res.send(filteredChats)
    }