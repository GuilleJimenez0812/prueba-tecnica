import { config }  from 'dotenv'
config()

export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRES = process.env.JWT_EXPIRES
export const MONGO_URL = process.env.MONGO_URL
export const PORT = process.env.PORT