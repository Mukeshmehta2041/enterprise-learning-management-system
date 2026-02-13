import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import {
  NotificationPreferenceSchema,
  NotificationPreferenceUpsertSchema,
  type NotificationPreference,
  type NotificationPreferenceUpsert,
} from '@/shared/types/notification'
import { z } from 'zod'
import { useToast } from '@/shared/context/ToastContext'

export const useNotificationPreferences = () => {
  return useQuery<NotificationPreference[]>({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      const response = await apiClient.get('/notification-preferences')
      return z.array(NotificationPreferenceSchema).parse(response.data)
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useUpsertNotificationPreference = () => {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()

  return useMutation<NotificationPreference, Error, NotificationPreferenceUpsert, { previous?: NotificationPreference[] }>({
    mutationFn: async (request) => {
      const payload = NotificationPreferenceUpsertSchema.parse(request)
      const response = await apiClient.post('/notification-preferences', payload)
      return NotificationPreferenceSchema.parse(response.data)
    },
    onMutate: async (request) => {
      await queryClient.cancelQueries({ queryKey: ['notification-preferences'] })
      const previous = queryClient.getQueryData<NotificationPreference[]>(['notification-preferences'])

      if (previous) {
        const updated = [...previous]
        const index = updated.findIndex(
          (pref) => pref.eventType === request.eventType &&
            pref.channel === request.channel &&
            (pref.courseId || null) === (request.courseId || null)
        )

        if (index >= 0) {
          updated[index] = {
            ...updated[index],
            enabled: request.enabled,
            updatedAt: new Date().toISOString(),
          }
        }

        queryClient.setQueryData(['notification-preferences'], updated)
      }

      return { previous }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notification-preferences'], context.previous)
      }
      showError('Failed to update notification preferences')
    },
    onSuccess: () => {
      success('Notification preferences updated')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] })
    },
  })
}
