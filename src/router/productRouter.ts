import { AuthenticationMiddleware } from "../middlewares/authenticationMiddleware"
import { ProductController } from "../controllers/productController"
import express from "express"

export default (router: express.Router) => {
    const authMiddleware = new AuthenticationMiddleware()
    const productController = new ProductController()
    router.get('/products', authMiddleware.verify, productController.getProducts)
    router.get('/products-availability', authMiddleware.verify, productController.getProductsByAvailability)
    router.post('/products', authMiddleware.verify, productController.createProduct)
    router.delete('/products/:id', authMiddleware.verify, productController.deleteProductById)
    router.patch('/products/:id', authMiddleware.verify, productController.updateProductById)

    //Batch operations
    router.post('/products/batch', authMiddleware.verify, productController.createProductsBatch)
    router.patch('/products-batch', authMiddleware.verify, productController.updateProductsBatch)
    router.delete('/products-batch', authMiddleware.verify, productController.deleteProductsBatch)
}