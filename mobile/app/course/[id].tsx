import React from 'react'
import { View, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { AppText } from '../../src/components/AppText'
import { Button } from '../../src/components/Button'
import { Badge } from '../../src/components/Badge'
import { Card } from '../../src/components/Card'

import { useCourse } from '../../src/hooks/useCourses'
import { useEnrollments, useEnrollMutation } from '../../src/hooks/useEnrollments'
import { useRole } from '../../src/hooks/useRole'
import { useAuthStore } from '../../src/state/useAuthStore'
import { useNotificationStore } from '../../src/state/useNotificationStore'
import { analytics } from '../../src/utils/analytics'

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const showNotification = useNotificationStore((state) => state.showNotification)
  const currentUser = useAuthStore((state) => state.user)
  const { isAdmin } = useRole()

  const { data: course, isLoading, error } = useCourse(id)
  const { data: enrollments } = useEnrollments()

  const isEnrolled = enrollments?.some((e) => e.courseId === id)
  const isAuthor = course?.instructorId === currentUser?.id

  const enrollMutation = useEnrollMutation()

  React.useEffect(() => {
    if (course) {
      analytics.track('course_viewed', {
        courseId: course.id,
        title: course.title,
        price: course.price,
        isEnrolled,
      })
    }
  }, [course, isEnrolled])

  const handleEnroll = () => {
    analytics.track('enroll_clicked', { courseId: id, courseTitle: course?.title })
    enrollMutation.mutate(id, {
      onSuccess: () => {
        showNotification('You have been enrolled in this course!', 'success')
        analytics.track('enrollment_success', { courseId: id, courseTitle: course?.title })
      },
      onError: (err: any) => {
        showNotification(err?.message || 'Failed to enroll', 'error')
      },
    })
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    )
  }

  if (error || !course) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-background">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <AppText variant="h3" className="mt-4">
          Failed to load course
        </AppText>
        <Button title="Go Back" onPress={() => router.back()} className="mt-6" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Course Details',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView className="flex-1">
        {/* Thumbnail */}
        <View className="h-60 bg-slate-200">
          {course.thumbnailUrl ? (
            <Image
              source={{ uri: course.thumbnailUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Ionicons name="school-outline" size={64} color="#94a3b8" />
            </View>
          )}
        </View>

        <View className="p-6 -mt-6 bg-background rounded-t-4xl">
          {/* Meta */}
          <View className="flex-row items-center mb-4">
            <Badge label={course.level || 'General'} variant="primary" />
            <View className="flex-row items-center ml-4">
              <Ionicons name="star" size={16} color="#f59e0b" />
              <AppText variant="caption" weight="bold" className="ml-1">
                4.8 (1.2k ratings)
              </AppText>
            </View>
          </View>

          <AppText variant="h1" className="mb-2">
            {course.title}
          </AppText>

          <AppText variant="body" color="muted" className="mb-6">
            {course.description}
          </AppText>

          {/* Instructor */}
          <View className="flex-row items-center p-4 bg-white rounded-2xl mb-8 border border-slate-100">
            <View className="w-12 h-12 bg-slate-100 rounded-full items-center justify-center mr-4">
              <Ionicons name="person-outline" size={24} color="#64748b" />
            </View>
            <View>
              <AppText variant="small" color="muted" weight="medium">
                Instructor
              </AppText>
              <AppText variant="body" weight="bold">
                {course.instructorName || 'Expert Instructor'}
              </AppText>
            </View>
          </View>

          {/* Modules */}
          <AppText variant="h2" className="mb-4">
            Course Content
          </AppText>

          {course.modules?.map((module, index) => (
            <Card key={module.id} className="mb-4">
              <AppText variant="h3" className="mb-2">
                Module {index + 1}: {module.title}
              </AppText>

              {module.lessons?.map((lesson) => (
                <TouchableOpacity
                  key={lesson.id}
                  className="flex-row items-center py-3 border-t border-slate-50"
                  onPress={() => router.push(`/course/${id}/lesson/${lesson.id}`)}
                >
                  <Ionicons
                    name={lesson.type === 'VIDEO' ? 'play-circle-outline' : 'document-text-outline'}
                    size={20}
                    color="#4f46e5"
                  />
                  <AppText variant="body" className="ml-3 flex-1">
                    {lesson.title}
                  </AppText>
                  {lesson.duration && (
                    <AppText variant="small" color="muted">
                      {lesson.duration}m
                    </AppText>
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Action */}
      <View className="p-6 bg-white border-t border-slate-100">
        {isAuthor ? (
          <Button
            title="Edit Course"
            variant="outline"
            onPress={() => router.push(`/course/${id}/edit`)}
          />
        ) : (
          <Button
            title={isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            onPress={() => !isEnrolled && handleEnroll()}
            loading={enrollMutation.isPending}
            disabled={isEnrolled || isAdmin}
          />
        )}
      </View>
    </View>
  )
}
