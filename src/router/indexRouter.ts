import express from 'express'

import authentication from './authenticationRouter'
import users from './userRouter'
import products from './productRouter'
import order from './orderRouter'

const router = express.Router()

/**
 * Main Router in the API
 */
export default (): express.Router => {
    //Authentication Router
    authentication(router)

    //user Router
    users(router)
    
    //Product Router
    products(router)

    //Orders Router
    order(router)
    
    return router
}