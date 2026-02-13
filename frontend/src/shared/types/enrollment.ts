import { z } from 'zod'

export const EnrollmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  courseId: z.string(),
  courseTitle: z.string().optional().default('Untitled Course'),
  courseThumbnailUrl: z.string().optional().nullable(),
  status: z.enum(['ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED', 'PENDING_PAYMENT', 'CANCELLED', 'ACTIVE']).or(z.string()),
  progress: z.number().optional().default(0),
  progressPct: z.number().optional(), // Match backend if present
  completedLessonIds: z.array(z.string()).optional().default([]),
  lessonPositions: z.record(z.string(), z.number()).optional().default({}),
  lastLessonId: z.string().optional().nullable(),
  lastAccessedAt: z.string().optional().nullable(),
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
  positionSecs: z.number().optional(),
  status: z.enum(['STARTED', 'COMPLETED']).optional(),
})

export type ProgressUpdate = z.infer<typeof ProgressUpdateSchema>
