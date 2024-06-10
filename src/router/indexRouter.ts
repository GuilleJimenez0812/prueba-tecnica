import express from 'express'

import authentication from './authenticationRouter'
import users from './userRouter'
import products from './productRouter'

const router = express.Router()

export default (): express.Router => {
    authentication(router)
    users(router)
    products(router)
    
    return router
}