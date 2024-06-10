import express from 'express'
import { AuthenticationController } from '../controllers/authenticationController'

export default (router: express.Router) => {
    const authController = new AuthenticationController()
    router.post('/auth/register', authController.register)
    router.post('/auth/login', authController.login)
}