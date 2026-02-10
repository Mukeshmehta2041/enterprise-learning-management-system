import { Stack, useRouter, useSegments, usePathname } from 'expo-router'
import { useEffect, useRef } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'
import { enableScreens } from 'react-native-screens'
import { QueryClient, focusManager } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import { useAuthStore } from '../src/state/useAuthStore'
import { useNotificationStore } from '../src/state/useNotificationStore'
import { Banner } from '../src/components/Banner'
import { ErrorBoundary } from '../src/components/ErrorBoundary'
import { Monitoring } from '../src/utils/monitoring'
import { analytics } from '../src/utils/analytics'
import {
  registerForPushNotificationsAsync,
  handleNotificationResponse,
} from '../src/utils/notifications'
import { registerBackgroundSync } from '../src/utils/backgroundSync'
import '../src/i18n'
import '../global.css'

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

// Initialize monitoring & analytics
Monitoring.init()
analytics.init()

// Disable screens to resolve type mismatch errors in RN 0.81 + New Architecture on iOS
enableScreens(false)

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true, // This will use the focusManager we wire up
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
})

export default function RootLayout() {
  const { user, token, isLoading, initialize, setRedirectPath } = useAuthStore()
  const { message, type, isVisible, hideNotification } = useNotificationStore()
  const segments = useSegments()
  const pathname = usePathname()
  const router = useRouter()

  const notificationListener = useRef<Notifications.EventSubscription | null>(null)
  const responseListener = useRef<Notifications.EventSubscription | null>(null)

  useEffect(() => {
    initialize()

    // Set up app state listener for React Query
    const appStateSubscription = AppState.addEventListener('change', onAppStateChange)

    // Track app opened
    analytics.track('app_opened')

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received in foreground:', notification)
      analytics.track('notification_received', {
        id: notification.request.identifier,
        title: notification.request.content.title,
      })
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = handleNotificationResponse(response)
      if (url) {
        // Use router to navigate to the deep linked path
        router.push(url as any)
      }
    })

    return () => {
      appStateSubscription.remove()
      if (notificationListener.current) {
        notificationListener.current.remove()
      }
      if (responseListener.current) {
        responseListener.current.remove()
      }
    }
  }, [])

  // Track screen views
  useEffect(() => {
    if (pathname) {
      analytics.trackScreen(pathname, { segments: segments.join('/') })
    }
  }, [pathname, segments])

  useEffect(() => {
    if (token && user) {
      registerForPushNotificationsAsync()
      registerBackgroundSync()
      analytics.setUser(user.id, {
        email: user.email,
        role: user.role,
        institution: user.institutionId,
      })
    } else if (!token) {
      analytics.reset()
    }
  }, [token, user])

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'
    const isAuthenticated = !!token

    if (!isAuthenticated && !inAuthGroup && segments.length > 0) {
      // Save the path user was trying to reach for deep linking
      setRedirectPath(pathname)
      router.replace('/(auth)/login')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [token, segments, isLoading, pathname])

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <ErrorBoundary>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <Banner message={message} type={type} isVisible={isVisible} onHide={hideNotification} />
      </ErrorBoundary>
    </PersistQueryClientProvider>
  )
}
