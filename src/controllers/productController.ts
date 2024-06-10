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
    this.createProductsBatch = this.createProductsBatch.bind(this)
    this.updateProductsBatch = this.updateProductsBatch.bind(this)
    this.deleteProductsBatch = this.deleteProductsBatch.bind(this)
  }

  async getProductsByAvailability(req: express.Request, res: express.Response) {
    try {
      const products = await this.productService.obtainProductsByAvailability()
      return res.status(200).json(products)
    } catch (err) {
      return res.status(400).json({ error: 'Failed to fetch products' })
    }
  }

  async createProduct(req: express.Request, res: express.Response) {
    try {
      const productData = req.body
      const product = await this.productService.createProduct(productData)
      return res.status(201).json(product)
    } catch (err) {
      const statusCode = err.statusCode || 500
      const message = err.message || 'An unexpected error occurred'

      return res.status(statusCode).json({ error: { statusCode, message } })
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
      return res.status(400).json({ error: 'Failed to update product' })
    }
  }

  async createProductsBatch(req: express.Request, res: express.Response) {
    try {
      const productsData = req.body
      const createdProducts = await this.productService.createProductsBatch(productsData)
      return res.status(201).json(createdProducts)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create products batch' })
    }
  }

  async updateProductsBatch(req: express.Request, res: express.Response) {
    try {
      const productsData = req.body
      const updatedProducts = await this.productService.updateProductsBatch(productsData)
      return res.status(200).json(updatedProducts)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update products batch' })
    }
  }

  async deleteProductsBatch(req: express.Request, res: express.Response) {
    try {
      const productIds = req.body
      const deletedProductIds = await this.productService.deleteProductsBatch(productIds)
      return res.status(200).json({ deletedProductIds })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete products batch' })
    }
  }
}