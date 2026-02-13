import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { Course, PageResponse } from '../types'

const LIST_FIELDS = 'id,title,thumbnailUrl,instructorName,price,isFree,level,averageRating,rating,enrollmentCount,duration';

export function useCourses(params?: { search?: string; status?: string; level?: string }) {
  return useQuery<Course[]>({
    queryKey: ['courses', params],
    queryFn: async () => {
      const response = await apiClient.get<PageResponse<Course>>('/api/v1/courses', {
        params: { ...params, fields: LIST_FIELDS },
      })
      return response.data.items || response.data.content || []
    },
  })
}

export function useInfiniteCourses(
  params: {
    search?: string;
    status?: string;
    level?: string;
    category?: string;
    isFeatured?: boolean;
    isTrending?: boolean;
    tags?: string; // Comma separated
    size?: number;
  } = {},
) {
  return useInfiniteQuery({
    queryKey: ['courses', 'infinite', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<PageResponse<Course>>('/api/v1/courses', {
        params: {
          ...params,
          page: pageParam,
          size: params.size || 10,
          fields: LIST_FIELDS,
        },
      })
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.number
      const totalPages = lastPage.totalPages
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
  })
}

export function useCourse(id: string) {
  return useQuery<Course>({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await apiClient.get<Course>(`/api/v1/courses/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useFeaturedCourses() {
  return useQuery<Course[]>({
    queryKey: ['courses', 'featured'],
    queryFn: async () => {
      const response = await apiClient.get<PageResponse<Course>>('/api/v1/courses', {
        params: { isFeatured: true, size: 5, fields: LIST_FIELDS },
      })
      return response.data.items || response.data.content || []
    },
  })
}

export function useTrendingCourses() {
  return useQuery<Course[]>({
    queryKey: ['courses', 'trending'],
    queryFn: async () => {
      const response = await apiClient.get<PageResponse<Course>>('/api/v1/courses', {
        params: { isTrending: true, size: 5, fields: LIST_FIELDS },
      })
      return response.data.items || response.data.content || []
    },
  })
}
