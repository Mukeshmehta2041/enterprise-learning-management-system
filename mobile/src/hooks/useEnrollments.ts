import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { Enrollment, PageResponse } from '../types'

export function useEnrollments() {
  return useQuery<Enrollment[]>({
    queryKey: ['enrollments', 'me'],
    queryFn: async () => {
      const response = await apiClient.get<PageResponse<Enrollment>>('/api/v1/enrollments')
      return response.data.items || response.data.content || []
    },
  })
}

export function useEnrollment(courseId: string) {
  const { data: enrollments } = useEnrollments()
  return enrollments?.find((e) => e.courseId === courseId)
}

export function useEnrollMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiClient.post('/api/v1/enrollments', { courseId })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'me'] })
    },
  })
}

export function useUpdateProgressMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      enrollmentId,
      lessonId,
      completed,
    }: {
      enrollmentId: string
      lessonId: string
      completed: boolean
    }) => {
      const response = await apiClient.patch(`/api/v1/enrollments/${enrollmentId}/progress`, {
        lessonId,
        completed,
      })
      return response.data
    },
    // Optimistic Update
    onMutate: async (newProgress) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['enrollments', 'me'] })

      // Snapshot the previous value
      const previousEnrollments = queryClient.getQueryData<Enrollment[]>(['enrollments', 'me'])

      // Optimistically update to the new value
      if (previousEnrollments) {
        queryClient.setQueryData<Enrollment[]>(['enrollments', 'me'], (old) => {
          return old?.map((enrollment) => {
            if (enrollment.id === newProgress.enrollmentId) {
              // Note: This is an oversimplification. In a real app,
              // you'd update the specific lesson and progress percentage.
              return { ...enrollment, progress: Math.min(100, (enrollment.progress || 0) + 5) }
            }
            return enrollment
          })
        })
      }

      return { previousEnrollments }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newProgress, context) => {
      if (context?.previousEnrollments) {
        queryClient.setQueryData(['enrollments', 'me'], context.previousEnrollments)
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'me'] })
    },
  })
}
