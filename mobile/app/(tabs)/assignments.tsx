import React from 'react'
import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { AppText } from '../../src/components/AppText'
import { Card } from '../../src/components/Card'
import { Badge } from '../../src/components/Badge'
import { apiClient } from '../../src/api/client'
import { Ionicons } from '@expo/vector-icons'

export default function AssignmentsScreen() {
  const router = useRouter()

  const {
    data: assignments,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['assignments', 'list'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/assignments')
      return (response.data.items || response.data.content || []).filter(Boolean)
    },
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'primary'
      case 'GRADED':
        return 'success'
      case 'OVERDUE':
        return 'danger'
      case 'PENDING':
        return 'warning'
      default:
        return 'neutral'
    }
  }

  const renderItem = ({ item }: { item: any }) => {
    if (!item) return null
    return (
      <TouchableOpacity
        onPress={() => router.push(`/assignment/${item.id}`)}
        activeOpacity={0.8}
        className="px-6 mb-4"
      >
        <Card className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <AppText variant="h3" className="flex-1 mr-2" numberOfLines={1}>
              {item.title}
            </AppText>
            <Badge label={item.status} variant={getStatusVariant(item.status)} />
          </View>
          <AppText variant="small" color="muted" className="mb-4" numberOfLines={2}>
            {item.courseTitle || 'Course Title'}
          </AppText>
          <View className="flex-row justify-between items-center bg-slate-50 p-2 rounded-lg">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={14} color="#64748b" />
              <AppText variant="small" color="muted" className="ml-1">
                Due: {new Date(item.dueDate).toLocaleDateString()}
              </AppText>
            </View>
            {item.grade && (
              <AppText variant="small" weight="bold" color="primary">
                Grade: {item.grade}/100
              </AppText>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <View className="p-6 bg-white border-b border-slate-100">
        <AppText variant="h1">Assignments</AppText>
        <AppText color="muted">Manage your tasks and deadlines</AppText>
      </View>

      <FlatList
        data={assignments}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id || index.toString()}
        contentContainerStyle={{ paddingVertical: 20 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center p-12">
              <Ionicons name="clipboard-outline" size={64} color="#cbd5e1" />
              <AppText variant="h3" color="muted" className="mt-4">
                All clear!
              </AppText>
              <AppText color="muted" className="text-center mt-2">
                No pending assignments found.
              </AppText>
            </View>
          ) : null
        }
      />
    </View>
  )
}
