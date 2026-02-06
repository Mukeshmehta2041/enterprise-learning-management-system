import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { CourseSchema, CourseDetailSchema, type Course, type CourseFilters, type CourseDetail } from '@/shared/types/course'
import { type PaginatedResponse } from '@/shared/types/error'

async function fetchCourses(filters: CourseFilters): Promise<PaginatedResponse<Course>> {
  const { data } = await apiClient.get<PaginatedResponse<Course>>('/courses', {
    params: {
      ...filters,
      limit: filters.limit || 9,
    },
  })

  // Runtime validation for critical items in list
  if (data.content && data.content.length > 0) {
    CourseSchema.parse(data.content[0])
  }

  return data
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
