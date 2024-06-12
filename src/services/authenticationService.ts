import { JWT_SECRET, JWT_EXPIRES } from '../congif'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { CustomError } from '../dto/customError'
import { UserService } from './userService'
import { LoggedUserDto, UserDto } from '../dto/UserDto'
import { UsersUtils } from '../utils/usersUtils'
import { VerificationUtils } from '../utils/verificationUtils'

export class AuthenticationService {
  constructor(
    private userService: UserService = new UserService(),
    private userUtils: UsersUtils = new UsersUtils(),
    private verificationUtils: VerificationUtils = new VerificationUtils(),
  ) {
    this.userService = userService
  }

  async login(email: string, password: string): Promise<LoggedUserDto> {
    this.verificationUtils.validateParameters({ email, password }, { email: 'string', password: 'string' })

    const user: UserDto = await this.userService.findUserByEmailWithPassword(email)

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      throw new CustomError('Invalid email or password.', 401)
    }

    const token = this.generateToken(user._id.toString())
    const loggedUser: LoggedUserDto = { _id: user._id, username: user.username, email: user.email, token }

    return loggedUser
  }

  async register(email: string, password: string, username: string): Promise<UserDto> {
    this.verificationUtils.validateParameters({ email, password, username }, { email: 'string', password: 'string', username: 'string' })

    if (!this.validateRegisterRequest(email, password, username))
      throw new CustomError('Registration request validation failed: Email, password, or username does not meet the required criteria.', 401)

    if (await this.userService.findUserByEmail(email)) throw new CustomError('User already exists.', 409)

    const user: UserDto = await this.userService.registerUser({
      email,
      username,
      password: await this.userUtils.encryptPassword(password),
    })
    return user
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

  loginParamsExists(email: string, password: string) {
    if (!email) throw new CustomError('You need to privide a email', 400)
    if (!password) throw new CustomError('You need to privide a password', 400)
  }

  registerParamsExists(email: string, password: string, username: string) {
    if (!email) throw new CustomError('You need to privide a email', 400)
    if (!password) throw new CustomError('You need to privide a password', 400)
    if (!username) throw new CustomError('You need to privide a username', 400)
  }

  validateParams(params: Record<string, any>) {
    for (const [key, value] of Object.entries(params)) {
      if (!value) {
        throw new CustomError(`You need to provide a ${key}`, 400)
      }
    }
  }
}
