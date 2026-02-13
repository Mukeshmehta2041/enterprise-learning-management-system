import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'

export type PlaybackEventType =
  | 'PLAY'
  | 'PAUSE'
  | 'SEEK'
  | 'COMPLETE'
  | 'ERROR'
  | 'HEARTBEAT'

export interface PlaybackTelemetryRequest {
  contentId: string
  lessonId: string
  courseId: string
  eventType: PlaybackEventType
  positionSecs: number
  totalDurationSecs: number
  metadata?: Record<string, unknown>
}

export function useRecordPlaybackEvent() {
  return useMutation({
    mutationFn: async (request: PlaybackTelemetryRequest) => {
      // We use analytics service (different port/base in some setups, but here we assume gateway routes /analytics)
      await apiClient.post('/analytics/playback/events', request)
    }
  })
}
