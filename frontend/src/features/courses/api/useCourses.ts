import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { CourseSchema, CourseDetailSchema, type Course, type CourseFilters, type CourseDetail, type Module } from '@/shared/types/course'
import { type PaginatedResponse } from '@/shared/types/error'

async function fetchCourses(filters: CourseFilters): Promise<PaginatedResponse<Course>> {
  const { data } = await apiClient.get<PaginatedResponse<Course>>('/courses', {
    params: {
      ...filters,
      limit: filters.limit || 9,
    },
  })

  // Parse with schema to apply defaults and transform data
  const validatedContent = (data.content || []).map(item => CourseSchema.parse(item))

  return {
    ...data,
    content: validatedContent,
  }
}

export function useCourses(filters: CourseFilters) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => fetchCourses(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: ['courses', 'featured'],
    queryFn: () => fetchCourses({ isFeatured: true, limit: 10 }),
    staleTime: 5 * 60 * 1000,
  })
}

export function useTrendingCourses() {
  return useQuery({
    queryKey: ['courses', 'trending'],
    queryFn: () => fetchCourses({ isTrending: true, limit: 10 }),
    staleTime: 5 * 60 * 1000,
  })
}

async function fetchCourseById(id: string): Promise<CourseDetail> {
  const { data } = await apiClient.get<CourseDetail>(`/courses/${id}`)
  return CourseDetailSchema.parse(data)
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => fetchCourseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CourseDetail> }) => {
      const response = await apiClient.patch<CourseDetail>(`/courses/${id}`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.setQueryData(['courses', data.id], data)
    },
  })
}

export function usePublishCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post<CourseDetail>(`/courses/${id}/publish`)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.setQueryData(['courses', data.id], data)
    },
  })
}

export function useSaveAsDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post<CourseDetail>(`/courses/${id}/draft`)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.setQueryData(['courses', data.id], data)
    },
  })
}

export function useDuplicateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post<CourseDetail>(`/courses/${id}/duplicate`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useSyncCurriculum() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, modules }: { id: string; modules: Module[] }) => {
      const { data } = await apiClient.post(`/courses/${id}/curriculum/sync`, { modules })
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.id] })
    },
  })
}
