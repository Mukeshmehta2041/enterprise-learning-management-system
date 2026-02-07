import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  roles: z.array(z.string()),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>

export const UserProfileUpdateSchema = z.object({
  displayName: z.string().min(2).optional(),
  avatarUrl: z.string().url().optional(),
})

export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>
