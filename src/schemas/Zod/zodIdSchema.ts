import { z } from 'zod'

const idProductSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID'),
})

export { idProductSchema }