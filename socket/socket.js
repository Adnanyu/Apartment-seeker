import { Server } from "socket.io";
import { isLoggedIn } from "../middleware.js";
import { MessageModel } from "../models/message.js";


export const getIo = (server) => {
    const io = new Server(server, {
        path:'/chats'
    })
    
    let onlineUsers = [];

    function emitOnlineUsers() {
        io.emit('onlineUsers', onlineUsers);
    }

    
    io.on('connection', (socket) => {
        console.log("a user connected")

        socket.on('addToActiveUsers', (userId) => {
            if (!onlineUsers.some((user) => user.userId === userId)) {
                onlineUsers.push({ userId: userId, socketId: socket.id });
              }
              emitOnlineUsers();
        })
        console.log(socket.id)
        
        socket.on('joinChatRoom', (chatId) => {
            console.log('joined chatroom:', chatId)
            socket.join(chatId);
        });
        
        socket.on('sendMessage', async (msg, id, chatId) => {
            try {
                const message = new MessageModel({ sender: id, chatId, text: msg })
                const savedMessage = await message.save()
                // then((msg) => {
                //     io.to(chatId).emit('receiveMessage', msg);
                // }
                // )
                await savedMessage.populate('sender')
                io.to(chatId).emit('receiveMessage', savedMessage);
                    
            } catch (e) {
                console.log('something went wrong:', e)
            }
            
        });
        
        socket.on('disconnect', () => {
            onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
            emitOnlineUsers();
            console.log('a user disconnected')
        })

    })
    io.on('error', err => {
        console.log('there is error', err)
    })
    io.on("reconnect_error", (error) => {
        console.log('there was an error')
        socket.disconnect()
      })
    return io
}

