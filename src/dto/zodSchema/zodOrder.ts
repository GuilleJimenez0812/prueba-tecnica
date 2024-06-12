import { z } from 'zod'

// Esquema para la creación de un pedido
const createOrderSchema = z.object({
  product_id: z.array(z.string()).min(1, 'Al menos un producto es requerido'),
  quantity: z.array(z.number().int().positive('La cantidad debe ser un número entero positivo')).min(1, 'Al menos una cantidad es requerida'),
})

// Esquema para la actualización del estado de un pedido
const updateOrderStatusSchema = z.object({
  status: z.enum(['validating order', 'order sent', 'order received', 'canceled']),
})

export { createOrderSchema, updateOrderStatusSchema }
