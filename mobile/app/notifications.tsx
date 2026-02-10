import React, { useEffect } from 'react'
import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
import { Stack } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AppText } from '../src/components/AppText'
import { apiClient } from '../src/api/client'
import { Ionicons } from '@expo/vector-icons'
import { setBadgeCount } from '../src/utils/notifications'

export default function NotificationsScreen() {
  const queryClient = useQueryClient()

  const {
    data: notifications,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/notifications')
      return response.data.items || []
    },
  })

  useEffect(() => {
    if (notifications) {
      const unreadCount = notifications.filter((n: any) => !n.read).length
      setBadgeCount(unreadCount)
    }
  }, [notifications])

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/api/v1/notifications/${id}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] })
    },
  })

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className={`px-6 py-4 border-b border-slate-50 flex-row items-center ${item.read ? 'bg-white' : 'bg-blue-50/30'}`}
      onPress={() => !item.read && markReadMutation.mutate(item.id)}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${item.read ? 'bg-slate-100' : 'bg-primary/20'}`}
      >
        <Ionicons
          name={item.type === 'COURSE_UPDATE' ? 'book' : 'notifications'}
          size={20}
          color={item.read ? '#64748b' : '#4f46e5'}
        />
      </View>
      <View className="flex-1">
        <AppText variant="body" weight={item.read ? 'normal' : 'semibold'}>
          {item.title}
        </AppText>
        <AppText variant="small" color="muted" numberOfLines={2}>
          {item.message}
        </AppText>
        <AppText variant="small" color="muted" className="mt-1 text-[10px]">
          {new Date(item.createdAt).toLocaleString()}
        </AppText>
      </View>
      {!item.read && <View className="w-2 h-2 bg-primary rounded-full ml-2" />}
    </TouchableOpacity>
  )

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerTitle: 'Notifications', headerShown: true }} />
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 items-center justify-center p-12">
              <Ionicons name="notifications-off-outline" size={64} color="#cbd5e1" />
              <AppText variant="h3" color="muted" className="mt-4">
                No notifications
              </AppText>
              <AppText color="muted" className="text-center mt-2">
                We'll let you know when something important happens.
              </AppText>
            </View>
          ) : null
        }
      />
    </View>
  )
}
