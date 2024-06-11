import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: { type: String, require: true, unique: true},
    email: { type: String, require: true, unique: true},
    password: { type: String, select: true}
})

export const UserModel = mongoose.model('User', UserSchema)