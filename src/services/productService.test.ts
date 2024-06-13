import { describe, expect, it, vi } from 'vitest'
import { ProductService } from './productService'
import { MongoProductRepository } from '../repository/MongoDB/MongoProductRepository'
import { ProductDto } from '../dto/ProductDto'

const productRepositoryMock = vi.mocked(new MongoProductRepository(), true)
const productService = new ProductService(productRepositoryMock)

describe('nameProductAlreadyExists', (): void => {
  it('should be a function', (): void => {
    expect(typeof productService.nameProductAlreadyExists).toBe('function')
  })

  it('should return false if the product does not exist', async () => {
    // Mock the response of getProductByProductName to simulate that the product does not exist
    vi.spyOn(productRepositoryMock, 'getProductByProductName').mockResolvedValue(null)

    const result = await productService.nameProductAlreadyExists('nonexistent product')
    expect(result).toBe(false)
  })

  it('should return true if the product exists', async () => {
    // Mock the response of getProductByProductName to simulate that the product exists
    const mockProductDto: ProductDto = {
      _id: 'some-id',
      product_name: 'existing product',
      price: 100,
      description: 'A product description',
      availability: 20,
    }
    vi.spyOn(productRepositoryMock, 'getProductByProductName').mockResolvedValue(mockProductDto)

    const result = await productService.nameProductAlreadyExists('existing product')
    expect(result).toBe(true)
  })
})

describe('checkAvailability', (): void => {
  it('should be a function', (): void => {
    expect(typeof productService.checkAvailability).toBe('function')
  })

  it('should return false when order_quantity is greater than availability', async () => {
    const mockProductDto: ProductDto = {
      _id: 'some-id',
      product_name: 'existing product',
      price: 100,
      description: 'A product description',
      availability: 20,
    }

    vi.spyOn(productService, 'obtainProductById').mockResolvedValue(mockProductDto)

    const result = await productService.checkAvailability('some-id', 21)
    expect(result).toBe(false)
  })

  it('should return true when order_quantity is less than availability', async () => {
    const mockProductDto: ProductDto = {
      _id: 'some-id',
      product_name: 'existing product',
      price: 100,
      description: 'A product description',
      availability: 20,
    }

    vi.spyOn(productService, 'obtainProductById').mockResolvedValue(mockProductDto)
    vi.spyOn(productService, 'updateAvailability').mockResolvedValue()

    const result = await productService.checkAvailability('some-id', 19)
    expect(result).toBe(true)
  })
})
