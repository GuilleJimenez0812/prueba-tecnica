import { UserDto } from '../../dto/UserDto'

export interface IUserRepository {
  getUsers(): Promise<UserDto[]>
  getUserByEmail(email: string): Promise<UserDto | null>
  getUserById(id: string): Promise<UserDto | null>
  createUser(value: Record<string, any>): Promise<UserDto>
  deleteUserById(id: string): Promise<UserDto>
  updateUserById(id: string, values: Record<string, any>): Promise<UserDto>
}
