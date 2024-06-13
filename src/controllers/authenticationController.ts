import express from 'express'
import { AuthenticationService } from '../services/authenticationService'
import { LoggedUserDto, UserDto } from '../dto/UserDto'
import { CustomRequest } from '../dto/Request'
import { CustomError } from '../dto/customError'

export class AuthenticationController {
  constructor(private authService: AuthenticationService = new AuthenticationService()) {
    this.authService = authService
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
  }

  /**
   * Controller that handles the user login process.
   * @param req The request object, containing the login credentials (email, password).
   * @param res The response object, used to send back the login result.
   * @returns void
   */
  async login(req: CustomRequest, res: express.Response) {
    const { email, password } = req.body
    try {
      const loggedUser: LoggedUserDto = await this.authService.login(email, password)

      return res.status(200).json({ status: true, data: loggedUser, message: 'Login Successful' })
    } catch (err) {
      const statusCode = err.statusCode || 500
      const message = err.message || 'An unexpected error occurred'

      return res.status(statusCode).json({ error: { statusCode, message } })
    }
  }

  /**
   * Controller that handles the user register process.
   * @param req The request object, containing the login credentials (email, password, username).
   * @param res The response object, used to send back the register result.
   * @returns void
   */
  async register(req: CustomRequest, res: express.Response) {
    const { email, password, username } = req.body

    try {
      const user: UserDto = await this.authService.register(email, password, username)
      return res.status(200).json({ status: true, data: user, message: 'User created successfully' })
    } catch (err) {
      const statusCode = err.statusCode || 500
      const message = err.message || 'An unexpected error occurred'

      return res.status(statusCode).json({ error: { statusCode, message } })
    }
  }
}
