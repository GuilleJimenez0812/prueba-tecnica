import express from 'express'
import { ProductService } from '../services/productService'

export class ProductController {
  private productService: ProductService

  constructor() {
    this.productService = new ProductService()
    this.getProductsByAvailability = this.getProductsByAvailability.bind(this)
    this.createProduct = this.createProduct.bind(this)
    this.deleteProductById = this.deleteProductById.bind(this)
    this.updateProductById = this.updateProductById.bind(this)
  }


  async getProductsByAvailability(req: express.Request, res: express.Response) {
    try {
      const products = await this.productService.obtainProductsByAvailability()
      return res.status(200).json(products)
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: 'Failed to fetch products' })
    }
  }

  async createProduct(req: express.Request, res: express.Response) {
    try {
      const productData = req.body
      const product = await this.productService.createProduct(productData)
      return res.status(201).json(product)
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: 'Failed to create product' })
    }
  }

  async deleteProductById(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params
      const deletedProduct = await this.productService.deleteProductById(id)
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' })
      }
      return res.json(deletedProduct)
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: 'Failed to delete product' })
    }
  }

  async updateProductById(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params
      const productData = req.body
      const updatedProduct = await this.productService.updateProductById(id, productData)
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' })
      }
      return res.status(200).json(updatedProduct)
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: 'Failed to update product' })
    }
  }
}
