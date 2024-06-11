import { MongoOrderRepository } from '../repository/MongoDB/MongoOrderRepository'
import { OrderDto } from '../dto/OrderDto'
import { IOrderRepository } from '../repository/Interfaces/IOrderRepository'
import { CustomError } from '../dto/customError'
import { ProductService } from './productService'
import { VerificationUtils } from '../utils/verificationUtils'

export class OrderService {
  private orderStatuses: Array<'validating order' | 'order sent' | 'order received' | 'canceled'> = [
    'validating order',
    'order sent',
    'order received',
    'canceled',
  ]

  constructor(
    private productService: ProductService = new ProductService(),
    private orderRepository: IOrderRepository = new MongoOrderRepository(),
    private verificationUtils: VerificationUtils = new VerificationUtils(),
  ) {
    this.orderRepository = orderRepository
    this.productService = productService
  }

  async createOrder(product_id: string[], user_id: string, quantity: number[]): Promise<OrderDto> {
    this.validateOrderParameters(product_id, user_id, quantity)
    await this.verifyProductAvailability(product_id, quantity)
    return this.persistOrder(product_id, user_id, quantity)
  }

  private validateOrderParameters(product_id: string[], user_id: string, quantity: number[]): void {
    this.verificationUtils.validateParameters({ product_id, user_id, quantity }, { product_id: 'string[]', user_id: 'string', quantity: 'number[]' })
    if (product_id.length !== quantity.length) {
      throw new CustomError('User must enter the same quantity as products.', 400)
    }
  }

  private async verifyProductAvailability(product_id: string[], quantity: number[]): Promise<void> {
    for (let i = 0; i < quantity.length; i++) {
      const isAvailable = await this.productService.checkAvailability(product_id[i], quantity[i])
      if (!isAvailable) {
        throw new CustomError('The product is not available', 400)
      }
    }
  }

  private async persistOrder(product_id: string[], user_id: string, quantity: number[]): Promise<OrderDto> {
    return this.orderRepository.createOrder(product_id, user_id, quantity)
  }

  async getOrderById(order_id: string): Promise<OrderDto> {
    return this.orderRepository.getOrderById(order_id)
  }

  async getOrdersByUser(user_id: string, page?: number, limit?: number): Promise<OrderDto[]> {
    return this.orderRepository.getOrdersByUser(user_id, page, limit)
  }

  async updateOrderStatus(order_id: string, user_id: string): Promise<OrderDto> {
    this.verificationUtils.validateParameters({ order_id, user_id }, { order_id: 'string', user_id: 'string' })

    const currentOrder = await this.orderRepository.getOrderById(order_id)
    this.verifyOrderOwnership(currentOrder, user_id)

    const nextStatus = this.getNextOrderStatus(currentOrder.status)
    return this.orderRepository.updateOrderStatus(order_id, nextStatus)
  }

  private async verifyOrderOwnership(order: OrderDto, user_id: string): Promise<void> {
    if (!order) throw new CustomError('Invalid order', 400)
    if (order.user_id.toString() !== user_id) {
      throw new CustomError('Invalid order.', 400)
    }
  }

  private getNextOrderStatus(
    currentStatus: 'validating order' | 'order sent' | 'order received' | 'canceled',
  ): 'validating order' | 'order sent' | 'order received' | 'canceled' {
    const currentIndex = this.orderStatuses.indexOf(currentStatus)
    if (currentIndex === -1) throw new CustomError('Invalid order status', 400)
    if (currentStatus === 'canceled') {
      throw new CustomError('Cannot update status. Order is canceled.', 400)
    }
    if (currentStatus === 'order received') {
      throw new CustomError('Cannot update status. Order already in the final status "order received".', 400)
    }

    return this.orderStatuses[currentIndex + 1]
  }

  async cancelOrder(order_id: string, user_id: string): Promise<OrderDto> {
    this.verificationUtils.validateParameters({ order_id, user_id }, { order_id: 'string', user_id: 'string' })

    const currentOrder = await this.orderRepository.getOrderById(order_id)
    this.verifyOrderOwnership(currentOrder, user_id)

    if (this.verifyOrderStatus(currentOrder)) throw new CustomError('The order is alredy completed', 400)

    currentOrder.product_id.forEach(async (id, index) => {
      await this.productService.restoreAvailability(id, currentOrder.quantity[index])
    })

    return this.orderRepository.updateOrderStatus(order_id, 'canceled')
  }

  private verifyOrderStatus(order: OrderDto): boolean {
    return order.status === 'order received'
  }
}
