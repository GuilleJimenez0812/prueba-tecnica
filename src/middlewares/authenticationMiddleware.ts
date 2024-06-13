import express from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../congif'
import { AuthenticationService } from '../services/authenticationService'
import { CustomRequest } from '../dto/Request'
import z from 'zod'

export class AuthenticationMiddleware {
  constructor(private authService: AuthenticationService = new AuthenticationService()) {
    this.authService = authService
    this.verify = this.verify.bind(this)
    this.isOwner = this.isOwner.bind(this)
  }

  /**
   * Verifies the JWT token provided in the request headers.
   * @param req CustomRequest - The request object, expected to have a token in the 'x-access-token' or 'authorization' header.
   * @param res express.Response - The response object used to send back a 401 response if authorization fails.
   * @param next express.NextFunction - The next middleware function in the stack.
   * @returns
   */
  public async verify(req: CustomRequest, res: express.Response, next: express.NextFunction) {
    const token = this.extractToken(req)
    if (!token) {
      return res.status(401).json({ status: false, errors: ['No autorizado'] })
    }

    try {
      const decoded = await this.verifyToken(token)
      this.handleDecodedToken(req, decoded)
      next()
    } catch (error) {
      return res.status(401).json({ status: false, errors: ['Invalid Token'] })
    }
  }

  /**
   * Extracts the token from the request headers.
   * @param req The request object, expected to have headers including the token.
   * @returns The extracted token as a string if found, otherwise null.
   */
  private extractToken(req: CustomRequest): string | null {
    const tokenHeader = req.headers['x-access-token'] || req.headers['authorization']
    return this.authService.extractTokenFromHeader(tokenHeader)
  }

  /**
   * Verifies the given JWT token.
   * @param token The JWT token to be verified.
   * @returns A Promise that resolves with the decoded token if verification is successful, otherwise rejects with an error.
   */
  private async verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) {
          reject(error)
        } else {
          resolve(decoded)
        }
      })
    })
  }

  /**
   * Assigns the decoded token to the request object.
   * @param req The request object where the decoded token should be attached.
   * @param decoded The decoded JWT token containing the user's information.
   */
  private handleDecodedToken(req: CustomRequest, decoded: any) {
    req.user = decoded
  }

  /**
   * This method checks if the user making the request is the owner of the resource they are attempting to access.
   * @param req Custom request object, expected to contain user information and parameters including the user ID to compare.
   * @param res Response object used to send the HTTP response.
   * @param next Next function to pass control to the next middleware function in the stack.
   */
  public async isOwner(req: CustomRequest, res: express.Response, next: express.NextFunction) {
    try {
      if (!this.isUserPresent(req)) {
        return res.sendStatus(403)
      }

      if (!this.isUserIdMatching(req)) {
        return res.sendStatus(403)
      }

      next()
    } catch (err) {
      console.log(err)
      res.sendStatus(400)
    }
  }

  /**
   * This method verifies if there is a user object with an ID in the request.
   * @param req Custom request object, expected to contain user information.
   * @returns Boolean indicating whether the user is present.
   */
  private isUserPresent(req: CustomRequest): boolean {
    const currentUserId = req.user?.id
    return !!currentUserId
  }

  /**
   * This method ensures that the user making the request is the owner of the resource by comparing IDs.
   * @param req Custom request object, expected to contain user information and parameters including the user ID to compare.
   * @returns Boolean indicating whether the current user's ID matches the ID in the request parameters.
   */
  private isUserIdMatching(req: CustomRequest): boolean {
    const { id } = req.params
    const currentUserId = req.user.id
    return currentUserId.toString() === id
  }

  /**
   * This method validates the request body against a provided Zod schema.
   * @param schema The Zod schema to validate the request body against.
   * @returns A middleware function that takes a request, response, and next function, performing the validation.
   */
  validate(schema: z.ZodSchema) {
    return (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
      try {
        schema.parse(req.body)
        next()
      } catch (error) {
        return res.status(400).json({ error: error.errors })
      }
    }
  }
}
