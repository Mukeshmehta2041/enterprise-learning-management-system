import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { GlobalStats, CourseAnalytics, EnrollmentTrend, AnalyticsFilter } from '@/shared/types/analytics';

export const useGlobalStats = () => {
  return useQuery<GlobalStats>({
    queryKey: ['analytics', 'global'],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/global');
      return response.data;
    },
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useCourseAnalytics = (filters?: AnalyticsFilter) => {
  return useQuery<CourseAnalytics[]>({
    queryKey: ['analytics', 'courses', filters],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/courses', { params: filters });
      return response.data;
    },
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useEnrollmentTrends = (filters?: AnalyticsFilter) => {
  return useQuery<EnrollmentTrend[]>({
    queryKey: ['analytics', 'trends', filters],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/trends', { params: filters });
      return response.data;
    },
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
