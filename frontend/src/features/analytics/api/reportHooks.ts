import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';

export interface ExportJob {
  id: string;
  userId: string;
  reportType: 'COURSE_OVERVIEW' | 'LECTURE_ENGAGEMENT';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  downloadUrl?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export function useExportJobs() {
  return useQuery<ExportJob[]>({
    queryKey: ['export-jobs'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/v1/reports/jobs');
      return data;
    },
    refetchInterval: (query) => {
      const jobs = query.state.data;
      if (jobs?.some(job => job.status === 'PENDING' || job.status === 'PROCESSING')) {
        return 3000;
      }
      return false;
    }
  });
}

export function useTriggerExport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (type: string) => {
      const { data } = await apiClient.post(`/api/v1/reports/export?type=${type}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['export-jobs'] });
    },
  });
}
