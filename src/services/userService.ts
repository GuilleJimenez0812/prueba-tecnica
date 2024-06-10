import { IUserRepository } from '../repository/Interfaces/IUserRepository'
import { MongoUserRepository } from '../repository/MongoDB/MongoUserRepository'

export class UserService {
  private userRepository: IUserRepository

  constructor() {
    this.userRepository = new MongoUserRepository()
  }

  async getAllUsers() {
    return await this.userRepository.getUsers()
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email)
  }

  async findUserById(id: string) {
    return await this.userRepository.getUserById(id)
  }

  async registerUser(userData: Record<string, any>) {
    return await this.userRepository.createUser(userData)
  }

  async removeUserById(id: string) {
    return await this.userRepository.deleteUserById(id)
  }

  async updateUserDetails(id: string, updateValues: Record<string, any>) {
    return await this.userRepository.updateUserById(id, updateValues)
  }
}
