import mongoose from 'mongoose'

const schema = mongoose.Schema;

const ChatSchema = new schema({
    members: [{
        type: schema.Types.ObjectId,
        ref: 'User'
    }],
  },{ timestamps: true });

export const ChatModel = mongoose.model('Chat', ChatSchema);
 