import { create } from 'zustand'
import { BannerType } from '../components/Banner'

interface NotificationState {
  message: string
  type: BannerType
  isVisible: boolean
  showNotification: (message: string, type?: BannerType) => void
  hideNotification: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: '',
  type: 'info',
  isVisible: false,
  showNotification: (message, type = 'info') => set({ message, type, isVisible: true }),
  hideNotification: () => set({ isVisible: false }),
}))
