import { OrderDto } from "../../dto/OrderDto"

export interface IOrderRepository {
  createOrder(product_id: string[], user_id: string, quantity: number[]): Promise<OrderDto>
  getOrders(): Promise<OrderDto[]>
  getOrderById(order_id: string): Promise<OrderDto>
  getOrdersByUser(user_id: string): Promise<OrderDto[]>
  updateOrderStatus(order_id: string, status: string): Promise<OrderDto>
  deleteOrder(order_id: string): Promise<OrderDto>

}