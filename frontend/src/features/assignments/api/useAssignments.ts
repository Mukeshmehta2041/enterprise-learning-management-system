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

export function useCourseAssignments(courseId: string) {
  return useQuery({
    queryKey: ['assignments', 'course', courseId],
    queryFn: async () => {
      const { data } = await apiClient.get<Assignment[]>(`/assignments/course/${courseId}`)
      return z.array(AssignmentSchema).parse(data)
    },
    enabled: !!courseId,
  })
}

export function useModuleAssignments(moduleId: string) {
  return useQuery({
    queryKey: ['assignments', 'module', moduleId],
    queryFn: async () => {
      const { data } = await apiClient.get<Assignment[]>(`/assignments/module/${moduleId}`)
      return z.array(AssignmentSchema).parse(data)
    },
    enabled: !!moduleId,
  })
}

export function useLessonAssignments(lessonId: string) {
  return useQuery({
    queryKey: ['assignments', 'lesson', lessonId],
    queryFn: async () => {
      const { data } = await apiClient.get<Assignment[]>(`/assignments/lesson/${lessonId}`)
      return z.array(AssignmentSchema).parse(data)
    },
    enabled: !!lessonId,
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
        const { data } = await apiClient.get<Submission[]>(`/assignments/${assignmentId}/submissions`)
        if (data && data.length > 0) {
          return SubmissionSchema.parse(data[0])
        }
        return null
      } catch (err) {
        if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 404) return null
        throw err
      }
    },
    enabled: !!assignmentId,
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: ['submissions', assignmentId],
    queryFn: async () => {
      const { data } = await apiClient.get<Submission[]>(`/assignments/${assignmentId}/submissions`)
      return z.array(SubmissionSchema).parse(data)
    },
    enabled: !!assignmentId,
  })
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation<Submission, AppError, SubmitRequest>({
    mutationFn: async (request: SubmitRequest) => {
      const { data } = await apiClient.post<Submission>(`/assignments/${request.assignmentId}/submit`, request)
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

export function useCreateAssignment() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation<Assignment, AppError, Partial<Assignment>>({
    mutationFn: async (assignmentData) => {
      const { data } = await apiClient.post<Assignment>(`/assignments`, assignmentData)
      return AssignmentSchema.parse(data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      queryClient.invalidateQueries({ queryKey: ['assignments', 'course', data.courseId] })
      success('Assignment created successfully!')
    },
    onError: (err) => {
      error(err.message || 'Failed to create assignment')
    }
  })
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation<Assignment, AppError, { id: string, data: Partial<Assignment> }>({
    mutationFn: async ({ id, data: assignmentData }) => {
      const { data } = await apiClient.put<Assignment>(`/assignments/${id}`, assignmentData)
      return AssignmentSchema.parse(data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assignment', data.id] })
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      queryClient.invalidateQueries({ queryKey: ['assignments', 'course', data.courseId] })
      success('Assignment updated successfully!')
    },
    onError: (err) => {
      error(err.message || 'Failed to update assignment')
    }
  })
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation<void, AppError, { id: string, courseId: string }>({
    mutationFn: async ({ id }) => {
      await apiClient.delete(`/assignments/${id}`)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      queryClient.invalidateQueries({ queryKey: ['assignments', 'course', variables.courseId] })
      success('Assignment deleted successfully!')
    },
    onError: (err) => {
      error(err.message || 'Failed to delete assignment')
    }
  })
}

export function useGradeSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ submissionId, score, feedback }: { submissionId: string, score: number, feedback: string }) => {
      const { data } = await apiClient.post(`/assignments/submissions/${submissionId}/grade`, { score, feedback })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      // We don't have the assignmentId here easily without extra lookup or passing it in
    }
  })
}
