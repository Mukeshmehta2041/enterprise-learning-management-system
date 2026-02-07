import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { EnrollmentSchema, type Enrollment, type EnrollRequest, type ProgressUpdate } from '@/shared/types/enrollment'
import { z } from 'zod'
import { type AppError } from '@/shared/types/error'
import { useToast } from '@/shared/context/ToastContext'

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
  const { success, error } = useToast()

  return useMutation<Enrollment, AppError, EnrollRequest>({
    mutationFn: async (request: EnrollRequest) => {
      const { data } = await apiClient.post<Enrollment>('/enrollments', request)
      return EnrollmentSchema.parse(data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['enrollment', data.courseId] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      success('Successfully enrolled in the course!')
    },
    onError: (err) => {
      error(err.message || 'Failed to enroll in the course')
    }
  })
}

export function useUpdateProgress(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation<
    Enrollment,
    AppError,
    ProgressUpdate,
    { previousEnrollment?: Enrollment; previousEnrollments?: Enrollment[] }
  >({
    mutationFn: async (update: ProgressUpdate) => {
      const { data } = await apiClient.post<Enrollment>(`/enrollments/${courseId}/progress`, update)
      return EnrollmentSchema.parse(data)
    },
    onMutate: async (update) => {
      await queryClient.cancelQueries({ queryKey: ['enrollment', courseId] })
      await queryClient.cancelQueries({ queryKey: ['enrollments'] })

      const previousEnrollment = queryClient.getQueryData<Enrollment>(['enrollment', courseId])
      const previousEnrollments = queryClient.getQueryData<Enrollment[]>(['enrollments'])

      if (previousEnrollment) {
        queryClient.setQueryData(['enrollment', courseId], {
          ...previousEnrollment,
          completedLessonIds: update.completed ? [...new Set([...previousEnrollment.completedLessonIds, update.lessonId])] : previousEnrollment.completedLessonIds
        })
      }

      return { previousEnrollment, previousEnrollments }
    },
    onError: (_err, _update, context) => {
      if (context?.previousEnrollment) {
        queryClient.setQueryData(['enrollment', courseId], context.previousEnrollment)
      }
      if (context?.previousEnrollments) {
        queryClient.setQueryData(['enrollments'], context.previousEnrollments)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollment', courseId] })
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    }
  })
}
