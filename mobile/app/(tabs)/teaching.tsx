import React from 'react'
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { AppText } from '../../src/components/AppText'
import { useInstructorCourses, useInstructorStats } from '../../src/hooks/useInstructor'
import { Course } from '../../src/types'
import { useRouter } from 'expo-router'

export default function TeachingScreen() {
  const router = useRouter()
  const {
    data: courses,
    isLoading: coursesLoading,
    refetch: refetchCourses,
  } = useInstructorCourses()
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useInstructorStats()

  const onRefresh = React.useCallback(() => {
    refetchCourses()
    refetchStats()
  }, [refetchCourses, refetchStats])

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string
    value: string | number
    icon: any
    color: string
  }) => (
    <View className="bg-white p-4 rounded-2xl border border-slate-100 flex-1 mx-1 shadow-sm">
      <View className={`w-8 h-8 rounded-full ${color} items-center justify-center mb-2`}>
        <Ionicons name={icon} size={16} color="white" />
      </View>
      <AppText className="text-slate-500 text-xs mb-1">{title}</AppText>
      <AppText className="text-slate-900 font-bold text-lg">{value}</AppText>
    </View>
  )

  const renderHeader = () => (
    <View className="px-4 pt-4">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <AppText className="text-2xl font-bold text-slate-900">Teaching Dashboard</AppText>
          <AppText className="text-slate-500">Manage your content and students</AppText>
        </View>
        <TouchableOpacity
          testID="add-course-button"
          className="bg-indigo-600 w-10 h-10 rounded-full items-center justify-center shadow-md shadow-indigo-300"
          onPress={() => router.push('/course-create')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-row mb-6">
        <StatCard
          title="Students"
          value={stats?.totalStudents || 0}
          icon="people"
          color="bg-blue-500"
        />
        <StatCard
          title="Earnings"
          value={`$${stats?.totalEarnings || 0}`}
          icon="cash"
          color="bg-emerald-500"
        />
      </View>

      <View className="flex-row mb-8">
        <StatCard
          title="Courses"
          value={stats?.activeCourses || 0}
          icon="book"
          color="bg-violet-500"
        />
        <StatCard
          title="Rating"
          value={stats?.averageRating || 0}
          icon="star"
          color="bg-amber-500"
        />
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <AppText className="text-lg font-bold text-slate-900">Your Courses</AppText>
        <TouchableOpacity onPress={() => router.push('/instructor-courses')}>
          <AppText className="text-indigo-600 font-medium">View All</AppText>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      className="flex-row bg-white mx-4 mb-3 p-3 rounded-xl border border-slate-100 items-center shadow-sm"
      onPress={() => router.push(`/instructor-course/${item.id}`)}
    >
      <View className="w-16 h-16 bg-slate-100 rounded-lg items-center justify-center mr-3">
        {item.thumbnailUrl ? (
          <View className="w-full h-full bg-slate-200 rounded-lg overflow-hidden" />
        ) : (
          <Ionicons name="image-outline" size={24} color="#94a3b8" />
        )}
      </View>
      <View className="flex-1">
        <AppText className="text-slate-900 font-bold mb-1" numberOfLines={1}>
          {item.title}
        </AppText>
        <View className="flex-row items-center">
          <AppText className="text-slate-500 text-xs">{item.enrollmentCount || 0} Students</AppText>
          <View className="w-1 h-1 bg-slate-300 rounded-full mx-2" />
          <AppText className="text-emerald-600 text-xs font-medium">${item.price}</AppText>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <FlatList
        data={courses?.slice(0, 5)}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={coursesLoading || statsLoading} onRefresh={onRefresh} />
        }
        ListFooterComponent={<View style={{ height: 20 }} />}
        ListEmptyComponent={() =>
          !coursesLoading && (
            <View className="items-center justify-center py-20 px-10">
              <View className="bg-slate-200 w-16 h-16 rounded-full items-center justify-center mb-4">
                <Ionicons name="school-outline" size={32} color="#64748b" />
              </View>
              <AppText className="text-slate-900 font-bold text-lg text-center mb-2">
                No Courses Yet
              </AppText>
              <AppText className="text-slate-500 text-center mb-6">
                Start sharing your knowledge by creating your first course.
              </AppText>
              <TouchableOpacity
                className="bg-indigo-600 px-6 py-3 rounded-xl"
                onPress={() => router.push('/course-create')}
              >
                <AppText className="text-white font-bold">Create Course</AppText>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </SafeAreaView>
  )
}
