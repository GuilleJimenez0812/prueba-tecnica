import express from 'express'
import { AuthenticationService } from '../services/authenticationService'
import { LoggedUserDto, UserDto } from '../dto/UserDto'

export class AuthenticationController {
  private authService: AuthenticationService

  constructor() {
    this.authService = new AuthenticationService()
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
  }

  async login(req: express.Request, res: express.Response) {
    const { email, password } = req.body

    if (!this.authService.validateLoginRequest(email, password)) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    try {
      const loggedUser: LoggedUserDto = await this.authService.login(email, password)

      return res.status(200).json({ status: true, data: loggedUser, message: 'Login Successful' })
    } catch (err) {
      const statusCode = err.statusCode || 500
      const message = err.message || 'An unexpected error occurred'

      return res.status(statusCode).json({ error: { statusCode, message } })
    }
  }

  async register(req: express.Request, res: express.Response) {
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
