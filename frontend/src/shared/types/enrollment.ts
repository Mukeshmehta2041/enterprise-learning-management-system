import { z } from 'zod'

export const EnrollmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  courseId: z.string(),
  courseTitle: z.string(),
  courseThumbnailUrl: z.string().optional(),
  status: z.enum(['ENROLLED', 'COMPLETED', 'CANCELLED']),
  progress: z.number().min(0).max(100),
  completedLessonIds: z.array(z.string()).default([]),
  lastAccessedAt: z.string(),
  enrolledAt: z.string(),
})

export type Enrollment = z.infer<typeof EnrollmentSchema>

export const EnrollRequestSchema = z.object({
  courseId: z.string(),
})

export type EnrollRequest = z.infer<typeof EnrollRequestSchema>

export const ProgressUpdateSchema = z.object({
  lessonId: z.string(),
  completed: z.boolean().optional(),
  status: z.enum(['STARTED', 'COMPLETED']).optional(),
})

export type ProgressUpdate = z.infer<typeof ProgressUpdateSchema>
