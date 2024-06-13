import { OrderDto } from "../../dto/OrderDto"

/**
 * This interface defines the contract for a repository dealing with order data.
 */
export interface IOrderRepository {
  /**
   * Creates a new order with the specified products, user, and quantities.
   * @param product_id An array of product IDs included in the order.
   * @param user_id The ID of the user placing the order.
   * @param quantity An array of quantities for each product in the order.
   * @returns A promise that resolves with the created OrderDto object.
   */
  createOrder(product_id: string[], user_id: string, quantity: number[]): Promise<OrderDto>;

  /**
   * Retrieves a paginated list of orders.
   * @param page Optional page number for pagination.
   * @param limit Optional limit of orders per page for pagination.
   * @returns A promise that resolves with an array of OrderDto objects.
   */
  getOrders(page?: number, limit?: number): Promise<OrderDto[]>;

  /**
   * Retrieves a single order by its ID.
   * @param order_id The ID of the order to retrieve.
   * @returns A promise that resolves with an OrderDto object if found, otherwise null.
   */
  getOrderById(order_id: string): Promise<OrderDto>;

  /**
   * Retrieves orders placed by a specific user, optionally paginated.
   * @param user_id The ID of the user whose orders to retrieve.
   * @param page Optional page number for pagination.
   * @param limit Optional limit of orders per page for pagination.
   * @returns A promise that resolves with an array of OrderDto objects.
   */
  getOrdersByUser(user_id: string, page?: number, limit?: number): Promise<OrderDto[]>;

  /**
   * Updates the status of an order.
   * @param order_id The ID of the order to update.
   * @param status The new status of the order.
   * @param end_date Optional end date of the order, relevant for some statuses.
   * @returns A promise that resolves with the updated OrderDto object.
   */
  updateOrderStatus(order_id: string, status: string, end_date?: Date): Promise<OrderDto>;

  /**
   * Deletes an order by its ID.
   * @param order_id The ID of the order to delete.
   * @returns A promise that resolves with the deleted OrderDto object.
   */
  deleteOrder(order_id: string): Promise<OrderDto>;
}