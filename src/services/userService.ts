import { UserDto } from 'dto/UserDto'
import { IUserRepository } from '../repository/Interfaces/IUserRepository'
import { MongoUserRepository } from '../repository/MongoDB/MongoUserRepository'

export class UserService {
  private userRepository: IUserRepository

  constructor() {
    this.userRepository = new MongoUserRepository()
  }

  async getAllUsers(): Promise<UserDto[]> {
    return await this.userRepository.getUsers()
  }

  async findUserByEmail(email: string): Promise<UserDto> {
    return await this.userRepository.getUserByEmail(email)
  }

  async findUserById(id: string): Promise<UserDto> {
    return await this.userRepository.getUserById(id)
  }

  async registerUser(userData: Record<string, any>): Promise<UserDto> {
    return await this.userRepository.createUser(userData)
  }

  async removeUserById(id: string): Promise<any> {
    return await this.userRepository.deleteUserById(id)
  }

  async updateUserDetails(id: string, updateValues: Record<string, any>): Promise<UserDto> {
    return await this.userRepository.updateUserById(id, updateValues)
  }
}
