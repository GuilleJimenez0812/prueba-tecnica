import express from 'express'
import { UserController } from '../controllers/userController'
import { AuthenticationMiddleware } from '../middlewares/authenticationMiddleware'

export default (router: express.Router) => {
    const authMiddleware = new AuthenticationMiddleware()
    const userController = new UserController()
    router.get('/users', authMiddleware.verify, userController.getAllUsers)
    router.delete('/users/:id', authMiddleware.verify, authMiddleware.isOwner, userController.deleteUser)
    router.patch('/users/:id', authMiddleware.verify, authMiddleware.isOwner, userController.updateUser)
}