import { z } from 'zod'
/* import { UserSchema } from './user' */

export const AuthResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
})

export type AuthResponse = z.infer<typeof AuthResponseSchema>

export const LoginRequestSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  grant_type: z.literal('password').default('password'),
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>

export { type User } from './user'
