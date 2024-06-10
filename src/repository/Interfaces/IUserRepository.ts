export interface IUserRepository {
  getUsers(): Promise<any[]>
  getUserByEmail(email: string): Promise<any | null>
  getUserById(id: string): Promise<any | null>
  createUser(value: Record<string, any>): Promise<any>
  deleteUserById(id: string): Promise<any>
  updateUserById(id: string, values: Record<string, any>): Promise<any>
}
