import { IUserRepository } from 'repository/Interfaces/IUserRepository'
import { MongoUserRepository } from '../repository/MongoDB/MongoUserRepository'
import { JWT_SECRET, JWT_EXPIRES } from '../congif'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { CustomError } from '../dto/customError'
import { UsersUtils } from '../utils/usersUtils'

export class AuthenticationService {
  private userRepository: IUserRepository
  private userUtils: UsersUtils

  constructor() {
    this.userRepository = new MongoUserRepository()
    this.userUtils = new UsersUtils()
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.getUserByEmail(email)

      if (!user || !(await bcryptjs.compare(password, user.password))) {
        throw new CustomError('Invalid email or password.', 401)
      }

      const token = this.generateToken(user._id.toString())
      const loggedUser = { id: this.userUtils.generarUUID(), username: user.username, email: user.email, token }

      return loggedUser
    } catch (err) {
      return err
    }
  }

  extractTokenFromHeader(header: string | string[]): string | null {
    if (Array.isArray(header)) {
      header = header.join(' ')
    }
    if (typeof header === 'string' && header.startsWith('Bearer')) {
      return header.slice(7)
    }
    return null
  }

  validateLoginRequest(email: string, password: string): boolean {
    return email.length > 0 && password.length > 0
  }

  generateToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
  }

  validateRegisterRequest(email: string, password: string, username: string): boolean {
    return email.length > 0 && password.length > 0 && username.length > 0
  }
}
