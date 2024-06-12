import express from 'express'
import { AuthenticationController } from '../controllers/authenticationController'
import { AuthenticationMiddleware } from '../middlewares/authenticationMiddleware'
import { loginSchema, registerSchema } from '../dto/zodSchema/zodAuthentication'

/**
 * Router for authentication
 */
export default (router: express.Router) => {
    const authController = new AuthenticationController()
    const uthenticationMiddleware = new AuthenticationMiddleware()

    //Rute for register an user
    router.post('/auth/register', uthenticationMiddleware.validate(registerSchema), authController.register)
    //Rute for login an user
    router.post('/auth/login', uthenticationMiddleware.validate(loginSchema), authController.login)
}