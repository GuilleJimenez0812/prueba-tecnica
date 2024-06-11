import express from 'express'
import { ProductService } from '../services/productService'
import { CustomRequest } from '../dto/Request'

export class ProductController {
  constructor(private productService: ProductService = new ProductService()) {
    this.productService = productService
    this.getProductsByAvailability = this.getProductsByAvailability.bind(this)
    this.createProduct = this.createProduct.bind(this)
    this.deleteProductById = this.deleteProductById.bind(this)
    this.updateProductById = this.updateProductById.bind(this)
    this.createProductsBatch = this.createProductsBatch.bind(this)
    this.updateProductsBatch = this.updateProductsBatch.bind(this)
    this.deleteProductsBatch = this.deleteProductsBatch.bind(this)
    this.getProducts = this.getProducts.bind(this)
  }

  async getProducts(req: CustomRequest, res: express.Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const products = await this.productService.obtainProducts(page, limit)
      return res.status(200).json(products)
    } catch (err) {
      return res.status(400).json({ error: 'Failed to fetch products' })
    }
  }

  async getProductsByAvailability(req: CustomRequest, res: express.Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const products = await this.productService.obtainProductsByAvailability(page, limit)
      return res.status(200).json(products)
    } catch (err) {
      return res.status(400).json({ error: 'Failed to fetch products' })
    }
  }

  async createProduct(req: CustomRequest, res: express.Response) {
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

  async deleteProductById(req: CustomRequest, res: express.Response) {
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

  async updateProductById(req: CustomRequest, res: express.Response) {
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

  async createProductsBatch(req: CustomRequest, res: express.Response) {
    try {
      const productsData = req.body
      const createdProducts = await this.productService.createProductsBatch(productsData)
      return res.status(201).json(createdProducts)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create products batch' })
    }
  }

  async updateProductsBatch(req: CustomRequest, res: express.Response) {
    try {
      const productsData = req.body
      const updatedProducts = await this.productService.updateProductsBatch(productsData)
      return res.status(200).json(updatedProducts)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update products batch' })
    }
  }

  async deleteProductsBatch(req: CustomRequest, res: express.Response) {
    try {
      const productIds = req.body
      const deletedProductIds = await this.productService.deleteProductsBatch(productIds)
      return res.status(200).json({ deletedProductIds })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete products batch' })
    }
  }
}
