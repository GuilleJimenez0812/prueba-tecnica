import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: { type: String, require: true},
    email: { type: String, require: true},
    authentication: {
        password: { type: String, require: true, select: false },
        salt: { type: String, select: false},
        sessionToken: { type: String, select: false}
    }
})

export const UserModel = mongoose.model('User', UserSchema)

export const getUser = () => UserModel.find()
export const getUserByEmail = (email: string) => UserModel.findOne({email})
export const getuserBySessionToken = (sessionToken: string) => UserModel.findOne({ 
    'authentication.sessionToken': sessionToken
})
export const getUserById = (id: string) => UserModel.findById(id)
export const createUser = (value: Record<string, any>) => new UserModel(value).save().then((user) => user.toObject())
export const deleteuserById = (id: string) => UserModel.findOneAndDelete({_id: id })
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values)