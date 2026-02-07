import { createContext, useContext, type ReactNode } from 'react';
import { useRealtimeNotifications, useNotifications } from '../api/notificationHooks';
import type { Notification } from '@/shared/types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isRealtimeConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isConnected } = useRealtimeNotifications();
  const { data: notifications = [], isLoading } = useNotifications(isConnected);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isLoading,
      isRealtimeConnected: isConnected
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
