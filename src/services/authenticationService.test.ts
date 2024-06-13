import { describe, expect, it, vi } from 'vitest'
import bcryptjs from 'bcryptjs'
import { AuthenticationService } from './authenticationService'
import { UserService } from './userService'
import { CustomError } from '../dto/customError'
import { UserDto } from '../dto/UserDto'

const userService = vi.mocked(new UserService())
const bcryptjsMock = vi.mocked(bcryptjs)
const authService = new AuthenticationService(userService)

describe('validateLoginRequest', (): void => {
    it('should be a function', (): void => {
        expect(typeof authService.login).toBe('function')
    })

    it('should throw an error for invalid email', async () => {
      vi.spyOn(userService, 'findUserByEmailWithPassword').mockResolvedValue(null)
      vi.spyOn(bcryptjs, 'compare').mockResolvedValue(false) // Asegúrate de espiar bcryptjs directamente si bcryptjsMock no funciona como esperado.

      await expect(authService.login('nonexistent@example.com', 'password')).rejects.toThrow(CustomError)
    })

    it('should throw an error for invalid password', async () => {
      const mockUser = { _id: '123', email: 'test@example.com', password: 'hashedpassword', username: 'testuser' }
      vi.spyOn(UserService.prototype, 'findUserByEmail').mockResolvedValue(mockUser)
      vi.spyOn(bcryptjs, 'compare').mockResolvedValue(false)

      await expect(authService.login('nonexistent@example.com', 'wrongpassword')).rejects.toThrow(CustomError)
    })

    it('should return a token for valid credentials', async () => {
      const mockUser = { _id: '123', email: 'test@example.com', password: 'hashedpassword', username: 'testuser' }
      vi.spyOn(userService, 'findUserByEmailWithPassword').mockResolvedValue(mockUser)
      vi.spyOn(bcryptjs, 'compare').mockResolvedValue(true)
      vi.spyOn(authService, 'generateToken').mockReturnValue('validToken123')

      expect(await authService.login('test@example.com', 'password')).toHaveProperty('token')
    })
})

describe('register', (): void => {
  it('should be a function', (): void => {
    expect(typeof authService.register).toBe('function')
  })

  it('should return an error if user already exists', async () => {
    const mockUser: UserDto = {
      _id: '123',
      email: 'existing@example.com',
      username: 'existinguser'
    }
    vi.spyOn(userService, 'findUserByEmail').mockResolvedValue(mockUser)
    await expect(authService.register('existing@example.com', 'password', 'username')).rejects.toThrowError(CustomError)
  })

  it('should return a user object for successful registration', async () => {
    vi.spyOn(userService, 'findUserByEmail').mockResolvedValue(null)
    vi.spyOn(userService, 'registerUser').mockResolvedValue({
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