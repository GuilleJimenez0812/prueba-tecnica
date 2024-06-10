import { IUserRepository } from '../repository/Interfaces/IUserRepository'
import { MongoUserRepository } from '../repository/MongoDB/MongoUserRepository'

export class UserService {
  private userRepository: IUserRepository

  constructor() {
    this.userRepository = new MongoUserRepository()
  }

  async getAllUsers() {
    return this.userRepository.getUsers()
  }

  async findUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email)
  }

  async findUserBySessionToken(sessionToken: string) {
    return this.userRepository.getUserBySessionToken(sessionToken)
  }

  async findUserById(id: string) {
    return this.userRepository.getUserById(id)
  }

  async registerUser(userData: Record<string, any>) {
    return this.userRepository.createUser(userData)
  }

  async removeUserById(id: string) {
    return this.userRepository.deleteUserById(id)
  }

  async updateUserDetails(id: string, updateValues: Record<string, any>) {
    return this.userRepository.updateUserById(id, updateValues)
  }
}
