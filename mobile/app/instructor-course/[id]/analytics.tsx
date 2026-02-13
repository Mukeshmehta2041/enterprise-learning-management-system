import React from 'react'
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { AppText } from '../../../src/components/AppText'
import { useInstructorCourseAnalytics } from '../../../src/hooks/useInstructor'

const { width } = Dimensions.get('window')

export default function CourseAnalyticsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { data: analytics, isLoading } = useInstructorCourseAnalytics(id)

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <AppText className="text-slate-500">Loading analytics...</AppText>
      </View>
    )
  }

  if (!analytics) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center p-6">
        <Ionicons name="bar-chart-outline" size={64} color="#cbd5e1" />
        <AppText className="text-slate-500 text-center mt-4">
          No analytics data available for this course yet.
        </AppText>
      </View>
    )
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white px-4 pt-12 pb-4 flex-row items-center border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <AppText className="text-xl font-bold text-slate-900">Course Analytics</AppText>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Key Metrics Grid */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <MetricCard
            title="Total Students"
            value={analytics.totalEnrollments.toString()}
            icon="people"
            color="bg-blue-50"
            iconColor="#3b82f6"
          />
          <MetricCard
            title="Active Learners"
            value={analytics.activeLearners.toString()}
            icon="pulse"
            color="bg-emerald-50"
            iconColor="#10b981"
          />
          <MetricCard
            title="Completion Rate"
            value={`${(analytics.completionRate * 100).toFixed(1)}%`}
            icon="checkmark-circle"
            color="bg-indigo-50"
            iconColor="#6366f1"
          />
        </View>

        {/* Content Engagement Breakdown */}
        <View className="bg-white rounded-2xl p-4 border border-slate-100 mb-8 shadow-sm">
          <View className="flex-row items-center mb-4">
            <Ionicons name="play-circle" size={20} color="#4f46e5" />
            <AppText className="text-lg font-bold text-slate-900 ml-2">Lecture Engagement</AppText>
          </View>

          {analytics.lectureEngagement.map((lecture, index) => (
            <View
              key={lecture.lessonId}
              className={`py-4 ${index !== analytics.lectureEngagement.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              <AppText className="font-bold text-slate-800 mb-2">{lecture.lessonTitle}</AppText>

              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <Ionicons name="eye-outline" size={14} color="#64748b" />
                  <AppText className="text-slate-500 text-xs ml-1">{lecture.totalWatches} views</AppText>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={14} color="#64748b" />
                  <AppText className="text-slate-500 text-xs ml-1">{formatTime(lecture.totalWatchTimeSecs)} total</AppText>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-done-outline" size={14} color="#64748b" />
                  <AppText className="text-slate-500 text-xs ml-1">{(lecture.completionRate * 100).toFixed(0)}% completion</AppText>
                </View>
              </View>

              {/* Simple progress bar representing completion rate */}
              <View className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <View
                  className="h-full bg-indigo-500"
                  style={{ width: `${lecture.completionRate * 100}%` }}
                />
              </View>
            </View>
          ))}

          {analytics.lectureEngagement.length === 0 && (
            <AppText className="text-slate-400 text-center py-4 italic">
              No lecture data yet
            </AppText>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

function MetricCard({
  title,
  value,
  icon,
  color,
  iconColor
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
  iconColor: string
}) {
  return (
    <View className={`w-[48%] ${color} rounded-2xl p-4 mb-4 border border-white`}>
      <View className="flex-row justify-between items-start mb-2">
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <AppText className="text-slate-500 text-xs mb-1 font-medium">{title}</AppText>
      <AppText className="text-slate-900 text-xl font-bold">{value}</AppText>
    </View>
  )
}
