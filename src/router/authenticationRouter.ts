import express from 'express'
import { AuthenticationController } from '../controllers/authenticationController'
import { AuthenticationMiddleware } from '../middlewares/authenticationMiddleware'
import { loginSchema, registerSchema } from '../dto/zodSchema/zodAuthentication'

export default (router: express.Router) => {
    const authController = new AuthenticationController()
    const uthenticationMiddleware = new AuthenticationMiddleware()
    router.post('/auth/register', uthenticationMiddleware.validate(registerSchema), authController.register)
    router.post('/auth/login', uthenticationMiddleware.validate(loginSchema), authController.login)
}