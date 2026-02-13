import React from 'react'
import { View, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { AppText } from '../../src/components/AppText'
import { Card } from '../../src/components/Card'
import { ProgressBar } from '../../src/components/ProgressBar'
import { CourseCarousel } from '../../src/components/CourseCarousel'
import { apiClient } from '../../src/api/client'
import { useAuthStore } from '../../src/state/useAuthStore'
import { useFeaturedCourses, useTrendingCourses } from '../../src/hooks/useCourses'
import { Ionicons } from '@expo/vector-icons'

export default function HomeScreen() {
  const router = useRouter()
  const { user } = useAuthStore()

  const {
    data: enrollments,
    isLoading: isEnrollmentsLoading,
    refetch: refetchEnrollments,
  } = useQuery({
    queryKey: ['enrollments', 'me'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/enrollments')
      return response.data.items || response.data.content || []
    },
  })

  const { data: featuredCourses, isLoading: isFeaturedLoading, refetch: refetchFeatured } = useFeaturedCourses()
  const { data: trendingCourses, isLoading: isTrendingLoading, refetch: refetchTrending } = useTrendingCourses()

  const onRefresh = () => {
    refetchEnrollments()
    refetchFeatured()
    refetchTrending()
  }

  const isLoading = isEnrollmentsLoading || isFeaturedLoading || isTrendingLoading

  const sortedEnrollments = [...(enrollments || [])].sort((a: any, b: any) =>
    new Date(b.lastAccessedAt || b.enrolledAt).getTime() -
    new Date(a.lastAccessedAt || a.enrolledAt).getTime()
  )

  const continueWatching = sortedEnrollments.find((e: any) => e.status !== 'COMPLETED')
  const otherActiveEnrollments = sortedEnrollments.filter(
    (e: any) => e.status !== 'COMPLETED' && e.id !== continueWatching?.id
  )
  const completedEnrollments = sortedEnrollments.filter((e: any) => e.status === 'COMPLETED')

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
    >
      <View className="px-6 py-8">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <AppText variant="h2">Hello, {user?.fullName || 'Learner'}!</AppText>
            <AppText color="muted">Continue your learning journey</AppText>
          </View>
          <TouchableOpacity
            className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center border border-primary/20"
            onPress={() => router.push('/(tabs)/profile')}
          >
            <AppText color="primary" weight="bold">
              {user?.fullName?.charAt(0) || 'U'}
            </AppText>
          </TouchableOpacity>
        </View>

        {continueWatching && (
          <View className="mb-8">
            <AppText variant="h3" className="mb-4">
              Continue Watching
            </AppText>
            <TouchableOpacity
              onPress={() =>
                continueWatching.lastLessonId
                  ? router.push(`/course/${continueWatching.courseId}/lesson/${continueWatching.lastLessonId}`)
                  : router.push(`/course/${continueWatching.courseId}`)
              }
              activeOpacity={0.9}
            >
              <Card className="p-0 overflow-hidden border-0 bg-slate-900 shadow-xl shadow-primary/20">
                <View className="flex-row h-32">
                  <View className="w-1/3 bg-slate-800 items-center justify-center">
                    {continueWatching.courseThumbnailUrl ? (
                      <Image
                        source={{ uri: continueWatching.courseThumbnailUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name="play-circle" size={48} color="#4f46e5" />
                    )}
                  </View>
                  <View className="flex-1 p-4 justify-between">
                    <View>
                      <View className="bg-primary/20 self-start px-2 py-0.5 rounded mb-1">
                        <AppText variant="tiny" weight="bold" color="primary" className="uppercase tracking-tighter">
                          Resume Learning
                        </AppText>
                      </View>
                      <AppText variant="body" weight="bold" className="text-white" numberOfLines={1}>
                        {continueWatching.courseTitle}
                      </AppText>
                      <AppText variant="tiny" className="text-slate-400">
                        Progress: {Math.round(continueWatching.progressPct)}%
                      </AppText>
                    </View>
                    <ProgressBar progress={continueWatching.progressPct} className="h-1.5 bg-slate-800" />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        )}

        {otherActiveEnrollments.length > 0 && (
          <View className="mb-8">
            <AppText variant="h3" className="mb-4">
              Your Courses
            </AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {otherActiveEnrollments.map((enr: any) => (
                <TouchableOpacity
                  key={enr.id}
                  className="mr-4 w-64"
                  onPress={() => router.push(`/course/${enr.courseId}`)}
                  activeOpacity={0.8}
                >
                  <Card className="p-4 border-l-4 border-l-primary/40">
                    <AppText variant="body" weight="bold" numberOfLines={1} className="mb-2">
                      {enr.courseTitle}
                    </AppText>
                    <View className="flex-row justify-between items-center mb-2">
                      <AppText variant="tiny" color="muted">
                        Progress
                      </AppText>
                      <AppText variant="tiny" weight="bold" color="primary">
                        {Math.round(enr.progressPct)}%
                      </AppText>
                    </View>
                    <ProgressBar progress={enr.progressPct} className="h-1" />
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {enrollments?.length === 0 && !isEnrollmentsLoading && (
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
        )}

        <CourseCarousel
          title="Featured Courses"
          courses={featuredCourses}
          isLoading={isFeaturedLoading}
        />

        <CourseCarousel
          title="Trending Now"
          courses={trendingCourses}
          isLoading={isTrendingLoading}
        />

        {completedEnrollments.length > 0 && (
          <View className="mb-8">
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
