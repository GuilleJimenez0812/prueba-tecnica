import express from 'express'
import { OrderController } from '../controllers/orderController'
import { AuthenticationMiddleware } from '../middlewares/authenticationMiddleware'
import { createOrderSchema } from '../dto/zodSchema/zodOrder'

export default (router: express.Router) => {
  const authMiddleware = new AuthenticationMiddleware()
  const orderController = new OrderController()

  // Crear una nueva orden
  router.post('/orders', authMiddleware.validate(createOrderSchema), authMiddleware.verify, orderController.createOrder)
  // Obtener ordenes por Id de orden
  router.get('/orders/:id', authMiddleware.verify, orderController.getOrderById)
  // Obtener ordenes por Usuario logueado
  router.get('/orders-user', authMiddleware.verify, orderController.getOrdersByUser)
  // Obtener todas las ordenes
  router.patch('/orders-status/:id', authMiddleware.verify, orderController.updateOrderStatus)
  // Cancelar orden
  router.post('/orders-cancel/:order_id', authMiddleware.verify, orderController.cancelOrder)
}
