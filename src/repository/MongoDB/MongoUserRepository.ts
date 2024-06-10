import { IUserRepository } from '../Interfaces/IUserRepository'
import { UserModel } from '../../schemas/userSchema'

export class MongoUserRepository implements IUserRepository {
  async getUsers(): Promise<any[]> {
    return UserModel.find().then((users) => users.map((user) => user.toObject()))
  }

  async getUserByEmail(email: string): Promise<any | null> {
    return UserModel.findOne({ email }).then((user) => user?.toObject())
  }

  async getUserBySessionToken(sessionToken: string): Promise<any | null> {
    return UserModel.findOne({ 'authentication.sessionToken': sessionToken }).then((user) => user?.toObject())
  }

  async getUserById(id: string): Promise<any | null> {
    return UserModel.findById(id).then((user) => user?.toObject())
  }

  async createUser(value: Record<string, any>): Promise<any> {
    return new UserModel(value).save().then((user) => user.toObject())
  }

  async deleteUserById(id: string): Promise<any> {
    return UserModel.findOneAndDelete({ _id: id })
  }

  async updateUserById(id: string, values: Record<string, any>): Promise<any> {
    return UserModel.findByIdAndUpdate(id, values, { new: true }).then((user) => user?.toObject())
  }
}
