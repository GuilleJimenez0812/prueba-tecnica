import { JWT_SECRET, JWT_EXPIRES } from '../congif'
import jwt from 'jsonwebtoken'

const extractTokenFromHeader = (header: string | string[]): string | null => {
  if (Array.isArray(header)) {
    header = header.join(' ')
  }
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    return header.slice(7)
  }
  return null
}

const validateLoginRequest = (email: string, password: string) => {
  return email && password
}

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

const validateRegisterRequest = (email: string, password: string, username: string) => {
  return email && password && username
}

const authenticationService = {
  extractTokenFromHeader,
  validateLoginRequest,
  generateToken,
  validateRegisterRequest,
}
export = authenticationService
