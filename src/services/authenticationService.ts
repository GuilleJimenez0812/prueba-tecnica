import { JWT_SECRET, JWT_EXPIRES } from '../congif'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { CustomError } from '../dto/customError'
import { UserService } from './userService'

export class AuthenticationService {
  userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async login(email: string, password: string) {
    
    try {
      if (typeof email !== 'string') throw new CustomError('The email does not match the format.', 401)
      if (typeof password !== 'string') throw new CustomError('The password does not match the format.', 401)
    
      const user = await this.userService.findUserByEmail(email)

      if (!user || !(await bcryptjs.compare(password, user.password))) {
        throw new CustomError('Invalid email or password.', 401)
      }

      const token = this.generateToken(user._id.toString())
      const loggedUser = { id: user._id, username: user.username, email: user.email, token }

      return loggedUser
    } catch (err) {
      return err
    }
  }

  async register(email: string, password: string, username: string) {
    try {
      if (typeof email !== 'string') throw new CustomError('The email does not match the format.', 401)
      if (typeof password !== 'string') throw new CustomError('The password does not match the format.', 401)
      if (typeof username !== 'string') throw new CustomError('The username does not match the format.', 401)
    
      if (!this.validateRegisterRequest(email, password, username)) 
        throw new CustomError('Registration request validation failed: Email, password, or username does not meet the required criteria.', 401)
      

      if (await this.userService.findUserByEmail(email)) 
        throw new CustomError('User already exists.', 409)

      const user = await this.userService.registerUser({
        email,
        username,
        password: await this.encryptPassword(password)
      })
      return user
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

  async encryptPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 10)
  }
}
