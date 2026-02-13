import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { GlobalStatsSchema, CourseAnalyticsSchema, EnrollmentTrendSchema, InstructorCourseAnalyticsSchema, type GlobalStats, type CourseAnalytics, type EnrollmentTrend, type InstructorCourseAnalytics, type AnalyticsFilter } from '@/shared/types/analytics';
import { z } from 'zod';

export const useGlobalStats = () => {
  return useQuery<GlobalStats>({
    queryKey: ['analytics', 'global'],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/global');
      return GlobalStatsSchema.parse(response.data);
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
      return z.array(CourseAnalyticsSchema).parse(response.data);
    },
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useInstructorCourseAnalytics = (courseId: string, filters?: AnalyticsFilter) => {
  return useQuery<InstructorCourseAnalytics>({
    queryKey: ['analytics', 'instructor-course', courseId, filters],
    queryFn: async () => {
      const response = await apiClient.get(`/analytics/course/${courseId}`, { params: filters });
      return InstructorCourseAnalyticsSchema.parse(response.data);
    },
    enabled: !!courseId,
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
      return z.array(EnrollmentTrendSchema).parse(response.data);
    },
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
