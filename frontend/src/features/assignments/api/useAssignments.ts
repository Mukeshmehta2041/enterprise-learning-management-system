import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { Assignment, Submission, SubmitRequest } from '@/shared/types/assignment'

export function useAssignments() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const { data } = await apiClient.get<Assignment[]>('/assignments')
      return data
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
      return data
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
        return data
      } catch (err: any) {
        if (err.response?.status === 404) return null
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
  return useMutation({
    mutationFn: async (request: SubmitRequest) => {
      const { data } = await apiClient.post<Submission>('/submissions', request)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['submission', data.assignmentId] })
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
    },
  })
}
