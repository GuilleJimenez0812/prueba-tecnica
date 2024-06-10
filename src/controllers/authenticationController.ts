import { createUser, getUserByEmail } from '../repository/userRepository'
import express from 'express'
import bcryptjs from 'bcryptjs'
import { AuthenticationService } from '../services/authenticationService'

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
      const loggedUser = await this.authService.login(email, password)

      return res.status(200).json({ status: true, data: loggedUser, message: 'Login Successful' })
    } catch (err) {
      console.error(err)
      return res.status(err.statusCode).json({ error: err.data })
    }
  }

  async register(req: express.Request, res: express.Response) {
    const { email, password, username } = req.body

    try {
      const user = await this.authService.register(email, password, username)
      return res.status(200).json({ status: true, data: user, message: 'User created successfully' })
    } catch (err) {
      return res.status(err.statusCode).json({ error: err.data })
    }
  }
}
