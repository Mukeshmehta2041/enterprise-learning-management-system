import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { AssignmentSchema, SubmissionSchema, type Assignment, type Submission, type SubmitRequest } from '@/shared/types/assignment'
import { z } from 'zod'
import { type AppError } from '@/shared/types/error'
import { useToast } from '@/shared/context/ToastContext'

export function useAssignments() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const { data } = await apiClient.get<Assignment[]>('/assignments')
      return z.array(AssignmentSchema).parse(data)
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Assignment>(`/assignments/${id}`)
      return AssignmentSchema.parse(data)
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useSubmission(assignmentId: string) {
  return useQuery({
    queryKey: ['submission', assignmentId],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Submission>(`/submissions/assignment/${assignmentId}`)
        return SubmissionSchema.parse(data)
      } catch (err: any) {
        if (err.status === 404) return null
        throw err
      }
    },
    enabled: !!assignmentId,
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation<Submission, AppError, SubmitRequest>({
    mutationFn: async (request: SubmitRequest) => {
      const { data } = await apiClient.post<Submission>('/submissions', request)
      return SubmissionSchema.parse(data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['submission', data.assignmentId] })
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      success('Assignment submitted successfully!')
    },
    onError: (err) => {
      error(err.message || 'Failed to submit assignment')
    }
  })
}
