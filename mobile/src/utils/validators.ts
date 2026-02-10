import { z } from 'zod'

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  instructorName: z.string(),
  price: z.number(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
})

export const EnrollmentSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  progress: z.number(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'DROPPED']),
})

export function validateResponse<T>(schema: z.Schema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    console.error('Contract mismatch detected:', result.error.format())
    // In production, you might want to log this to an external service like Sentry
    throw new Error('API Contract mismatch')
  }
  return result.data
}
