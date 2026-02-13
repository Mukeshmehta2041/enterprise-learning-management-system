import { z } from 'zod'

export const AssignmentSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  moduleId: z.string().optional().nullable(),
  lessonId: z.string().optional().nullable(),
  courseTitle: z.string().optional().default('Untitled Course'),
  title: z.string(),
  description: z.string(),
  dueDate: z.string().optional().nullable(),
  maxScore: z.number().optional().default(100),
  isMandatory: z.boolean().optional().default(true),
  status: z.enum(['PUBLISHED', 'DRAFT', 'ARCHIVED']).or(z.string()).optional().default('PUBLISHED'),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Assignment = z.infer<typeof AssignmentSchema>;

export const SubmissionSchema = z.object({
  id: z.string(),
  assignmentId: z.string(),
  studentId: z.string(),
  content: z.string(),
  submittedAt: z.string(),
  grade: z.number().optional().nullable(),
  feedback: z.string().optional().nullable(),
  status: z.enum(['SUBMITTED', 'GRADED']).or(z.string()),
})

export type Submission = z.infer<typeof SubmissionSchema>;

export const SubmitRequestSchema = z.object({
  assignmentId: z.string(),
  content: z.string(),
})

export type SubmitRequest = z.infer<typeof SubmitRequestSchema>;
