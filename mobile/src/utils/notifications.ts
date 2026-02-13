import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { apiClient } from '../api/client'

export async function registerForPushNotificationsAsync() {
  let token

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!')
      return
    }

    // Get the token from Expo
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data
      console.log('Expo Push Token:', token)

      // Send token to backend
      await apiClient.post('/api/v1/users/push-token', { token, platform: Platform.OS })
    } catch (e) {
      console.log('Error getting push token:', e)
    }
  } else {
    console.log('Must use physical device for Push Notifications')
  }

  return token
}

export function handleNotificationResponse(response: Notifications.NotificationResponse) {
  const data = response.notification.request.content.data

  if (data?.url) {
    let url = data.url
    // Normalize web-style links to mobile routes
    if (url.startsWith('/courses/')) {
      url = url.replace('/courses/', '/course/')
    }
    if (url.startsWith('/assignments/')) {
      url = url.replace('/assignments/', '/assignment/')
    }
    return url
  }

  return null
}

export async function setBadgeCount(count: number) {
  if (Platform.OS !== 'web') {
    await Notifications.setBadgeCountAsync(count)
  }
}
