import express from 'express'
import { OrderService } from '../services/orderService'
import { CustomRequest } from '../dto/Request'

export class OrderController {
  private orderService: OrderService

  constructor() {
    this.orderService = new OrderService()
    this.createOrder = this.createOrder.bind(this)
    this.getOrderById = this.getOrderById.bind(this)
    this.getOrdersByUser = this.getOrdersByUser.bind(this)
    this.updateOrderStatus = this.updateOrderStatus.bind(this)
    this.cancelOrder = this.cancelOrder.bind(this)
  }

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

  async getOrdersByUser(req: CustomRequest, res: express.Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const user_id  = req.user.id
      const orders = await this.orderService.getOrdersByUser(user_id, page, limit)
      return res.status(200).json(orders)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to get orders by user' })
    }
  }

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
