import express from 'express'
import { AuthenticationController, register } from '../controllers/authenticationController'

export default (router: express.Router) => {
    const authController = new AuthenticationController()
    router.post('/auth/register', register)
    router.post('/auth/login', authController.login)
}