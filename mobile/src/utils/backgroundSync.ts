import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import { apiClient } from '../api/client'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

const BACKGROUND_SYNC_TASK = 'BACKGROUND_SYNC_TASK'

// Define the task
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    console.log('Background fetch task running...')

    // Example: Fetch notifications count to update badge
    const response = await apiClient.get('/api/v1/notifications/unread-count')
    const { count } = response.data

    if (Platform.OS !== 'web') {
      await Notifications.setBadgeCountAsync(count)
    }

    return BackgroundFetch.BackgroundFetchResult.NewData
  } catch (error) {
    console.error('Background fetch failed:', error)
    return BackgroundFetch.BackgroundFetchResult.Failed
  }
})

export async function registerBackgroundSync() {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK)
  if (!isRegistered) {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    })
  }
}

export async function unregisterBackgroundSync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_SYNC_TASK)
}
