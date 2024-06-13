import { ProductDto } from '../../dto/ProductDto'

/**
 * This interface defines the contract for a repository dealing with product data.
 */
export interface IProductRepository {
  /**
   * Retrieves a paginated list of products.
   * @param page Optional page number for pagination.
   * @param limit Optional limit of products per page for pagination.
   * @returns A promise that resolves with an array of ProductDto objects.
   */
  getProducts(page?: number, limit?: number): Promise<ProductDto[]>

  /**
   * Retrieves a single product by its ID.
   * @param id The ID of the product to retrieve.
   * @returns A promise that resolves with a ProductDto object if found, otherwise null.
   */
  getProductById(id: string): Promise<ProductDto | null>

  /**
   * Retrieves a single product by its name.
   * @param productName The name of the product to retrieve.
   * @returns A promise that resolves with a ProductDto object if found, otherwise null.
   */
  getProductByProductName(productName: string): Promise<ProductDto | null>

  /**
   * Retrieves products based on their availability.
   * @param page Optional page number for pagination.
   * @param limit Optional limit of products per page for pagination.
   * @returns A promise that resolves with an array of ProductDto objects if any are available, otherwise null.
   */
  getProductByAvailability(page?: number, limit?: number): Promise<ProductDto[] | null>

  /**
   * Creates a new product with the provided values.
   * @param value A record containing the values for the new product.
   * @returns A promise that resolves with the created ProductDto object.
   */
  createProduct(value: Record<string, any>): Promise<ProductDto>

  /**
   * Deletes a product by its ID.
   * @param id The ID of the product to delete.
   * @returns A promise that resolves with the result of the deletion operation.
   */
  deleteProductById(id: string): Promise<any>

  /**
   * Updates a product by its ID with the provided values.
   * @param id The ID of the product to update.
   * @param values A record containing the values to update the product with.
   * @returns A promise that resolves with the updated ProductDto object.
   */
  updateProductById(id: string, values: Record<string, any>): Promise<ProductDto>
}
