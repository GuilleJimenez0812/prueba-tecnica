import { ProductDto } from '../../dto/ProductDto'
import { ProductModel } from '../../schemas/productSchema'
import { IProductRepository } from '../Interfaces/IProductRepository' 

export class MongoProductRepository implements IProductRepository {
  async getProducts(page: number = 1, limit: number = 10): Promise<ProductDto[]> {
    const skip = (page - 1) * limit
    return ProductModel.find()
      .skip(skip)
      .limit(limit)
      .then((products) => products.map((product) => product.toObject()))
  }

  async getProductById(id: string): Promise<ProductDto | null> {
    return ProductModel.findById(id).then((product) => product?.toObject())
  }

  async getProductByProductName(productName: string): Promise<ProductDto | null> {
    return ProductModel.findOne({ product_name: productName }).then((product) => product?.toObject())
  }

  async getProductByAvailability(page: number = 1, limit: number = 10): Promise<ProductDto[]> {
    const skip = (page - 1) * limit
    return ProductModel.find({ availability: { $ne: 0 } })
      .skip(skip)
      .limit(limit)
      .then((products) => products.map((product) => product.toObject()))
  }

  async createProduct(value: Record<string, any>): Promise<ProductDto> {
    return new ProductModel(value).save().then((product) => product.toObject())
  }

  async deleteProductById(id: string): Promise<any> {
    return ProductModel.findOneAndDelete({ _id: id })
  }

  async updateProductById(id: string, values: Record<string, any>): Promise<ProductDto> {
    return ProductModel.findByIdAndUpdate(id, values, { new: true }).then((product) => product?.toObject())
  }
}