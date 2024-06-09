import { UserModel } from '../schemas/userSchema'

export const getUsers = () => UserModel.find()
export const getUserByEmail = (email: string) => UserModel.findOne({email})
export const getuserBySessionToken = (sessionToken: string) => UserModel.findOne({ 
    'authentication.sessionToken': sessionToken
})
export const getUserById = (id: string) => UserModel.findById(id)
export const createUser = (value: Record<string, any>) => new UserModel(value).save().then((user) => user.toObject())
export const deleteuserById = (id: string) => UserModel.findOneAndDelete({_id: id })
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values)