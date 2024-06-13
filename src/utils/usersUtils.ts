import bcryptjs from 'bcryptjs'

export class UsersUtils {
  
  /**
   * Encrypts a password using bcryptjs.
   * @param password The plain text password to encrypt.
   * @returns A promise that resolves with the encrypted password as a string.
   */
  async encryptPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 10)
  }
}
