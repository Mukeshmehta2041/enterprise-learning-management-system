import { z } from 'zod'

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  contentUrl: z.string().optional(),
  type: z.enum(['VIDEO', 'DOCUMENT', 'QUIZ']).optional(),
  contentType: z.enum(['VIDEO', 'DOCUMENT', 'QUIZ']).optional(),
  durationMinutes: z.number().nullable().optional(),
  duration: z.string().optional(),
  sortOrder: z.number().optional(),
  order: z.number().optional(),
  isPreview: z.boolean().optional(),
  canWatch: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  availableAt: z.string().optional().nullable(),
}).transform((data) => ({
  ...data,
  contentType: (data.type || data.contentType || 'VIDEO') as 'VIDEO' | 'DOCUMENT' | 'QUIZ',
  order: data.sortOrder ?? data.order ?? 0,
  duration: data.durationMinutes ? `${data.durationMinutes}m` : (data.duration || '0m'),
}))

export type Lesson = z.infer<typeof LessonSchema>

export const ModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  sortOrder: z.number().optional(),
  order: z.number().optional(),
  lessons: z.array(LessonSchema),
}).transform((data) => ({
  ...data,
  order: data.sortOrder ?? data.order ?? 0,
}))

export type Module = z.infer<typeof ModuleSchema>

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string().optional(),
  description: z.string(),
  instructorId: z.string().optional().default(''),
  instructorIds: z.array(z.string()).optional(),
  instructorName: z.string().optional().default('Instructor'),
  thumbnailUrl: z.string().optional().nullable(),
  category: z.string(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).or(z.string()),
  price: z.number().optional().default(0),
  currency: z.string().optional().default('USD'),
  isFree: z.boolean().optional().default(true),
  hasAccess: z.boolean().optional().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).or(z.string()),
  isFeatured: z.boolean().optional().default(false),
  isTrending: z.boolean().optional().default(false),
  completionThreshold: z.number().optional().default(100),
  requireAllAssignments: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  totalEnrollments: z.number().optional().default(0),
  rating: z.number().optional().default(0),
  duration: z.string().optional().default('0h'),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Course = z.infer<typeof CourseSchema>

export const CourseDetailSchema = CourseSchema.extend({
  modules: z.array(ModuleSchema),
})

export type CourseDetail = z.infer<typeof CourseDetailSchema>

export const CourseFiltersSchema = z.object({
  cursor: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  tags: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
})

export type CourseFilters = z.infer<typeof CourseFiltersSchema>

// Form input types (before transformation)
export type LessonInput = {
  id?: string
  title?: string
  description?: string
  contentUrl?: string
  type?: 'VIDEO' | 'DOCUMENT' | 'QUIZ'
  contentType?: 'VIDEO' | 'DOCUMENT' | 'QUIZ'
  durationMinutes?: number | null
  duration?: string
  sortOrder?: number
  order?: number
  isPreview?: boolean
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export type ModuleInput = {
  id?: string
  title?: string
  description?: string
  sortOrder?: number
  order?: number
  lessons?: LessonInput[]
}
