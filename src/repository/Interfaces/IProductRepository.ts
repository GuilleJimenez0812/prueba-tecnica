import { ProductDto } from "../../dto/ProductDto"

export interface IProductRepository {
  getProducts(): Promise<ProductDto[]>
  getProductById(id: string): Promise<ProductDto | null>
  getProductByProductName(productName: string): Promise<ProductDto | null>
  getProductByAvailability(): Promise<ProductDto[] | null>
  createProduct(value: Record<string, any>): Promise<ProductDto>
  deleteProductById(id: string): Promise<any>
  updateProductById(id: string, values: Record<string, any>): Promise<ProductDto>
}