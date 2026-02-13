import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export type ContentMetadata = {
  durationSecs?: number
  sizeBytes?: number
  mimeType?: string
}

export type ContentResponse = {
  id: string
  courseId: string
  lessonId: string
  type: 'VIDEO' | 'DOCUMENT' | 'QUIZ'
  title: string
  status: string
  metadata?: ContentMetadata | null
}

export type PlaybackTokenResponse = {
  playbackUrl: string
  token: string
  expiresAt: string
  renditions?: Array<{ quality: string; url: string }>
  captions?: Array<{ language: string; url: string; label: string }>
}

export function useLessonContent(lessonId?: string) {
  return useQuery<ContentResponse[]>({
    queryKey: ['content', 'lesson', lessonId],
    queryFn: async () => {
      if (!lessonId) return []
      const response = await apiClient.get<ContentResponse[]>(`/api/v1/content/lesson/${lessonId}`)
      return response.data || []
    },
    enabled: !!lessonId,
  })
}

export function usePlaybackToken(contentId?: string) {
  return useQuery<PlaybackTokenResponse>({
    queryKey: ['content', 'playback', contentId],
    queryFn: async () => {
      const response = await apiClient.get<PlaybackTokenResponse>(`/api/v1/content/${contentId}/playback-token`)
      return response.data
    },
    enabled: !!contentId,
    staleTime: 1000 * 60 * 45, // 45 minutes
    retry: false,
  })
}
