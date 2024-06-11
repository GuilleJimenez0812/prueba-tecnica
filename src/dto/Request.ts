import { Request } from 'express'
import { UserDto } from './UserDto'
export interface CustomRequest extends Request {
    user?: any
}