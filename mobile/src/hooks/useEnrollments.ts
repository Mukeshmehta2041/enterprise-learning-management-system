import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Enrollment, PageResponse } from '../types';

export function useEnrollments() {
  return useQuery<Enrollment[]>({
    queryKey: ['enrollments', 'me'],
    queryFn: async () => {
      const response = await apiClient.get<PageResponse<Enrollment>>('/api/v1/enrollments');
      return response.data.items || [];
    },
  });
}

export function useEnrollment(courseId: string) {
  const { data: enrollments } = useEnrollments();
  return enrollments?.find((e) => e.courseId === courseId);
}

export function useEnrollMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiClient.post('/api/v1/enrollments', { courseId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'me'] });
    },
  });
}
