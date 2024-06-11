import bcryptjs from 'bcryptjs'

export class UsersUtils {
  async encryptPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 10)
  }
}
