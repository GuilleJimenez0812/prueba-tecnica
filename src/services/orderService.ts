import { MongoOrderRepository } from '../repository/MongoDB/MongoOrderRepository'
import { OrderDto } from '../dto/OrderDto'
import { IOrderRepository } from '../repository/Interfaces/IOrderRepository'
import { CustomError } from '../dto/customError'
import { ProductService } from './productService'
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
    private orderRepository: IOrderRepository = new MongoOrderRepository()
  ) {
    this.orderRepository = orderRepository
    this.productService = productService
  }

  /**
   * Creates a new order with the specified products, user ID, and quantities.
   * @param products An array of product IDs for the products being ordered.
   * @param user_id The ID of the user placing the order.
   * @param quantity An array of quantities corresponding to the products array, indicating how many of each product the user wants to order.
   * @returns A promise that resolves with the created `OrderDto` object, representing the newly created order.
   * @throws `CustomError` with status 400 if any product is not available in the requested quantity.
   */
  async createOrder(products: string[], user_id: string, quantity: number[]): Promise<OrderDto> {
    await this.verifyProductAvailability(products, quantity)
    return this.persistOrder(products, user_id, quantity)
  }

  /**
   * Verifies the availability of each product in the order.
   * @param product An array of product IDs to check for availability.
   * @param quantity An array of quantities corresponding to the product IDs.
   * @throws `CustomError` with status 400 if any product is not available in the requested quantity, including details about the product and its availability.
   */
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

  /**
   * Call the repository to persists the order in the database.
   * @param product An array of product IDs for the products being ordered.
   * @param user_id The ID of the user placing the order.
   * @param quantity An array of quantities corresponding to the products array.
   * @returns A promise that resolves with the `OrderDto` object representing the newly created order.
   */
  private async persistOrder(product: string[], user_id: string, quantity: number[]): Promise<OrderDto> {
    return this.orderRepository.createOrder(product, user_id, quantity)
  }

  /**
   * Call the repository to retrieves an order by its ID.
   * @param order_id The unique identifier of the order to retrieve.
   * @returns A promise that resolves with the `OrderDto` object representing the retrieved order.
   */
  async getOrderById(order_id: string): Promise<OrderDto> {
    return this.orderRepository.getOrderById(order_id)
  }

  /**
   * Call the repository to retrieves orders placed by a specific user, with optional pagination.
   * @param user_id The unique identifier of the user whose orders are to be retrieved.
   * @param page (Optional) The page number of the orders to retrieve, for pagination.
   * @param limit (Optional) The maximum number of orders to retrieve per page, for pagination.
   * @returns A promise that resolves with an array of `OrderDto` objects representing the user's orders.
   */
  async getOrdersByUser(user_id: string, page?: number, limit?: number): Promise<OrderDto[]> {
    return this.orderRepository.getOrdersByUser(user_id, page, limit)
  }

  /**
   * Updates the status of an order based on its current status.
   * @param order_id The unique identifier of the order to update.
   * @param user_id The unique identifier of the user requesting the update.
   * @returns A promise that resolves with the `OrderDto` object representing the updated order.
   */
  async updateOrderStatus(order_id: string, user_id: string): Promise<OrderDto> {
    const currentOrder = await this.orderRepository.getOrderById(order_id)
    this.verifyOrderOwnership(currentOrder, user_id)

    const nextStatus = this.getNextOrderStatus(currentOrder.status)
    const endDate = this.assignOrderEndDate(nextStatus)
    if (!endDate) return this.orderRepository.updateOrderStatus(order_id, nextStatus)
    else return this.orderRepository.updateOrderStatus(order_id, nextStatus, endDate)
  }

  /**
   * Verifies the ownership of an order by comparing the user ID associated with the order to the provided user ID.
   * @param order The `OrderDto` object representing the order to verify.
   * @param user_id The unique identifier of the user to compare against the order's user ID.
   * @throws `CustomError` if the order does not exist or if the user ID does not match the order's user ID.
   */
  private async verifyOrderOwnership(order: OrderDto, user_id: string): Promise<void> {
    if (!order) throw new CustomError('Invalid order', 400)
    if (order.user._id.toString() !== user_id) {
      throw new CustomError('Invalid order.', 400)
    }
  }

  /**
   * Determines the next status of an order based on its current status. The state of the order won´t change if the order is canceled or already in the final status.
   * @param currentStatus The current status of the order.
   * @returns The next status of the order.
   * @throws `CustomError` if the current status is invalid, the order is canceled, or the order is already in the final status.
   */
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

  /**
   * Change the state to 'canceled' when the order is not 'order received'.
   * @param order_id The unique identifier of the order to cancel.
   * @param user_id The unique identifier of the user requesting the cancellation.
   * @returns A promise that resolves with the `OrderDto` object representing the canceled order.
   * @throws `CustomError` if the order is already completed.
   */
  async cancelOrder(order_id: string, user_id: string): Promise<OrderDto> {
    const currentOrder = await this.orderRepository.getOrderById(order_id)
    this.verifyOrderOwnership(currentOrder, user_id)

    //The order can´t change status if is 'order received'.
    if (this.verifyOrderStatus(currentOrder)) throw new CustomError('The order is alredy completed', 400)

    currentOrder.products.forEach(async (product, index) => {
      await this.productService.restoreAvailability(product, currentOrder.quantity[index])
    })

    const endDate = this.assignOrderEndDate('canceled')

    if (!endDate) return this.orderRepository.updateOrderStatus(order_id, 'canceled')
    else return this.orderRepository.updateOrderStatus(order_id, 'canceled', endDate)
  }

  /**
   * Checks if an order's status is 'order received'.
   * @param order The `OrderDto` object representing the order to check.
   * @returns A boolean indicating whether the order's status is 'order received'.
   */
  private verifyOrderStatus(order: OrderDto): boolean {
    return order.status === 'order received'
  }

  /**
   * Assigns an end date to an order based on its status.
   * @param status The status of the order to check.
   * @returns A `Date` object representing the end date if the status is 'order received' or 'canceled', or `null` if the order does not require an end date.
   */
  private assignOrderEndDate(status: string): Date | null {
    if (status === 'order received' || status === 'canceled') {
      return new Date()
    }
    return null
  }
}
