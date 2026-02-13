import React from 'react'
import { View, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { AppText } from '../../src/components/AppText'
import { Button } from '../../src/components/Button'
import { Badge } from '../../src/components/Badge'
import { Card } from '../../src/components/Card'
import { ProgressBar } from '../../src/components/ProgressBar'

import { useCourse } from '../../src/hooks/useCourses'
import { useEnrollment, useEnrollMutation } from '../../src/hooks/useEnrollments'
import { useCourseAssignments } from '../../src/hooks/useAssignments'
import { useRole } from '../../src/hooks/useRole'
import { useAuthStore } from '../../src/state/useAuthStore'
import { useNotificationStore } from '../../src/state/useNotificationStore'
import { analytics } from '../../src/utils/analytics'
import { Assignment } from '../../src/types'

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const showNotification = useNotificationStore((state) => state.showNotification)
  const currentUser = useAuthStore((state) => state.user)
  const { isAdmin } = useRole()

  const { data: course, isLoading, error } = useCourse(id)
  const enrollment = useEnrollment(id!)
  const { data: assignments } = useCourseAssignments(id!)
  const isEnrolled = !!enrollment
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
    if (course && !course.isFree && !course.hasAccess) {
      analytics.track('enroll_clicked', { courseId: id, courseTitle: course?.title })
      enrollMutation.mutate(id, {
        onSuccess: () => {
          router.push({
            pathname: '/checkout',
            params: {
              courseId: id,
              courseName: course.title,
              price: `${course.currency === 'USD' ? '$' : (course.currency || '$')}${course.price.toFixed(2)}`
            }
          })
        },
        onError: (err: any) => {
          showNotification(err?.message || 'Failed to start checkout', 'error')
        },
      })
      return
    }

    analytics.track('enroll_clicked', { courseId: id, courseTitle: course?.title })
    enrollMutation.mutate(id, {
      onSuccess: (data: any) => {
        if (data?.status === 'PENDING_PAYMENT') {
          showNotification('Enrollment started. Complete payment to unlock this course.', 'info')
        } else {
          showNotification('You have been enrolled in this course!', 'success')
        }
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

          {course.modules
            ?.slice()
            .sort((a, b) => (a.sortOrder ?? a.orderIndex ?? 0) - (b.sortOrder ?? b.orderIndex ?? 0))
            .map((module, index) => {
              const lessons = module.lessons
                ?.slice()
                .sort((a, b) => (a.sortOrder ?? a.orderIndex ?? 0) - (b.sortOrder ?? b.orderIndex ?? 0)) || []
              const completedLessons = lessons.filter((lesson) => enrollment?.completedLessonIds?.includes(lesson.id))
              const moduleProgress = lessons.length > 0
                ? Math.round((completedLessons.length / lessons.length) * 100)
                : 0

              return (
                <Card key={module.id} className="mb-4">
                  <View className="mb-3">
                    <AppText variant="h3" className="mb-2">
                      Module {index + 1}: {module.title}
                    </AppText>
                    {isEnrolled && lessons.length > 0 && (
                      <View className="mb-2">
                        <View className="flex-row items-center justify-between mb-2">
                          <AppText variant="caption" color="muted">
                            Progress {completedLessons.length}/{lessons.length}
                          </AppText>
                          <AppText variant="caption" color="muted">
                            {moduleProgress}%
                          </AppText>
                        </View>
                        <ProgressBar progress={moduleProgress} />
                      </View>
                    )}
                  </View>

                  {lessons.map((lesson) => {
                    const isLessonCompleted = enrollment?.completedLessonIds?.includes(lesson.id)
                    const durationMinutes = lesson.durationMinutes ?? lesson.duration
                    const lessonAssignments = assignments?.filter((a) => a.lessonId === lesson.id) || []
                    const canWatch = lesson.canWatch ?? Boolean(course?.hasAccess || lesson.isPreview)
                    const isLocked = !canWatch

                    return (
                      <View key={lesson.id} style={{ opacity: isLocked ? 0.6 : 1 }}>
                        <TouchableOpacity
                          className="flex-row items-center py-3 border-t border-slate-50"
                          onPress={() => {
                            if (!isLocked) {
                              router.push(`/course/${id}/lesson/${lesson.id}`)
                            } else {
                              showNotification('Please enroll to access this lesson', 'info')
                            }
                          }}
                        >
                          {isLocked ? (
                            <Ionicons name="lock-closed" size={20} color="#94a3b8" />
                          ) : isLessonCompleted ? (
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                          ) : (
                            <Ionicons
                              name={lesson.type === 'VIDEO' ? 'play-circle-outline' : 'document-text-outline'}
                              size={20}
                              color="#4f46e5"
                            />
                          )}
                          <View className="ml-3 flex-1">
                            <AppText variant="body" weight={isLocked ? "medium" : "bold"}>
                              {lesson.title}
                            </AppText>
                            {lesson.isPreview && !course?.hasAccess && (
                              <AppText variant="tiny" weight="bold" className="text-emerald-600 uppercase tracking-tighter">
                                Free Preview
                              </AppText>
                            )}
                          </View>
                          {durationMinutes !== undefined && durationMinutes !== null && (
                            <AppText variant="small" color="muted">
                              {durationMinutes}m
                            </AppText>
                          )}
                        </TouchableOpacity>

                        {/* Lesson Assignments */}
                        {lessonAssignments.map((assignment: Assignment) => (
                          <TouchableOpacity
                            key={assignment.id}
                            className="flex-row items-center ml-8 py-2 px-3 mb-2 bg-indigo-50/50 rounded-lg"
                            onPress={() => router.push(`/assignment/${assignment.id}`)}
                          >
                            <Ionicons name="clipboard-outline" size={16} color="#4f46e5" />
                            <View className="ml-2 flex-1">
                              <AppText variant="small" weight="bold" className="text-indigo-900">
                                {assignment.title}
                              </AppText>
                              {assignment.dueDate && (
                                <AppText variant="tiny" color="muted">
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </AppText>
                              )}
                            </View>
                            <Ionicons name="chevron-forward" size={14} color="#a5b4fc" />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )
                  })}

                  {/* Module Assignments */}
                  {assignments?.filter((a) => a.moduleId === module.id && !a.lessonId).map((assignment: Assignment) => (
                    <TouchableOpacity
                      key={assignment.id}
                      className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg flex-row items-center"
                      onPress={() => router.push(`/assignment/${assignment.id}`)}
                    >
                      <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center">
                        <Ionicons name="clipboard" size={20} color="#4f46e5" />
                      </View>
                      <View className="ml-3 flex-1">
                        <AppText variant="body" weight="bold">{assignment.title}</AppText>
                        <AppText variant="tiny" color="muted">
                          {assignment.dueDate ? `Due: ${new Date(assignment.dueDate).toLocaleDateString()}` : 'Module Assignment'}
                        </AppText>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                  ))}
                </Card>
              )
            })}
        </View>
      </ScrollView>

      {/* Action */}
      <View className="p-6 bg-white border-t border-slate-100 flex-row items-center justify-between">
        <View className="flex-1 mr-4">
          {!course?.hasAccess && (
            <>
              <AppText variant="tiny" color="muted" weight="bold" className="uppercase tracking-widest">
                Price
              </AppText>
              <AppText variant="h2" weight="black">
                {course?.isFree ? 'FREE' : `${course?.currency === 'USD' ? '$' : (course?.currency || '$')}${course?.price.toFixed(2)}`}
              </AppText>
            </>
          )}
        </View>

        <View className="flex-1">
          {isAuthor ? (
            <Button
              title="Edit Course"
              variant="outline"
              onPress={() => router.push(`/course/${id}/edit`)}
            />
          ) : (
            <Button
              title={course?.hasAccess ? 'Continue Learning' : (course?.isFree ? 'Enroll for Free' : 'Buy Now')}
              onPress={() => {
                if (course?.hasAccess) {
                  // Find first lesson or resume
                  router.push(`/course/${id}/lesson/resume`)
                } else {
                  handleEnroll()
                }
              }}
              loading={enrollMutation.isPending}
              disabled={isAdmin}
            />
          )}
        </View>
      </View>
    </View>
  )
}
