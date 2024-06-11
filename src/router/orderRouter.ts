import express from 'express'
import { OrderController } from '../controllers/orderController'
import { AuthenticationMiddleware } from '../middlewares/authenticationMiddleware'

export default (router: express.Router) => {
  const authMiddleware = new AuthenticationMiddleware()
  const orderController = new OrderController()

  // Create a new order
  router.post('/orders', authMiddleware.verify, orderController.createOrder)

  // Get an order by ID
  router.get('/orders/:id', authMiddleware.verify, orderController.getOrderById)

  // Get orders by user ID
  router.get('/orders-user', authMiddleware.verify, orderController.getOrdersByUser)

  // Update order status
  router.patch('/orders-status/:id', authMiddleware.verify, orderController.updateOrderStatus)

  // Cancel an order
  router.post('/orders-cancel/:order_id', authMiddleware.verify, orderController.cancelOrder)
}
