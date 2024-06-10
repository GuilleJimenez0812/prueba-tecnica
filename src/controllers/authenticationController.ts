import { createUser, getUserByEmail } from '../repository/userRepository'
import express from 'express'
import bcryptjs from 'bcryptjs'
import { AuthenticationService } from '../services/authenticationService'

export class AuthenticationController {
  private authService: AuthenticationService

  constructor() {
    this.authService = new AuthenticationService()
    this.login = this.login.bind(this)
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
}

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body

    if (!email || !password || !username) {
      return res.sendStatus(400)
    }

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return res.sendStatus(409)
    }

    // const salt = random()
    let pass = await bcryptjs.hash(password, 10)

    const user = await createUser({
      email,
      username,
      password: pass,
    })

    return res.status(200).json({ satatus: true, message: 'Usuario creado' }).end()
  } catch (err) {
    console.log(err)
    // return res.sendStatus(400)
    return res.status(500).json({ status: false, message: [err.message] })
  }
}
