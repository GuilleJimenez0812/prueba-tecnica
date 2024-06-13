import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OrderService } from './orderService'
import { CustomError } from '../dto/customError'
import { ProductService } from './productService'
import { OrderDto } from '../dto/OrderDto'
import { IOrderRepository } from '../repository/Interfaces/IOrderRepository'
import { MongoOrderRepository } from '../repository/MongoDB/MongoOrderRepository'

const productService = vi.mocked(new ProductService())
const orderRepository = vi.mocked(new MongoOrderRepository())
const orderService = new OrderService(productService, orderRepository)

describe('createOrder', (): void => {
  it('should be a function', (): void => {
    expect(typeof orderService.createOrder).toBe('function')
  })

  it('should throw an error if the product is not available', async () => {
    vi.spyOn(productService, 'checkAvailability').mockResolvedValue(false)
    vi.spyOn(productService, 'obtainProductById').mockResolvedValue({
      _id: 'some-id',
      product_name: 'existing product',
      price: 100,
      description: 'A product description',
      availability: 20,
    })

    await expect(orderService.createOrder(['some-id'], 'user-id', [21])).rejects.toThrowError(CustomError)
  })
})

describe('verifyOrderOwnership', (): void => {
  it('should be a function', (): void => {
    expect(typeof orderService.verifyOrderOwnership).toBe('function')
  })

  it('should throw an error if ther is no order', async () => {
    await expect(orderService.verifyOrderOwnership(null, 'user-id')).rejects.toThrowError(CustomError)
  })

  it("should throw an error if the user ID does not match the order's user ID", async () => {
    const mockOrder: OrderDto = {
      _id: 'some-id',
      user: {
        _id: 'different-user-id', // Different from the user_id passed to verifyOrderOwnership
        username: 'testUser',
        email: 'test@example.com',
      },
      products: [
        {
          _id: 'product-id',
          product_name: 'Test Product',
          description: 'A product for testing',
          price: 9.99,
          availability: 100,
        },
      ],
      quantity: [1],
      status: 'validating order',
    }

    await expect(orderService.verifyOrderOwnership(mockOrder, 'user-id')).rejects.toThrowError(CustomError)
  })
})

describe('OrderService.getNextOrderStatus', () => {
  it('should return "order sent" when current status is "validating order"', () => {
    const nextStatus = orderService['getNextOrderStatus']('validating order')
    expect(nextStatus).toEqual('order sent')
  })

  it('should return "order received" when current status is "order sent"', () => {
    const nextStatus = orderService['getNextOrderStatus']('order sent')
    expect(nextStatus).toEqual('order received')
  })

  it('should throw a CustomError when current status is "order received"', () => {
    expect(() => {
      orderService['getNextOrderStatus']('order received')
    }).toThrow(CustomError)
    expect(() => {
      orderService['getNextOrderStatus']('order received')
    }).toThrow('Cannot update status. Order already in the final status "order received".')
  })

  it('should throw a CustomError when current status is "canceled"', () => {
    expect(() => {
      orderService['getNextOrderStatus']('canceled')
    }).toThrow(CustomError)
    expect(() => {
      orderService['getNextOrderStatus']('canceled')
    }).toThrow('Cannot update status. Order is canceled.')
  })

  it('should throw a CustomError for an invalid status', () => {
    expect(() => {
      orderService['getNextOrderStatus']('invalid status')
    }).toThrow(CustomError)
    expect(() => {
      orderService['getNextOrderStatus']('invalid status')
    }).toThrow('Invalid order status')
  })
})

describe('OrderService.cancelOrder', () => {
  const mockOrder: OrderDto = {
    _id: 'some-id',
    user: {
      _id: 'different-user-id',
      username: 'testUser',
      email: 'test@example.com',
    },
    products: [
      {
        _id: 'product-id',
        product_name: 'Test Product',
        description: 'A product for testing',
        price: 9.99,
        availability: 100,
      },
    ],
    quantity: [1],
    status: 'validating order',
  }
  it('should be a function', () => {
    expect(typeof orderService.cancelOrder).toBe('function')
  })

  it('should throw an error if order status es order received', async () => {
    vi.spyOn(orderRepository, 'getOrderById').mockResolvedValue(mockOrder)
    vi.spyOn(orderService, 'verifyOrderStatusIsOrderReceived').mockResolvedValue(false)

    await expect(orderService.cancelOrder('some-id', 'different-user-id')).rejects.toThrowError(CustomError)
  })
})

describe('verifyOrderStatusIsOrderReceived', () => {
  
  it('should return false if the order status is "order received"', async () => {
    const mockOrder: OrderDto = {
      _id: 'some-id',
      user: {
        _id: 'different-user-id',
        username: 'testUser',
        email: 'test@example.com',
      },
      products: [
        {
          _id: 'product-id',
          product_name: 'Test Product',
          description: 'A product for testing',
          price: 9.99,
          availability: 100,
        },
      ],
      quantity: [1],
      status: 'validating order',
    }
    const result = await orderService.verifyOrderStatusIsOrderReceived(mockOrder)
    expect(result).toBe(false)
  })
})
