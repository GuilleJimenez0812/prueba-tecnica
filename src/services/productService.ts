import { MongoProductRepository } from '../repository/MongoDB/MongoProductRepository'
import { IProductRepository } from '../repository/Interfaces/IProductRepository'
import { CustomError } from '../dto/customError'
import { ProductDto } from '../dto/ProductDto'

export class ProductService {
  constructor(private productRepository: IProductRepository = new MongoProductRepository()) {
    this.productRepository = productRepository
  }

  /**
   * Retrieves a list of products with optional pagination.
   * @param page (Optional) The page number of the products to retrieve, for pagination.
   * @param limit (Optional) The maximum number of products to retrieve per page, for pagination.
   * @returns A promise that resolves with an array of product objects.
   */
  async obtainProducts(page?: number, limit?: number) {
    return await this.productRepository.getProducts(page, limit)
  }

  /**
   * Retrieves a single product by its unique identifier.
   * @param id The unique identifier of the product to retrieve.
   * @returns A promise that resolves with the product object.
   */
  async obtainProductById(id: string) {
    return await this.productRepository.getProductById(id)
  }

  /**
   * Retrieves a single product by its name.
   * @param productName The name of the product to retrieve.
   * @returns A promise that resolves with the product object.
   */
  async obtainProductByProductName(productName: string) {
    return await this.productRepository.getProductByProductName(productName)
  }

  /**
   * Retrieves a list of products that are available, with optional pagination.
   * @param page (Optional) The page number of the products to retrieve, for pagination.
   * @param limit (Optional) The maximum number of products to retrieve per page, for pagination.
   * @returns A promise that resolves with an array of product objects.
   */
  async obtainProductsByAvailability(page?: number, limit?: number) {
    return await this.productRepository.getProductByAvailability(page, limit)
  }

  /**
   * Creates a new product.
   * @param value A record containing the product details.
   * @throws `CustomError` if a product with the same name already exists.
   * @returns A promise that resolves with the created product object.
   */
  async createProduct(value: Record<string, any>) {
    if (await this.nameProductAlreadyExists(value.product_name)) throw new CustomError(`Product ${value.product_name} already exists`, 409)

    return await this.productRepository.createProduct(value)
  }

  /**
   * Deletes a product by its unique identifier.
   * @param id The unique identifier of the product to delete.
   * @returns A promise that resolves with the result of the deletion operation.
   */
  async deleteProductById(id: string) {
    return await this.productRepository.deleteProductById(id)
  }

  /**
   * Updates a product by its unique identifier.
   * @param id The unique identifier of the product to update.
   * @param values A record containing the product details to update.
   * @returns A promise that resolves with the updated product object.
   */
  async updateProductById(id: string, values: Record<string, any>) {
    return await this.productRepository.updateProductById(id, values)
  }

  //Batch Operations

  /**
   * Creates a batch of products.
   * @param productsData An array of records, each containing the data for a product to be created.
   * @returns A promise that resolves with an array of `ProductDto` objects representing the created products.
   */
  async createProductsBatch(productsData: Record<string, any>[]): Promise<ProductDto[]> {
    const createdProducts = []
    for (const productData of productsData) {
      if (!(await this.nameProductAlreadyExists(productData.product_name))) {
        const createdProduct = await this.productRepository.createProduct(productData)
        createdProducts.push(createdProduct)
      }
    }
    return createdProducts
  }

  /**
   * Updates a batch of products.
   * @param productsData An array of records, each containing the updated data for a product, including its unique identifier.
   * @returns A promise that resolves with an array of `ProductDto` objects representing the updated products.
   */
  async updateProductsBatch(productsData: Record<string, any>[]): Promise<ProductDto[]> {
    const updatedProducts = []
    for (const productData of productsData) {
      const updatedProduct = await this.productRepository.updateProductById(productData._id, productData)
      if (updatedProduct) {
        updatedProducts.push(updatedProduct)
      }
    }
    return updatedProducts
  }

  /**
   * Deletes a batch of products by their unique identifiers.
   * @param productIds An array of strings, each representing the unique identifier of a product to be deleted.
   * @returns A promise that resolves with an array of strings representing the unique identifiers of the products that were successfully deleted.
   */
  async deleteProductsBatch(productIds: string[]): Promise<string[]> {
    const deletedProductIds = []
    for (const productId of productIds) {
      const deletedProduct = await this.productRepository.deleteProductById(productId)
      if (deletedProduct) {
        deletedProductIds.push(productId)
      }
    }
    return deletedProductIds
  }

  /**
   * Checks if a product with the given name already exists.
   * @param product_name The name of the product to check for existence.
   * @returns A promise that resolves with a boolean indicating whether the product exists.
   */
  async nameProductAlreadyExists(product_name: string): Promise<boolean> {
    const product = await this.productRepository.getProductByProductName(product_name)
    return !!product
  }

  /**
   * Checks if the specified quantity of a product is available.
   * @param product_id The unique identifier of the product.
   * @param order_quantity The quantity of the product requested in an order.
   * @returns A promise that resolves with a boolean indicating whether the product is available in the requested quantity.
   */
  async checkAvailability(product_id: string, order_quantity: number): Promise<boolean> {
    let product = await this.obtainProductById(product_id)

    if (product.availability < order_quantity) return false

    await this.updateAvailability(product, order_quantity)
    return true
  }

  /**
   * Updates the availability of a product by subtracting the ordered quantity.
   * @param product A `ProductDto` object representing the product to update.
   * @param order_quantity The quantity of the product ordered.
   */
  async updateAvailability(product: ProductDto, order_quantity: number) {
    product.availability -= order_quantity
    await this.updateProductById(product._id, product)
  }

  /**
   * Restores the availability of a product by adding back a specified quantity.
   * @param product A `ProductDto` object representing the product to update.
   * @param order_quantity The quantity to add back to the product's availability.
   */
  async restoreAvailability(product: ProductDto, order_quantity: number) {
    product.availability += order_quantity
    await this.updateProductById(product._id, product)
  }
}
