import { OrderModel } from '../../schemas/orderSchema'
import { IOrderRepository } from '../Interfaces/IOrderRepository'
import { OrderDto } from '../../dto/OrderDto'

export class MongoOrderRepository implements IOrderRepository {
  async createOrder(product_id: string[], user_id: string, quantity: number[]): Promise<OrderDto> {
    const newOrder = new OrderModel({
      product_id,
      user_id,
      quantity,
      status: 'validating order',
      issueDate: new Date(),
    })
    return newOrder.save().then((order) => order.toObject())
  }

  async getOrders(page: number = 1, limit: number = 10): Promise<OrderDto[]> {
    const skip = (page - 1) * limit
    return OrderModel.find()
      .skip(skip)
      .limit(limit)
      .then((orders) => orders.map((order) => order.toObject()))
  }

  async getOrderById(order_id: string): Promise<OrderDto> {
    return OrderModel.findById(order_id).then((order) => order?.toObject())
  }

  async getOrdersByUser(user_id: string, page: number = 1, limit: number = 10): Promise<OrderDto[]> {
    const skip = (page - 1) * limit
    return OrderModel.find({ user_id })
      .skip(skip)
      .limit(limit)
      .then((orders) => orders.map((order) => order.toObject()))
  }

  async updateOrderStatus(order_id: string, status: string, end_date?: Date): Promise<OrderDto> {
    const updateObject: { status: string; end_date?: Date } = { status }

    if (end_date) {
      updateObject.end_date = end_date
    }

    return OrderModel.findByIdAndUpdate(order_id, updateObject, { new: true }).then((order) => order?.toObject())
  }

  async deleteOrder(order_id: string): Promise<OrderDto> {
    return OrderModel.findByIdAndDelete(order_id).then((order) => order?.toObject())
  }
}
