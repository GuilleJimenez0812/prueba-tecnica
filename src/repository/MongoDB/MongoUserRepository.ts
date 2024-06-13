import { IUserRepository } from '../Interfaces/IUserRepository'
import { UserModel } from '../../schemas/MongoDB/userSchema'
import { UserDto } from '../../dto/UserDto'

export class MongoUserRepository implements IUserRepository {
  async getUsers(page: number = 1, limit: number = 10): Promise<UserDto[]> {
    const skip = (page - 1) * limit
    return UserModel.find()
      .skip(skip)
      .limit(limit)
      .then((users) =>
        users.map((user) => {
          const userObject = user.toObject()
          const userDto: UserDto = {
            _id: userObject._id.toString(),
            username: userObject.username,
            email: userObject.email,
          }
          return userDto
        }),
      )
  }

  async getUserByEmail(email: string): Promise<UserDto | null> {
    return UserModel.findOne({ email }).then((user) => user?.toObject())
  }

  async getUserByEmailWithPassword(email: string): Promise<UserDto | null> {
    return UserModel.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) return null
        return user.toObject()
      })
  }

  async getUserById(id: string): Promise<UserDto | null> {
    return UserModel.findById(id).then((user) => user?.toObject())
  }

  async createUser(value: Record<string, any>): Promise<UserDto> {
    return new UserModel(value).save().then((user) => user.toObject())
  }

  async deleteUserById(id: string): Promise<UserDto> {
    return UserModel.findOneAndDelete({ _id: id })
  }

  async updateUserById(id: string, values: Record<string, any>): Promise<UserDto> {
    return UserModel.findByIdAndUpdate(id, values, { new: true }).then((user) => user?.toObject())
  }
}
