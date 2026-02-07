import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { NotificationSchema, type Notification, type MarkAsReadRequest } from '@/shared/types/notification';
import { z } from 'zod';
import { useToast } from '@/shared/context/ToastContext';
import { useRealtimeChannel } from '@/shared/hooks/useRealtimeChannel';
import { useEffect } from 'react';

export const useNotifications = (isRealtimeConnected?: boolean) => {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await apiClient.get('/notifications');
      return z.array(NotificationSchema).parse(response.data);
    },
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    // If not connected to real-time, poll every 60 seconds as fallback
    refetchInterval: isRealtimeConnected ? false : 60 * 1000,
  });
};

export const useRealtimeNotifications = () => {
  const queryClient = useQueryClient();
  const { success } = useToast();

  const { subscribe, isConnected } = useRealtimeChannel({
    url: '/api/v1/notifications/stream'
  });

  useEffect(() => {
    const unsubscribe = subscribe('notification', (newNotification: Notification) => {
      console.log('Real-time notification received:', newNotification);

      // Update the cache
      queryClient.setQueryData<Notification[]>(['notifications'], (old) => {
        const notifications = old || [];
        // Check if already exists to avoid duplicates
        if (notifications.some(n => n.id === newNotification.id)) return notifications;

        // Add to start of list
        return [newNotification, ...notifications];
      });

      // Show a toast with a small delay or if it's high priority
      success(`New: ${newNotification.title}`);
    });

    return () => {
      unsubscribe?.();
    };
  }, [subscribe, queryClient, success]);

  return { isConnected };
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: async (request: MarkAsReadRequest) => {
      const response = await apiClient.post('/notifications/mark-as-read', request);
      return response.data;
    },
    onMutate: async (request) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData<Notification[]>(['notifications']);

      // Optimistically update to the new value
      if (previousNotifications) {
        queryClient.setQueryData<Notification[]>(['notifications'], (old) => {
          if (!old) return [];
          return old.map(n =>
            request.notificationIds.includes(n.id) ? { ...n, read: true } : n
          );
        });
      }

      // Return a context object with the snapshotted value
      return { previousNotifications };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
      showError('Failed to mark notifications as read');
    },
    onSuccess: (_, variables) => {
      if (variables.notificationIds.length > 1) {
        success('All notifications marked as read');
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we're in sync with the server
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
