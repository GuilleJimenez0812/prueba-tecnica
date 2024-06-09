import express from 'express'

import authentication from './authenticationRouter'
import users from './userRouter'

const router = express.Router()

export default (): express.Router => {
    authentication(router)
    users(router)
    
    return router
}