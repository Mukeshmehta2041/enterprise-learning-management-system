import { z } from 'zod'

export const GlobalStatsSchema = z.object({
  totalStudents: z.number(),
  totalCourses: z.number(),
  totalEnrollments: z.number(),
  totalRevenue: z.number(),
  activeLearnersLast30Days: z.number(),
})

export type GlobalStats = z.infer<typeof GlobalStatsSchema>

export const CourseAnalyticsSchema = z.object({
  courseId: z.string(),
  courseTitle: z.string(),
  totalEnrollments: z.number(),
  completionRate: z.number(),
  averageRating: z.number(),
  revenue: z.number(),
})

export type CourseAnalytics = z.infer<typeof CourseAnalyticsSchema>

export const EnrollmentTrendSchema = z.object({
  date: z.string(),
  count: z.number(),
})

export type EnrollmentTrend = z.infer<typeof EnrollmentTrendSchema>

export const AnalyticsFilterSchema = z.object({
  courseId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type AnalyticsFilter = z.infer<typeof AnalyticsFilterSchema>
