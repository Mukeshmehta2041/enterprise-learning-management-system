import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export interface ExportJob {
  id: string
  type: 'COURSE_OVERVIEW' | 'LECTURE_ENGAGEMENT'
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  downloadUrl?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export function useExportJobs() {
  return useQuery<ExportJob[]>({
    queryKey: ['export-jobs'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/reports/export')
      return response.data
    },
    refetchInterval: (query) => {
      const hasRunningJobs = query.state.data?.some(
        job => job.status === 'PENDING' || job.status === 'PROCESSING'
      )
      return hasRunningJobs ? 3000 : false
    }
  })
}
