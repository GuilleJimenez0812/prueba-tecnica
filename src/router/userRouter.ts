import express from 'express'
import { UserController } from '../controllers/userController'
import { AuthenticationMiddleware } from '../middlewares/authenticationMiddleware'
import { updateUserSchema } from '../schemas/Zod/zodUser'
import { idProductSchema } from '../schemas/Zod/zodIdSchema'

export default (router: express.Router) => {
  const authMiddleware = new AuthenticationMiddleware()
  const userController = new UserController()

  // Obtain users
  router.get('/users', authMiddleware.verify, userController.getAllUsers)
  // Delete User
  router.delete('/users/:id', authMiddleware.validateId(idProductSchema), authMiddleware.verify, authMiddleware.isOwner, userController.deleteUser)
  // Update User
  router.patch(
    '/users/:id',
    authMiddleware.validateId(idProductSchema),
    authMiddleware.validate(updateUserSchema),
    authMiddleware.verify,
    authMiddleware.isOwner,
    userController.updateUser,
  )
}
