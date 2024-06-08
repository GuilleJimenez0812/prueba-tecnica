import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: { type: String, require: true},
    email: { type: String, require: true},
    password: { type: String, select: false}
})

export const UserModel = mongoose.model('User', UserSchema)