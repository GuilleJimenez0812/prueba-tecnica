import { ProductModel } from '../../schemas/productSchema'
import { IProductRepository } from '../Interfaces/IProductRepository' 

export class MongoProductRepository implements IProductRepository {
  async getProducts(): Promise<any[]> {
    return ProductModel.find().then((products) => products.map((product) => product.toObject()))
  }

  async getProductById(id: string): Promise<any | null> {
    return ProductModel.findById(id).then((product) => product?.toObject())
  }

  async getProductByProductName(productName: string): Promise<any | null> {
    return ProductModel.findOne({ product_name: productName }).then((product) => product?.toObject())
  }

  async getProductByAvailability(): Promise<any[]> {
    return ProductModel.find({ availability: { $ne: 0 } }).then((products) => products.map((product) => product.toObject()))
  }

  async createProduct(value: Record<string, any>): Promise<any> {
    return new ProductModel(value).save().then((product) => product.toObject())
  }

  async deleteProductById(id: string): Promise<any> {
    return ProductModel.findOneAndDelete({ _id: id })
  }

  async updateProductById(id: string, values: Record<string, any>): Promise<any> {
    return ProductModel.findByIdAndUpdate(id, values, { new: true }).then((product) => product?.toObject())
  }
}