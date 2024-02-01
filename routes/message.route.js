import { Router } from "express";
import { isLoggedIn } from "../middleware.js";
import { MessageModel } from "../models/message.js";
import { catchAsync } from "../utility/catchAsync.js";

export const messageRouter = Router()

    
messageRouter.route('/:chatId')
    .get(isLoggedIn ,catchAsync(async (req, res) => {
        const { chatId } = req.params
        const messages = await MessageModel.find({ chatId }).populate('chatId').populate('sender')
        res.json(messages)
    }))

