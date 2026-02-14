import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { ContentResponseSchema, PlaybackTokenResponseSchema, type ContentResponse, type PlaybackTokenResponse } from '@/shared/types/content'
import { z } from 'zod'
import axios from 'axios'

export function useLessonContent(lessonId: string | undefined) {
  return useQuery({
    queryKey: ['lesson-content', lessonId],
    queryFn: async (): Promise<ContentResponse[]> => {
      if (!lessonId) return []
      const response = await apiClient.get(`/content/lesson/${lessonId}`)
      return z.array(ContentResponseSchema).parse(response.data)
    },
    enabled: !!lessonId,
  })
}

export function usePlaybackToken(contentId: string | undefined) {
  return useQuery({
    queryKey: ['playback-token', contentId],
    queryFn: async (): Promise<PlaybackTokenResponse> => {
      const response = await apiClient.get(`/content/${contentId}/playback-token`)
      return PlaybackTokenResponseSchema.parse(response.data)
    },
    enabled: !!contentId,
    retry: false, // Don't retry auth errors
    staleTime: 1000 * 60 * 45, // 45 mins (tokens usually last 1h)
  })
}

export function useContent(id: string | undefined) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: async (): Promise<ContentResponse> => {
      const response = await apiClient.get(`/content/${id}`)
      return ContentResponseSchema.parse(response.data)
    },
    enabled: !!id,
  })
}

export function useUploadContent() {
  return useMutation({
    mutationFn: async ({
      contentId,
      file,
      onProgress,
    }: {
      contentId: string
      file: File
      onProgress?: (percent: number) => void
    }) => {
      // 1. Get presigned URL
      const { data: { uploadUrl } } = await apiClient.post(`/content/${contentId}/upload-url`, {
        fileName: file.name,
        contentType: file.type,
      })

      // 2. Upload to S3/Storage via presigned URL
      // We use a clean axios instance to avoid sending our app's auth headers to S3
      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(percent)
          }
        },
      })

      // 3. Complete upload
      await apiClient.post(`/content/${contentId}/complete-upload`, {
        storagePath: new URL(uploadUrl).pathname.substring(1), // relative path
      })

      return { contentId }
    },
  })
}

export function useCreateAndUploadContent() {
  const upload = useUploadContent()

  return useMutation({
    mutationFn: async ({
      courseId,
      lessonId,
      title,
      type,
      file,
      onProgress,
    }: {
      courseId: string
      lessonId?: string
      title: string
      type: 'VIDEO' | 'PDF' | 'QUIZ' | 'IMAGE'
      file: File
      onProgress?: (percent: number) => void
    }) => {
      // 1. Create content record
      const { data: content } = await apiClient.post('/content', {
        courseId,
        lessonId,
        type,
        title,
      })

      // 2. Upload if file provided
      if (file) {
        await upload.mutateAsync({ contentId: content.id, file, onProgress })
      }

      return content
    },
  })
}
