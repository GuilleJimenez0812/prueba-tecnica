import { describe, expect, it, vi } from 'vitest'
import bcryptjs from 'bcryptjs'
import { AuthenticationService } from './authenticationService'
import { UserService } from './userService'
import { CustomError } from '../dto/customError'

const authService = new AuthenticationService()

describe('validateLoginRequest', (): void => {
    it('should be a function', (): void => {
        expect(typeof authService.login).toBe('function')
    })

    it('should return an error if the first parameter is not a string', async () => {
      const result = await authService.login(2 as any, 'password')
      expect(result).toBeInstanceOf(Error)
      expect(result.message).toContain('The email does not match the format.')
    })

    it('should return an error if the second parameter is not a string', async () => {
      const result = await authService.login('email', 2 as any)
      expect(result).toBeInstanceOf(Error)
      expect(result.message).toContain('The password does not match the format.')
    })

    it('should throw an error for invalid email', async () => {
      vi.spyOn(UserService.prototype, 'findUserByEmail').mockResolvedValue(null)

      const result = await authService.login('nonexistent@example.com', 'password')
      expect(result).toBeInstanceOf(CustomError)
      expect(result.message).toContain('Invalid email or password.')
    })

    it('should throw an error for invalid password', async () => {
      const mockUser = { _id: '123', email: 'test@example.com', password: 'hashedpassword', username: 'testuser' }
      vi.spyOn(UserService.prototype, 'findUserByEmail').mockResolvedValue(mockUser)
      vi.spyOn(bcryptjs, 'compare').mockResolvedValue(false)

      const result = await authService.login('test@example.com', 'wrongpassword')
      expect(result).toBeInstanceOf(CustomError)
      expect(result.message).toContain('Invalid email or password.')
    })

    it('should return a token for valid credentials', async () => {
      const mockUser = { _id: '123', email: 'test@example.com', password: 'hashedpassword', username: 'testuser' }
      vi.spyOn(UserService.prototype, 'findUserByEmail').mockResolvedValue(mockUser)
      vi.spyOn(bcryptjs, 'compare').mockResolvedValue(true)

      const result = await authService.login('test@example.com', 'password')
      expect(result).toHaveProperty('token')
    })
})

describe('register', (): void => {
  it('should be a function', (): void => {
    expect(typeof authService.register).toBe('function')
  })

  it('should return an error if the email parameter is not a string', async () => {
    const result = await authService.register(2 as any, 'password', 'username')
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toContain('The email does not match the format.')
  })

  it('should return an error if the password parameter is not a string', async () => {
    const result = await authService.register('email@example.com', 2 as any, 'username')
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toContain('The password does not match the format.')
  })

  it('should return an error if the username parameter is not a string', async () => {
    const result = await authService.register('email@example.com', 'password', 2 as any)
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toContain('The username does not match the format.')
  })

  it('should return an error if user already exists', async () => {
    vi.spyOn(UserService.prototype, 'findUserByEmail').mockResolvedValue(true)
    const result = await authService.register('existing@example.com', 'password', 'username')
    expect(result).toBeInstanceOf(CustomError)
    expect(result.message).toContain('User already exists.')
  })

  it('should return a user object for successful registration', async () => {
    vi.spyOn(UserService.prototype, 'findUserByEmail').mockResolvedValue(null)
    vi.spyOn(UserService.prototype, 'registerUser').mockResolvedValue({
      _id: '123',
      email: 'new@example.com',
      password: 'hashedpassword',
      username: 'newuser',
    })

    const result = await authService.register('new@example.com', 'password', 'newuser')
    expect(result).toHaveProperty('_id')
    expect(result).toHaveProperty('email', 'new@example.com')
    expect(result).toHaveProperty('username', 'newuser')
  })
})

describe('extractTokenFromHeader', (): void => {
  it('should be a function', (): void => {
    expect(typeof authService.extractTokenFromHeader).toBe('function')
  })

  it('should return null for invalid header format', () => {
    const result = authService.extractTokenFromHeader('InvalidHeader')
    expect(result).toBeNull()
  })

  it('should return the token for a valid Bearer token header', () => {
    const result = authService.extractTokenFromHeader('Bearer validToken123')
    expect(result).toBe('validToken123')
  })
})

describe('validateLoginRequest', (): void => {
  it('should be a function', (): void => {
    expect(typeof authService.validateLoginRequest).toBe('function')
  })

  it('should return false for empty email or password', () => {
    expect(authService.validateLoginRequest('', 'password')).toBe(false)
    expect(authService.validateLoginRequest('email@example.com', '')).toBe(false)
  })

  it('should return true for non-empty email and password', () => {
    expect(authService.validateLoginRequest('email@example.com', 'password')).toBe(true)
  })
})

describe('generateToken', (): void => {
  it('should be a function', (): void => {
    expect(typeof authService.generateToken).toBe('function')
  })

  it('should return a token string', () => {
    const result = authService.generateToken('123')
    expect(typeof result).toBe('string')
    expect(result).not.toBe('')
  })
})

describe('validateRegisterRequest', (): void => {
  it('should be a function', (): void => {
    expect(typeof authService.validateRegisterRequest).toBe('function')
  })

  it('should return false for empty email, password, or username', () => {
    expect(authService.validateRegisterRequest('', 'password', 'username')).toBe(false)
    expect(authService.validateRegisterRequest('email@example.com', '', 'username')).toBe(false)
    expect(authService.validateRegisterRequest('email@example.com', 'password', '')).toBe(false)
  })

  it('should return true for non-empty email, password, and username', () => {
    expect(authService.validateRegisterRequest('email@example.com', 'password', 'username')).toBe(true)
  })
})

describe('encryptPassword', (): void => {
  it('should be a function', (): void => {
    expect(typeof authService.encryptPassword).toBe('function')
  })

  it('should return a hashed password', async () => {
    const result = await authService.encryptPassword('password')
    expect(typeof result).toBe('string')
    expect(result).not.toBe('password')
  })
})