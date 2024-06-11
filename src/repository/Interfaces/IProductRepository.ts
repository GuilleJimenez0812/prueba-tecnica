import { ProductDto } from "../../dto/ProductDto"

export interface IProductRepository {
  getProducts(page?: number, limit?: number): Promise<ProductDto[]>
  getProductById(id: string): Promise<ProductDto | null>
  getProductByProductName(productName: string): Promise<ProductDto | null>
  getProductByAvailability(page?: number, limit?: number): Promise<ProductDto[] | null>
  createProduct(value: Record<string, any>): Promise<ProductDto>
  deleteProductById(id: string): Promise<any>
  updateProductById(id: string, values: Record<string, any>): Promise<ProductDto>
}