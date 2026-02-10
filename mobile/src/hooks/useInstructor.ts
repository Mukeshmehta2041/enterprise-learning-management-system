import { useQuery } from '@tanstack/react-query'
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
      // Mocked endpoint - in real app would be /api/v1/instructor/courses
      const response = await apiClient.get<Course[]>('/api/v1/courses/my-teaching')
      return response.data
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
