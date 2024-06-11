import { MongoProductRepository } from '../repository/MongoDB/MongoProductRepository'
import { IProductRepository } from '../repository/Interfaces/IProductRepository'
import { CustomError } from '../dto/customError'
import { ProductDto } from '../dto/ProductDto'

export class ProductService {
  constructor(private productRepository: IProductRepository = new MongoProductRepository()) {
    this.productRepository = productRepository
  }

  async obtainProducts() {
    return await this.productRepository.getProducts()
  }

  async obtainProductById(id: string) {
    return await this.productRepository.getProductById(id)
  }

  async obtainProductByProductName(productName: string) {
    return await this.productRepository.getProductByProductName(productName)
  }

  async obtainProductsByAvailability() {
    return await this.productRepository.getProductByAvailability()
  }

  async createProduct(value: Record<string, any>) {
    if (this.nameProductAlreadyExists(value.product_name)) throw new CustomError(`Product ${value.product_name} already exists`, 409)

    return await this.productRepository.createProduct(value)
  }

  async deleteProductById(id: string) {
    return await this.productRepository.deleteProductById(id)
  }

  async updateProductById(id: string, values: Record<string, any>) {
    return await this.productRepository.updateProductById(id, values)
  }

  //Batch Operations

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

  async updateProductsBatch(productsData: Record<string, any>[]): Promise<ProductDto[]> {
    const updatedProducts = []
    for (const productData of productsData) {
      const updatedProduct = await this.productRepository.updateProductById(productData.id, productData)
      if (updatedProduct) {
        updatedProducts.push(updatedProduct)
      }
    }
    return updatedProducts
  }

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

  async nameProductAlreadyExists(product_name: string): Promise<boolean> {
    const product = await this.productRepository.getProductByProductName(product_name)
    return !!product
  }

  async checkAvailability(product_id: string, order_quantity: number): Promise<boolean> {
    let product = await this.obtainProductById(product_id)

    if (product.availability < order_quantity) return false

    await this.updateAvailability(product, order_quantity)
    return true
  }

  async updateAvailability(product: ProductDto, order_quantity: number) {
    product.availability -= order_quantity
    await this.updateProductById(product._id, product)
  }

  async restoreAvailability(product_id: string, order_quantity: number) {
    const product: ProductDto = await this.obtainProductById(product_id)

    product.availability += order_quantity
    await this.updateProductById(product._id, product)
  }
}
