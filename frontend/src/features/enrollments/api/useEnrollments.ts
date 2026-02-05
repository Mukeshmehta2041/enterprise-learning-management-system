import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { Enrollment, EnrollRequest } from '@/shared/types/enrollment'

// Hooks for enrollments
export function useEnrollments() {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const { data } = await apiClient.get<Enrollment[]>('/enrollments')
      return data
    },
  })
}

export function useEnrollment(courseId: string) {
  return useQuery({
    queryKey: ['enrollment', courseId],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Enrollment>(`/enrollments/course/${courseId}`)
        return data
      } catch (err: any) {
        if (err.response?.status === 404) return null
        throw err
      }
    },
    enabled: !!courseId,
  })
}

export function useEnrollSub() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: EnrollRequest) => {
      const { data } = await apiClient.post<Enrollment>('/enrollments', request)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['enrollment', data.courseId] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}
