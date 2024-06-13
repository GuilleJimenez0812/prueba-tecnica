import express from 'express'
import { OrderController } from '../controllers/orderController'
import { AuthenticationMiddleware } from '../middlewares/authenticationMiddleware'
import { createOrderSchema } from '../schemas/Zod/zodOrder'
import { idProductSchema } from '../schemas/Zod/zodIdSchema'

export default (router: express.Router) => {
  const authMiddleware = new AuthenticationMiddleware()
  const orderController = new OrderController()

  // Create an Order
  router.post('/orders', authMiddleware.validate(createOrderSchema), authMiddleware.verify, orderController.createOrder)
  // Obtain an order by ID
  router.get('/orders/:id', authMiddleware.verify, orderController.getOrderById)
  // Obtain an order by user
  router.get('/orders-user', authMiddleware.verify, orderController.getOrdersByUser)
  // Update the status of the order
  router.patch('/orders-status/:id', authMiddleware.validateId(idProductSchema), authMiddleware.verify, orderController.updateOrderStatus)
  // Update the status of the order to cancel
  router.post('/orders-cancel/:id', authMiddleware.validateId(idProductSchema), authMiddleware.verify, orderController.cancelOrder)
}
