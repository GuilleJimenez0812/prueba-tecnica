import { MongoOrderRepository } from '../repository/MongoDB/MongoOrderRepository'
import { OrderDto } from '../dto/OrderDto'
import { IOrderRepository } from '../repository/Interfaces/IOrderRepository'
import { CustomError } from '../dto/customError'
import { ProductService } from './productService'
import { VerificationUtils } from '../utils/verificationUtils'
import { ProductDto } from '../dto/ProductDto'

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

  async createOrder(products: string[], user_id: string, quantity: number[]): Promise<OrderDto> {
    await this.verifyProductAvailability(products, quantity)
    return this.persistOrder(products, user_id, quantity)
  }

  private validateOrderParameters(product_id: string[], user_id: string, quantity: number[]): void {
    this.verificationUtils.validateParameters({ product_id, user_id, quantity }, { product_id: 'string[]', user_id: 'string', quantity: 'number[]' })
    if (product_id.length !== quantity.length) {
      throw new CustomError('User must enter the same quantity as products.', 400)
    }
  }

  private async verifyProductAvailability(product: string[], quantity: number[]): Promise<void> {
    for (let i = 0; i < quantity.length; i++) {
      const isAvailable = await this.productService.checkAvailability(product[i], quantity[i])
      if (!isAvailable) {
        const productUnaveilable: ProductDto = await this.productService.obtainProductById(product[i])
        throw new CustomError(
          `The product ${productUnaveilable.product_name} is currently available with only ${productUnaveilable.availability} in stock, and the requested order quantity is ${quantity[i]}`,
          400,
        )
      }
    }
  }

  private async persistOrder(product: string[], user_id: string, quantity: number[]): Promise<OrderDto> {
    return this.orderRepository.createOrder(product, user_id, quantity)
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
    const endDate = this.assignOrderEndDate(nextStatus)
    if (!endDate) return this.orderRepository.updateOrderStatus(order_id, nextStatus)
    else return this.orderRepository.updateOrderStatus(order_id, nextStatus, endDate)
  }

  private async verifyOrderOwnership(order: OrderDto, user_id: string): Promise<void> {
    if (!order) throw new CustomError('Invalid order', 400)
    if (order.user._id.toString() !== user_id) {
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

    currentOrder.products.forEach(async (product, index) => {
      await this.productService.restoreAvailability(product, currentOrder.quantity[index])
    })

    const endDate = this.assignOrderEndDate('canceled')

    if (!endDate) return this.orderRepository.updateOrderStatus(order_id, 'canceled')
    else return this.orderRepository.updateOrderStatus(order_id, 'canceled', endDate)
  }

  private verifyOrderStatus(order: OrderDto): boolean {
    return order.status === 'order received'
  }

  private assignOrderEndDate(status: string): Date | null {
    if (status === 'order received' || status === 'canceled') {
      return new Date()
    }
    return null
  }
}
