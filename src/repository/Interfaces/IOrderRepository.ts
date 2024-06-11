import { OrderDto } from "../../dto/OrderDto"

export interface IOrderRepository {
  createOrder(product_id: string[], user_id: string, quantity: number[]): Promise<OrderDto>
  getOrders(page?: number, limit?: number): Promise<OrderDto[]>
  getOrderById(order_id: string): Promise<OrderDto>
  getOrdersByUser(user_id: string, page?: number, limit?: number): Promise<OrderDto[]>
  updateOrderStatus(order_id: string, status: string, end_date?: Date): Promise<OrderDto>
  deleteOrder(order_id: string): Promise<OrderDto>
}