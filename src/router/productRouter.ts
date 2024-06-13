import { AuthenticationMiddleware } from '../middlewares/authenticationMiddleware'
import { ProductController } from '../controllers/productController'
import express from 'express'
import { createProductSchema, productsBatchSchema, updateProductSchema, updateProductsBatchSchema } from '../schemas/Zod/zodProducts'
import { idProductSchema } from '../schemas/Zod/zodIdSchema'

export default (router: express.Router) => {
  const authMiddleware = new AuthenticationMiddleware()
  const productController = new ProductController()

  // Obtain all product
  router.get('/products', authMiddleware.verify, productController.getProducts)
  // Obtain all available products
  router.get('/products-availability', authMiddleware.verify, productController.getProductsByAvailability)
  // Create a product
  router.post('/products', authMiddleware.validate(createProductSchema), authMiddleware.verify, productController.createProduct)
  // Delete a product
  router.delete('/products/:id', authMiddleware.validateId(idProductSchema), authMiddleware.verify, productController.deleteProductById)
  // Update a product
  router.patch(
    '/products/:id',
    authMiddleware.validateId(idProductSchema),
    authMiddleware.validate(updateProductSchema),
    authMiddleware.verify,
    productController.updateProductById,
  )

  //Batch operations
  // Create a batch of products
  router.post('/products/batch', authMiddleware.validate(productsBatchSchema), authMiddleware.verify, productController.createProductsBatch)
  // Update a batch of products
  router.patch('/products-batch', authMiddleware.validate(updateProductsBatchSchema), authMiddleware.verify, productController.updateProductsBatch)
  // Delete a batch of products
  router.delete('/products-batch', authMiddleware.verify, productController.deleteProductsBatch)
}
