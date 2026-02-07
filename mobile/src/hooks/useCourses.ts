import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Course, PageResponse } from '../types';

export function useCourses(params?: { search?: string; status?: string; level?: string }) {
  return useQuery<Course[]>({
    queryKey: ['courses', params],
    queryFn: async () => {
      const response = await apiClient.get<PageResponse<Course>>('/api/v1/courses', {
        params: { ...params }
      });
      return response.data.items || [];
    },
  });
}

export function useInfiniteCourses(params: { search?: string; status?: string; level?: string; size?: number } = {}) {
  return useInfiniteQuery({
    queryKey: ['courses', 'infinite', params],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.get<PageResponse<Course>>('/api/v1/courses', {
        params: {
          ...params,
          page: pageParam,
          size: params.size || 10
        }
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.number < lastPage.totalPages - 1 ? lastPage.number + 1 : undefined;
    },
  });
}

export function useCourse(id: string) {
  return useQuery<Course>({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await apiClient.get<Course>(`/api/v1/courses/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
