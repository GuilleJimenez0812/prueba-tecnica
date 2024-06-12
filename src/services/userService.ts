import { UserDto } from 'dto/UserDto'
import { IUserRepository } from '../repository/Interfaces/IUserRepository'
import { MongoUserRepository } from '../repository/MongoDB/MongoUserRepository'
import { UsersUtils } from '../utils/usersUtils'
import { CustomError } from '../dto/customError'

export class UserService {
  constructor(
    private userRepository: IUserRepository = new MongoUserRepository(),
    private userUtils: UsersUtils = new UsersUtils(),
  ) {
    this.userRepository = userRepository
    this.userUtils = userUtils
  }

  async getAllUsers(page?: number, limit?: number): Promise<UserDto[]> {
    return await this.userRepository.getUsers(page, limit)
  }

  async findUserByEmail(email: string): Promise<UserDto> {
    return await this.userRepository.getUserByEmail(email)
  }

  async findUserByEmailWithPassword(email: string): Promise<UserDto> {
    return await this.userRepository.getUserByEmailWithPassword(email)
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
    await this.isEmailRegistered(updateValues)
    await this.encryptPasswordIfNeeded(updateValues)
    return await this.userRepository.updateUserById(id, updateValues)
  }

  private async encryptPasswordIfNeeded(updateValues: Record<string, any>): Promise<void> {
    if (updateValues.password) {
      updateValues.password = await this.userUtils.encryptPassword(updateValues.password)
    }
  }

  private async isEmailRegistered(updateValues: Record<string, any>): Promise<void> {
    if (updateValues.email) {
      const user = await this.userRepository.getUserByEmail(updateValues.email)
      if (user) throw new CustomError('Email already registered', 400)
    }
  }
}
