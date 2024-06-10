import { MongoProductRepository } from "../repository/MongoDB/MongoProductRepository";
import { IProductRepository } from "../repository/Interfaces/IProductRepository";

export class ProductService {
  private productRepository: IProductRepository

  constructor() {
    this.productRepository = new MongoProductRepository()
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
    return await this.productRepository.createProduct(value)
  }

  async deleteProductById(id: string) {
    return await this.productRepository.deleteProductById(id)
  }

  async updateProductById(id: string, values: Record<string, any>) {
    return await this.productRepository.updateProductById(id, values)
  }
}