import express from 'express'

import authentication from './authenticationRouter'
import users from './userRouter'
import products from './productRouter'
import order from './orderRouter'

const router = express.Router()

export default (): express.Router => {
    authentication(router)
    users(router)
    products(router)
    order(router)
    
    return router
}