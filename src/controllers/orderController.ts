import express from 'express'
import { OrderService } from '../services/orderService'
import { CustomRequest } from '../dto/Request'

export class OrderController {
  constructor(private orderService: OrderService = new OrderService()) {
    this.orderService = orderService
    this.createOrder = this.createOrder.bind(this)
    this.getOrderById = this.getOrderById.bind(this)
    this.getOrdersByUser = this.getOrdersByUser.bind(this)
    this.updateOrderStatus = this.updateOrderStatus.bind(this)
    this.cancelOrder = this.cancelOrder.bind(this)
  }

  /**
   * Creates a new order with the specified details.
   * @param req The request object, containing the order details (products, quantity).
   * @param res The response object.
   * @returns
   */
  async createOrder(req: CustomRequest, res: express.Response) {
    try {
      const { products, quantity } = req.body
      const user_id = req.user.id
      const order = await this.orderService.createOrder(products, user_id, quantity)
      return res.status(201).json(order)
    } catch (err) {
      const statusCode = err.statusCode || 500
      const message = err.message || 'An unexpected error occurred'

      return res.status(statusCode).json({ error: { statusCode, message } })
    }
  }

  /**
   * Retrieves a specific order by its unique identifier.
   * @param req the request object, containing the order id.
   * @param res
   * @returns
   */
  async getOrderById(req: CustomRequest, res: express.Response) {
    try {
      const { id } = req.params
      const order = await this.orderService.getOrderById(id)
      if (!order) {
        return res.status(404).json({ error: 'Order not found' })
      }
      return res.status(200).json(order)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to get order' })
    }
  }

  /**
   * Fetches all orders associated with a given user.
   * @param req the request object.
   * @param res the response object.
   * @returns
   */
  async getOrdersByUser(req: CustomRequest, res: express.Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const user_id = req.user.id
      const orders = await this.orderService.getOrdersByUser(user_id, page, limit)
      return res.status(200).json(orders)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to get orders by user' })
    }
  }

  /**
   * Updates the status of an existing order.
   * @param req the request object, containing the order id.
   * @param res the response object.
   * @returns
   */
  async updateOrderStatus(req: CustomRequest, res: express.Response) {
    try {
      const { id } = req.params
      const user_id: string = req.user.id
      const updatedOrder = await this.orderService.updateOrderStatus(id, user_id)
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' })
      }
      return res.status(200).json(updatedOrder)
    } catch (err) {
      const statusCode = err.statusCode || 500
      const message = err.message || 'An unexpected error occurred'

      return res.status(statusCode).json({ error: { statusCode, message } })
    }
  }

  /**
   * Cancels an existing order based on its unique identifier.
   * @param req The request object, containing the order id.
   * @param res The response object.
   * @returns
   */
  async cancelOrder(req: CustomRequest, res: express.Response) {
    try {
      const { order_id } = req.params
      const user_id: string = req.user.id // Assuming there's a user object in the request
      const order = await this.orderService.cancelOrder(order_id, user_id)
      return res.status(200).json(order)
    } catch (err) {
      const statusCode = err.statusCode || 500
      const message = err.message || 'An unexpected error occurred'

      return res.status(statusCode).json({ error: { statusCode, message } })
    }
  }
}
