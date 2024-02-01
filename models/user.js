import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose'

const schema = mongoose.Schema

const userSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    saved: [
        {
            type: schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    posts: [
        {
            type: schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    profile_picture: {
        type: String
    }
},{timestamps: true })


userSchema.plugin(passportLocalMongoose)



export const User = mongoose.model('User', userSchema) 


