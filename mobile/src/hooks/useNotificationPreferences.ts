import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'PUSH' | 'SMS' | 'WEBHOOK';
export type NotificationEventType = 'LessonPublished' | 'AssignmentCreated' | 'AssignmentUpdated' | 'AssignmentDueSoon' | 'AssignmentGraded' | 'UserCreated' | 'PaymentCompleted' | 'General';

export interface NotificationPreference {
  id: string;
  userId: string;
  courseId: string | null;
  eventType: NotificationEventType;
  channel: NotificationChannel;
  enabled: boolean;
}

export const useNotificationPreferences = () => {
  return useQuery<NotificationPreference[]>({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/notifications/preferences')
      return response.data
    },
  })
}

export const useUpsertNotificationPreference = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (preference: Partial<NotificationPreference>) => {
      const response = await apiClient.post('/api/v1/notifications/preferences', preference)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] })
    },
  })
}
