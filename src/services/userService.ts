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

  /**
   * Retrieves all users with optional pagination.
   * @param page (Optional) The page number for pagination.
   * @param limit (Optional) The maximum number of users to return per page for pagination.
   * @returns A promise that resolves with an array of `UserDto` objects representing the users.
   */
  async getAllUsers(page?: number, limit?: number): Promise<UserDto[]> {
    return await this.userRepository.getUsers(page, limit)
  }

  /**
   * Finds a user by their email address.
   * @param email The email address of the user to find.
   * @returns A promise that resolves with a `UserDto` object representing the found user.
   */
  async findUserByEmail(email: string): Promise<UserDto> {
    return await this.userRepository.getUserByEmail(email)
  }

  /**
   * Finds a user by their email address, including the user's password in the response.
   * @param email The email address of the user to find.
   * @returns A promise that resolves with a `UserDto` object representing the found user, including the password.
   */
  async findUserByEmailWithPassword(email: string): Promise<UserDto> {
    return await this.userRepository.getUserByEmailWithPassword(email)
  }

  /**
   * Finds a user by their unique identifier.
   * @param id The unique identifier of the user to find.
   * @returns A promise that resolves with a `UserDto` object representing the found user.
   */
  async findUserById(id: string): Promise<UserDto> {
    return await this.userRepository.getUserById(id)
  }

  /**
   * Registers a new user with the provided user data.
   * @param userData A record containing the data for the new user.
   * @returns A promise that resolves with a `UserDto` object representing the newly created user.
   */
  async registerUser(userData: Record<string, any>): Promise<UserDto> {
    return await this.userRepository.createUser(userData)
  }

  /**
   * Removes a user by their unique identifier.
   * @param id The unique identifier of the user to remove.
   * @returns A promise that resolves with the result of the deletion operation.
   */
  async removeUserById(id: string): Promise<any> {
    return await this.userRepository.deleteUserById(id)
  }

  /**
   * Updates the details of an existing user.
   * @param id The unique identifier of the user to update.
   * @param updateValues A record containing the new values for the user.
   * @returns A promise that resolves with a `UserDto` object representing the updated user.
   */
  async updateUserDetails(id: string, updateValues: Record<string, any>): Promise<UserDto> {
    await this.isEmailRegistered(updateValues)
    await this.encryptPasswordIfNeeded(updateValues)
    return await this.userRepository.updateUserById(id, updateValues)
  }

  /**
   * Encrypts the user's password if it is provided in the update values.
   * @param updateValues A record containing the update values, possibly including a new password.
   */
  private async encryptPasswordIfNeeded(updateValues: Record<string, any>): Promise<void> {
    if (updateValues.password) {
      updateValues.password = await this.userUtils.encryptPassword(updateValues.password)
    }
  }

  /**
   * Checks if the provided email in the update values is already registered.
   * @param updateValues A record containing the update values, possibly including a new email.
   * @throws `CustomError` if the email is already registered.
   */
  private async isEmailRegistered(updateValues: Record<string, any>): Promise<void> {
    if (updateValues.email) {
      const user = await this.userRepository.getUserByEmail(updateValues.email)
      if (user) throw new CustomError('Email already registered', 400)
    }
  }
}
