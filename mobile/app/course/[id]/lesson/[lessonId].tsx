import React, { useEffect, useState } from 'react'
import { View, ScrollView, ActivityIndicator, Alert, Modal, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import * as Network from 'expo-network'
import { AppText } from '../../../../src/components/AppText'
import { Button } from '../../../../src/components/Button'
import { ContentPlayer } from '../../../../src/components/ContentPlayer'
import { apiClient } from '../../../../src/api/client'
import { Ionicons } from '@expo/vector-icons'
import { useLessonContent } from '../../../../src/hooks/useContent'
import { useEnrollment } from '../../../../src/hooks/useEnrollments'
import { useRole } from '../../../../src/hooks/useRole'
import { useLessonAssignments } from '../../../../src/hooks/useAssignments'

export default function LessonScreen() {
  const { id: courseId, lessonId } = useLocalSearchParams()
  const router = useRouter()
  const [isOffline, setIsOffline] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const { isInstructor, isAdmin } = useRole()
  const isStaff = isInstructor || isAdmin

  const enrollment = useEnrollment(courseId as string)

  useEffect(() => {
    if (enrollment?.status === 'COMPLETED' && !showCompletionModal) {
      setShowCompletionModal(true)
    }
  }, [enrollment?.status])

  useEffect(() => {
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync()
      setIsOffline(!state.isConnected)
    }
    checkNetwork()
  }, [])

  // Fetch course to get navigation context (prev/next lessons)
  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/courses/${courseId}`)
      return response.data
    },
  })

  // Fetch specific lesson content
  const {
    data: lesson,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      // In a real app, this might be a separate endpoint for full content
      // For now, find it in the course modules
      const allLessons = course?.modules?.flatMap((m: any) => m.lessons) || []
      const found = allLessons.find((l: any) => l.id === lessonId)

      if (!found) throw new Error('Lesson not found')

      // If found, fetch detailed content if needed, or just return found
      // Mocking a fetch for detailed content:
      // const res = await apiClient.get(`/api/v1/courses/${courseId}/lessons/${lessonId}`);
      // return res.data;

      return found
    },
    enabled: !!course,
  })

  const { data: contentData, isLoading: isContentLoading } = useLessonContent(lessonId as string)
  const { data: assignments, isLoading: isAssignmentsLoading } = useLessonAssignments(lessonId as string)

  const allLessons = course?.modules?.flatMap((m: any) => m.lessons) || []
  const currentIndex = allLessons.findIndex((l: any) => l.id === lessonId)
  const prevLesson = allLessons[currentIndex - 1]
  const nextLesson = allLessons[currentIndex + 1]
  const isEnrollmentRevoked = !isStaff && ['DROPPED', 'CANCELLED'].includes(enrollment?.status ?? '')
  const isCourseUnavailable = !isStaff && !!course?.status && course.status !== 'PUBLISHED'

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    )
  }

  if (error || !lesson) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-background">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <AppText variant="h3" className="mt-4">
          Failed to load lesson
        </AppText>
        <Button title="Retry" onPress={() => refetch()} className="mt-6" />
      </View>
    )
  }

  if (isCourseUnavailable) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-background">
        <Ionicons name="alert-circle-outline" size={64} color="#f59e0b" />
        <AppText variant="h3" className="mt-4 text-center">
          Course Unavailable
        </AppText>
        <AppText className="mt-2 text-slate-500 text-center">
          This course is currently unpublished or archived. Please check back later.
        </AppText>
        <Button title="Back to Course" onPress={() => router.replace(`/course/${courseId}`)} className="mt-6" />
      </View>
    )
  }

  if (isEnrollmentRevoked) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-background">
        <Ionicons name="lock-closed-outline" size={64} color="#f59e0b" />
        <AppText variant="h3" className="mt-4 text-center">
          Access Revoked
        </AppText>
        <AppText className="mt-2 text-slate-500 text-center">
          Your enrollment for this course has been revoked. Contact support if you believe this is a mistake.
        </AppText>
        <Button title="Back to Course" onPress={() => router.replace(`/course/${courseId}`)} className="mt-6" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Lesson',
        }}
      />

      {isOffline && (
        <View className="bg-amber-100 px-4 py-2 flex-row items-center justify-center">
          <Ionicons name="cloud-offline-outline" size={16} color="#92400e" />
          <AppText variant="small" className="ml-2 text-amber-800">
            You are offline. Showing cached content.
          </AppText>
        </View>
      )}

      <ScrollView className="flex-1 p-6">
        <AppText variant="h2" className="mb-2">
          {lesson.title}
        </AppText>
        <View className="flex-row items-center mb-6">
          <Ionicons name="time-outline" size={14} color="#64748b" />
          <AppText variant="small" color="muted" className="ml-1">
            {lesson.durationMinutes || 0} min • {lesson.type}
          </AppText>
        </View>

        {(isInstructor || isAdmin) && (
          <View className="bg-amber-100 p-2 mb-4 rounded-lg border border-amber-200">
            <AppText className="text-amber-800 text-xs font-bold text-center">
              INSTRUCTOR PREVIEW MODE
            </AppText>
          </View>
        )}

        <ContentPlayer
          type={lesson.type}
          contentId={contentData?.find(c => c.type === 'VIDEO')?.id}
          lessonId={lessonId as string}
          enrollmentId={enrollment?.id}
          initialPositionSecs={enrollment?.lessonPositions?.[lessonId as string] || 0}
          content={
            lesson.contentUrl ||
            lesson.contentMarkdown ||
            'This is sample lesson content. In a real application, this would be fetched from the backend API.'
          }
          isLoading={isContentLoading}
          onComplete={() => {
            // Handle completion if needed beyond internal player logic
          }}
        />

        {assignments && assignments.length > 0 && (
          <View className="mt-8 mb-4">
            <View className="flex-row items-center mb-4">
              <Ionicons name="document-text-outline" size={20} color="#4f46e5" />
              <AppText variant="h3" className="ml-2">
                Assignments
              </AppText>
            </View>

            {assignments.map((assignment: any) => (
              <TouchableOpacity
                key={assignment.id}
                className="bg-white p-4 rounded-xl border border-slate-200 mb-3 shadow-sm"
                onPress={() => router.push(`/assignment/${assignment.id}`)}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <AppText className="font-bold text-slate-800">
                      {assignment.title}
                    </AppText>
                    <AppText variant="small" color="muted" className="mt-1">
                      {assignment.dueDate ? `Due: ${new Date(assignment.dueDate).toLocaleDateString()}` : 'No deadline'}
                    </AppText>
                  </View>
                  <View className="bg-slate-100 px-2 py-1 rounded">
                    <AppText className="text-xs text-slate-600">
                      {assignment.maxScore} pts
                    </AppText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="h-20" />
      </ScrollView>

      <View className="p-6 bg-white border-t border-slate-100 flex-row gap-4">
        <View className="flex-1">
          {prevLesson && (
            <Button
              title="Previous"
              variant="outline"
              onPress={() => router.replace(`/course/${courseId}/lesson/${prevLesson.id}`)}
              size="md"
            />
          )}
        </View>
        <View className="flex-1">
          {nextLesson ? (
            <Button
              title="Next Lesson"
              onPress={() => router.replace(`/course/${courseId}/lesson/${nextLesson.id}`)}
              size="md"
            />
          ) : (
            <Button
              title="Complete Course"
              variant="secondary"
              onPress={() => {
                Alert.alert('Congratulations!', 'You have completed all lessons in this course.')
                router.back()
              }}
              size="md"
            />
          )}
        </View>
      </View>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View className="flex-1 bg-slate-900/90 items-center justify-center p-6">
          <View className="bg-white w-full max-w-sm rounded-3xl p-8 items-center shadow-2xl">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
              <Ionicons name="trophy" size={40} color="#4f46e5" />
            </View>
            <AppText variant="h2" className="text-center mb-2">
              Course Completed!
            </AppText>
            <AppText color="muted" className="text-center mb-8">
              Congratulations! You've successfully finished {course?.title}.
            </AppText>
            <View className="w-full gap-3">
              <Button
                title="Back to Dashboard"
                onPress={() => {
                  setShowCompletionModal(false)
                  router.push('/(tabs)')
                }}
              />
              <TouchableOpacity
                className="py-3 items-center"
                onPress={() => setShowCompletionModal(false)}
              >
                <AppText color="muted" weight="bold">
                  Review Content
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
