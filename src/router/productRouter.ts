import { AuthenticationMiddleware } from "../middlewares/authenticationMiddleware"
import { ProductController } from "../controllers/productController"
import express from "express"
import { createProductSchema, productsBatchSchema, updateProductSchema, updateProductsBatchSchema } from '../dto/zodSchema/zodProducts'

export default (router: express.Router) => {
    const authMiddleware = new AuthenticationMiddleware()
    const productController = new ProductController()
    router.get('/products', authMiddleware.verify, productController.getProducts)
    router.get('/products-availability', authMiddleware.verify, productController.getProductsByAvailability)
    router.post('/products', authMiddleware.validate(createProductSchema), authMiddleware.verify, productController.createProduct)
    router.delete('/products/:id', authMiddleware.verify, productController.deleteProductById)
    router.patch('/products/:id', authMiddleware.validate(updateProductSchema), authMiddleware.verify, productController.updateProductById)

    //Batch operations
    router.post('/products/batch', authMiddleware.validate(productsBatchSchema), authMiddleware.verify, productController.createProductsBatch)
    router.patch('/products-batch', authMiddleware.validate(updateProductsBatchSchema), authMiddleware.verify, productController.updateProductsBatch)
    router.delete('/products-batch', authMiddleware.verify, productController.deleteProductsBatch)
}