import { JWT_SECRET, JWT_EXPIRES } from '../congif'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { CustomError } from '../dto/customError'
import { UserService } from './userService'
import { LoggedUserDto, UserDto } from '../dto/UserDto'
import { UsersUtils } from '../utils/usersUtils'

export class AuthenticationService {
  constructor(
    private userService: UserService = new UserService(),
    private userUtils: UsersUtils = new UsersUtils(),
  ) {
    this.userService = userService
  }

  /**
   * Attempts to log in a user with the provided email and password.
   * @param email The email address of the user attempting to log in.
   * @param password The password of the user attempting to log in.
   * @returns A promise that resolves with the LoggedUserDto object containing the user's information and token.
   * @throws CustomError with status 401 if the email or password is invalid.
   */
  async login(email: string, password: string): Promise<LoggedUserDto> {
    const user: UserDto = await this.userService.findUserByEmailWithPassword(email)

    //User must exist or the password must match the password in the data base.
    if (!user || !(await bcryptjs.compare(password, user.password))) {
      throw new CustomError('Invalid email or password.', 401)
    }

    const token = this.generateToken(user._id.toString())
    const loggedUser: LoggedUserDto = { _id: user._id, username: user.username, email: user.email, token }

    return loggedUser
  }

  /**
   * Registers a new user with the provided email, password, and username.
   * @param email The email address of the user to register.
   * @param password The password of the user to register.
   * @param username The username of the user to register.
   * @returns A promise that resolves with the UserDto object of the newly registered user.
   * @throws CustomError with status 409 if a user with the given email already exists.
   */
  async register(email: string, password: string, username: string): Promise<UserDto> {
    //There cannot be two users with the same email
    if (await this.userService.findUserByEmail(email)) throw new CustomError('User already exists.', 409)

    const user: UserDto = await this.userService.registerUser({
      email,
      username,
      password: await this.userUtils.encryptPassword(password),
    })
    return user
  }

  /**
   * Extracts a token from the authorization header.
   * @param header The authorization header from the request, which may be a string or an array of strings.
   * @returns The extracted token as a string if present and correctly formatted, otherwise null.
   */
  extractTokenFromHeader(header: string | string[]): string | null {
    if (Array.isArray(header)) {
      header = header.join(' ')
    }
    if (typeof header === 'string' && header.startsWith('Bearer')) {
      return header.slice(7)
    }
    return null
  }

  /**
   * Generates a JWT token for a user.
   * This method uses the jwt library to sign a new token with the user's ID. The token is configured to expire
   * as defined by JWT_EXPIRES and is signed using the JWT_SECRET.
   * @param userId The unique identifier of the user for whom to generate the token.
   * @returns A JWT token as a string.
   */
  generateToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
  }
}
