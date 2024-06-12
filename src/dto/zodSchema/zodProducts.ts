import { z } from 'zod'

// Esquema para la creación de un producto
const createProductSchema = z.object({
  product_name: z.string().min(1, 'El nombre del producto es requerido'),
  description: z.string().min(1, 'La descripción del producto es requerida'),
  price: z.number().positive('El precio debe ser un número positivo'),
  availability: z.number().int('La disponibilidad debe ser un número entero'),
})

// Esquema para la actualización de un producto
// Se permite que todos los campos sean opcionales para la actualización
const updateProductSchema = z.object({
  product_name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  availability: z.number().int().optional(),
})

// Esquema para la actualización o creación de un lote de productos
// Utiliza un array de createProductSchema para validar un arreglo de productos
const productsBatchSchema = z.array(createProductSchema)

const updateProductsBatchSchema = z.array(updateProductSchema)

export { createProductSchema, updateProductSchema, productsBatchSchema, updateProductsBatchSchema }
