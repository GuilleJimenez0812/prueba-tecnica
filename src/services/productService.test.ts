import { describe, expect, it, vi } from 'vitest'
import { ProductService } from './productService'

const productService = new ProductService()

describe('nameProductAlreadyExists', (): void => {
    it('should be a function', (): void => {
        expect(typeof productService.nameProductAlreadyExists).toBe('function')
    })

    
})