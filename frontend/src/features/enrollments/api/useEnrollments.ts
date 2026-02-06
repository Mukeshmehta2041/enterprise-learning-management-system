import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { EnrollmentSchema, type Enrollment, type EnrollRequest } from '@/shared/types/enrollment'
import { z } from 'zod'
import { type AppError } from '@/shared/types/error'

// Hooks for enrollments
export function useEnrollments() {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ items: Enrollment[], nextCursor: string | null }>('/enrollments')
      return z.array(EnrollmentSchema).parse(data.items)
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

export function useEnrollment(courseId: string) {
  return useQuery({
    queryKey: ['enrollment', courseId],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Enrollment>(`/enrollments/course/${courseId}`)
        return EnrollmentSchema.parse(data)
      } catch (err: any) {
        if (err.status === 404) return null
        throw err
      }
    },
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

export function useEnrollSub() {
  const queryClient = useQueryClient()
  return useMutation<Enrollment, AppError, EnrollRequest>({
    mutationFn: async (request: EnrollRequest) => {
      const { data } = await apiClient.post<Enrollment>('/enrollments', request)
      return EnrollmentSchema.parse(data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['enrollment', data.courseId] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}
