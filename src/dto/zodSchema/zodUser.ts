import { z } from 'zod'

export const updateUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
})
