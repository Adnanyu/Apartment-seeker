import mongoose from 'mongoose'

const schema = mongoose.Schema;

const MessageSchema = new schema({
    chatId: {
        type: schema.Types.ObjectId,
        ref: 'Chat'
    },
    sender: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String
    }
}, { timestamps: true })

export const MessageModel = mongoose.model('Message', MessageSchema)