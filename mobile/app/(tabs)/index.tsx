import React from 'react'
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { AppText } from '../../src/components/AppText'
import { Card } from '../../src/components/Card'
import { ProgressBar } from '../../src/components/ProgressBar'
import { apiClient } from '../../src/api/client'
import { useAuthStore } from '../../src/state/useAuthStore'
import { Ionicons } from '@expo/vector-icons'

export default function HomeScreen() {
  const router = useRouter()
  const { user } = useAuthStore()

  const {
    data: enrollments,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['enrollments', 'me'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/enrollments')
      return response.data.items || []
    },
  })

  const activeEnrollments = enrollments?.filter((e: any) => e.status !== 'COMPLETED') || []
  const completedEnrollments = enrollments?.filter((e: any) => e.status === 'COMPLETED') || []

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <View className="px-6 py-8">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <AppText variant="h2">Hello, {user?.fullName || 'Learner'}!</AppText>
            <AppText color="muted">Continue your learning journey</AppText>
          </View>
          <TouchableOpacity
            className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center"
            onPress={() => router.push('/(tabs)/profile')}
          >
            <AppText color="primary" weight="bold">
              {user?.fullName?.charAt(0) || 'U'}
            </AppText>
          </TouchableOpacity>
        </View>

        {activeEnrollments.length > 0 ? (
          <View className="mb-8">
            <AppText variant="h3" className="mb-4">
              My Dashboard
            </AppText>
            {activeEnrollments.map((enr: any) => (
              <TouchableOpacity
                key={enr.id}
                onPress={() => router.push(`/course/${enr.courseId}`)}
                activeOpacity={0.8}
              >
                <Card className="mb-4 p-4 border-l-4 border-l-primary">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <AppText variant="body" weight="bold" numberOfLines={1}>
                        {enr.courseTitle || 'Untitled Course'}
                      </AppText>
                      <AppText variant="small" color="muted">
                        Started: {new Date(enr.enrolledAt).toLocaleDateString()}
                      </AppText>
                    </View>
                    <AppText variant="small" weight="bold" color="primary">
                      {enr.progressPct}%
                    </AppText>
                  </View>
                  <ProgressBar progress={enr.progressPct} className="mb-2" />
                  <AppText variant="small" color="primary" weight="medium">
                    Continue Learning
                  </AppText>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          !isLoading && (
            <View className="bg-white p-8 rounded-2xl items-center mb-8 border border-dashed border-slate-200">
              <Ionicons name="school-outline" size={48} color="#94a3b8" />
              <AppText className="mt-4 mb-2" weight="bold">
                No active courses
              </AppText>
              <AppText color="muted" className="text-center mb-6">
                Browse the catalog to find your next course!
              </AppText>
              <TouchableOpacity
                className="bg-primary px-6 py-2.5 rounded-lg"
                onPress={() => router.push('/(tabs)/courses')}
              >
                <AppText className="text-white font-bold">Explore Courses</AppText>
              </TouchableOpacity>
            </View>
          )
        )}

        {completedEnrollments.length > 0 && (
          <View>
            <AppText variant="h3" className="mb-4">
              Completed
            </AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {completedEnrollments.map((enr: any) => (
                <TouchableOpacity
                  key={enr.id}
                  className="mr-4 w-48"
                  onPress={() => router.push(`/course/${enr.courseId}`)}
                >
                  <Card className="p-3">
                    <View className="w-full h-24 bg-slate-100 rounded-lg mb-2 items-center justify-center">
                      <Ionicons name="ribbon-outline" size={32} color="#22c55e" />
                    </View>
                    <AppText variant="small" weight="bold" numberOfLines={2}>
                      {enr.courseTitle}
                    </AppText>
                    <View className="flex-row items-center mt-2">
                      <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                      <AppText variant="small" className="ml-1 text-green-600 font-medium">
                        Completed
                      </AppText>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
