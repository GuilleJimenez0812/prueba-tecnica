export interface IProductRepository {
    getProducts(): Promise<any[]>
    getProductById(id: string): Promise<any | null>
    getProductByProductName(productName: string): Promise<any | null>
    getProductByAvailability(availability: string): Promise<any | null>
    createProduct(value: Record<string, any>): Promise<any>
    deleteProductById(id: string): Promise<any>
    updateProductById(id: string, values: Record<string, any>): Promise<any>
}