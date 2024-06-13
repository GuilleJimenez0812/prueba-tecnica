import { describe, expect, it, vi } from 'vitest'
import { UserService } from './userService'
import { MongoUserRepository } from '../repository/MongoDB/MongoUserRepository'
import { CustomError } from '../dto/customError'

const userRepositoryMock = vi.mocked(new MongoUserRepository())
const userService = new UserService(userRepositoryMock)

describe('isEmailRegistered', (): void => {
    it('should be a function', (): void => {
      expect(typeof userService.isEmailRegistered).toBe('function')
    })

    it('should throw CustomError if the email is already registered', async (): Promise<void> => {
      // Mock the userRepository's getUserByEmail method to simulate finding an existing user
        vi.spyOn(userRepositoryMock, 'getUserByEmail').mockResolvedValue({ _id: '123', email: 'test@example.com', username: 'test' })
      // Define the updateValues object with an email that is already registered
      const updateValues = { email: 'test@example.com' }

      // Expect the isEmailRegistered method to throw a CustomError
      await expect(userService['isEmailRegistered'](updateValues)).rejects.toThrow(CustomError)
      await expect(userService['isEmailRegistered'](updateValues)).rejects.toHaveProperty('message', 'Email already registered')
      await expect(userService['isEmailRegistered'](updateValues)).rejects.toHaveProperty('statusCode', 400)
    })
})