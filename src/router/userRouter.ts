import express from 'express'
import { deleteUser, getAllUsers, updateUser } from '../controllers/userController'
import { AuthenticationMiddleware } from '../middlewares/authenticationMiddleware'

export default (router: express.Router) => {
    const authMiddleware = new AuthenticationMiddleware()
    router.get('/users', authMiddleware.verify, getAllUsers)
    router.delete('users/:id', authMiddleware.verify, authMiddleware.isOwner, deleteUser)
    router.patch('/users/:id', authMiddleware.verify, authMiddleware.isOwner, updateUser)
}