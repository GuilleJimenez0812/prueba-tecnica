import { describe, expect, it, vi } from 'vitest'
import { OrderService } from './orderService'
import { CustomError } from '../dto/customError'
import { ProductService } from './productService'

const mockProductService: Partial<ProductService> = {
  checkAvailability: vi.fn(),
}

const authService = new OrderService(mockProductService as ProductService)

describe('createOrder', (): void => {
  it('should be a function', (): void => {
    expect(typeof authService.createOrder).toBe('function')
  })

  it('should throw error if first param is not a string', async (): Promise<void> => {
      await expect(authService.createOrder(2 as any, 'user_id', 1)).rejects.toThrow(CustomError)
  })
  it('should throw error if second param is not a string', async (): Promise<void> => {
    await expect(authService.createOrder('product_id', 0 as any, 1)).rejects.toThrow(CustomError)
  })
  it('should throw error if thirt param is not a number', async (): Promise<void> => {
    await expect(authService.createOrder('product_id', 'user_id', 'number')).rejects.toThrow(CustomError)
  })

  it('should throw error if quantity is greater than the product available', async (): Promise<void> => {
    mockProductService.checkAvailability.mockResolvedValue(false)

    await expect(authService.createOrder('product_id', 'user_id', 100)).rejects.toThrow(CustomError)
  })
})