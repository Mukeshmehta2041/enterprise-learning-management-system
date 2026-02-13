import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { Course } from '../types'

export interface InstructorStats {
  totalStudents: number
  activeCourses: number
  totalEarnings: number
  averageRating: number
  monthlyRevenue: { month: string; amount: number }[]
}

export function useInstructorCourses() {
  return useQuery<Course[]>({
    queryKey: ['instructor', 'courses'],
    queryFn: async () => {
      const response = await apiClient.get<any>('/api/v1/courses/me')
      return response.data.items || response.data.content || response.data || []
    },
  })
}

export function useInstructorStats() {
  return useQuery<InstructorStats>({
    queryKey: ['instructor', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get<InstructorStats>('/api/v1/instructor/stats')
      return response.data
    },
  })
}

export function useInstructorCourse(id: string) {
  return useQuery<Course>({
    queryKey: ['instructor', 'course', id],
    queryFn: async () => {
      const response = await apiClient.get<Course>(`/api/v1/courses/${id}`)
      return response.data
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Course> }) => {
      const response = await apiClient.patch<Course>(`/api/v1/courses/${id}`, data)
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] })
      queryClient.invalidateQueries({ queryKey: ['instructor', 'course', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['courses', variables.id] })
    },
  })
}

export interface AssignmentStats {
  id: string
  title: string
  dueDate: string
  totalEnrollments: number
  submittedCount: number
  gradedCount: number
}

export function useInstructorAssignments(courseId: string) {
  return useQuery<AssignmentStats[]>({
    queryKey: ['instructor', 'assignments', courseId],
    queryFn: async () => {
      const response = await apiClient.get<AssignmentStats[]>(
        `/api/v1/instructor/courses/${courseId}/assignments`,
      )
      return response.data
    },
  })
}

export interface LectureEngagement {
  lessonId: string
  lessonTitle: string
  totalWatches: number
  totalCompletes: number
  totalWatchTimeSecs: number
  completionRate: number
}

export interface InstructorCourseAnalytics {
  courseId: string
  totalEnrollments: number
  activeLearners: number
  completionRate: number
  lectureEngagement: LectureEngagement[]
}

export function useInstructorCourseAnalytics(courseId: string) {
  return useQuery<InstructorCourseAnalytics>({
    queryKey: ['instructor', 'analytics', courseId],
    queryFn: async () => {
      const response = await apiClient.get<InstructorCourseAnalytics>(
        `/api/v1/analytics/course/${courseId}`,
      )
      return response.data
    },
    enabled: !!courseId,
  })
}
