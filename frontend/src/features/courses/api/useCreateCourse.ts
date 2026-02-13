import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { type CourseDetail } from '@/shared/types/course'
import { useNavigate } from 'react-router-dom'

interface CreateCourseData {
  title: string
  description: string
  category: string
  level: string
  price: number
  completionThreshold?: number
  requireAllAssignments?: boolean
  modules: Array<{
    title: string
    lessons: Array<{
      title: string
      type: string
    }>
  }>
}

async function createCourse(data: CreateCourseData): Promise<CourseDetail> {
  const { data: response } = await apiClient.post<CourseDetail>('/courses', data)
  return response
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      navigate('/instructor/courses')
    },
  })
}
