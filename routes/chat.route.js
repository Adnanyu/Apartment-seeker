import { Router } from "express";
import * as chats from "../controllers/chats.js";
import { isLoggedIn } from "../middleware.js";
import { catchAsync } from "../utility/catchAsync.js";


export const ChatRouter = Router()

ChatRouter.route('/')
    .get(isLoggedIn, catchAsync(chats.getChatRooms))
    .post(isLoggedIn, catchAsync(chats.newChatRoom))

ChatRouter.route('/:receiverId')
    .get(isLoggedIn, catchAsync(chats.getSingleChatRoom))


