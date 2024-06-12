import express, { Request } from 'express'
import { get } from 'lodash'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../congif'
import { AuthenticationService } from '../services/authenticationService'
import { CustomRequest } from '../dto/Request'

export class AuthenticationMiddleware {
  constructor(private authService: AuthenticationService = new AuthenticationService()) {
    this.authService = authService
    this.verify = this.verify.bind(this)
    this.isOwner = this.isOwner.bind(this)
  }

  public async verify(req: CustomRequest, res: express.Response, next: express.NextFunction) {
    const tokenHeader = req.headers['x-access-token'] || req.headers['authorization']
    const token = this.authService.extractTokenFromHeader(tokenHeader)

    if (!token) {
      return res.status(401).json({ status: false, errors: ['No autorizado'] })
    }

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ status: false, errors: ['Invalid Token'] })
      } else {
        req.user = decoded
        next()
      }
    })
  }

  public async isOwner(req: CustomRequest, res: express.Response, next: express.NextFunction) {
    try {
      const { id } = req.params
      const currentUserId = req.user.id

      if (!currentUserId) {
        return res.sendStatus(403)
      }
      if (currentUserId.toString() !== id) {
        return res.sendStatus(403)
      }

      next()
    } catch (err) {
      console.log(err)
      return res.sendStatus(400)
    }
  }
}