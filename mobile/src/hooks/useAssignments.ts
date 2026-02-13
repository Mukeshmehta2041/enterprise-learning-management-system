import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { Assignment } from '../types'

export function useCourseAssignments(courseId: string) {
  return useQuery<Assignment[]>({
    queryKey: ['assignments', 'course', courseId],
    queryFn: async () => {
      const response = await apiClient.get<Assignment[]>(`/api/v1/assignments/course/${courseId}`)
      return response.data || []
    },
    enabled: !!courseId,
  })
}

export function useLessonAssignments(lessonId: string) {
  return useQuery<Assignment[]>({
    queryKey: ['assignments', 'lesson', lessonId],
    queryFn: async () => {
      const response = await apiClient.get<Assignment[]>(`/api/v1/assignments/lesson/${lessonId}`)
      return response.data || []
    },
    enabled: !!lessonId,
  })
}

export function useAssignment(id: string) {
  return useQuery<Assignment>({
    queryKey: ['assignment', id],
    queryFn: async () => {
      const response = await apiClient.get<Assignment>(`/api/v1/assignments/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}
