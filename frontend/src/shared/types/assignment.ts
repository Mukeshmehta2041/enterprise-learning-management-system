import { z } from 'zod'

export const AssignmentSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  courseTitle: z.string().optional().default('Untitled Course'),
  title: z.string(),
  description: z.string(),
  dueDate: z.string().optional().nullable(),
  maxPoints: z.number().optional().default(100),
  maxScore: z.number().optional(), // Match backend if present
  status: z.enum(['PUBLISHED', 'DRAFT', 'ARCHIVED']).or(z.string()).optional().default('PUBLISHED'),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Assignment = z.infer<typeof AssignmentSchema>;

export const SubmissionSchema = z.object({
  id: z.string(),
  assignmentId: z.string(),
  userId: z.string(),
  content: z.string(),
  submissionDate: z.string(),
  grade: z.number().optional(),
  feedback: z.string().optional(),
  status: z.enum(['SUBMITTED', 'GRADED', 'LATE']),
})

export type Submission = z.infer<typeof SubmissionSchema>;

export const SubmitRequestSchema = z.object({
  assignmentId: z.string(),
  content: z.string(),
})

export type SubmitRequest = z.infer<typeof SubmitRequestSchema>;
