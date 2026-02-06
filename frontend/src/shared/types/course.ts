import { z } from 'zod'

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  contentUrl: z.string().optional(),
  contentType: z.enum(['VIDEO', 'DOCUMENT', 'QUIZ']),
  duration: z.string().optional(),
  order: z.number(),
})

export type Lesson = z.infer<typeof LessonSchema>

export const ModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  order: z.number(),
  lessons: z.array(LessonSchema),
})

export type Module = z.infer<typeof ModuleSchema>

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  instructorId: z.string(),
  instructorName: z.string(),
  thumbnailUrl: z.string().optional(),
  category: z.string(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  price: z.number(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  totalEnrollments: z.number(),
  rating: z.number(),
  duration: z.string(),
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
  limit: z.number().optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
})

export type CourseFilters = z.infer<typeof CourseFiltersSchema>
