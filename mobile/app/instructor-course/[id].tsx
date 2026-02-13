import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator, AlertButton } from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { AppText } from '../../src/components/AppText'
import { useInstructorCourse } from '../../src/hooks/useInstructor'
import { apiClient } from '../../src/api/client'
import { useQueryClient } from '@tanstack/react-query'
import { useUpload } from '../../src/hooks/useUpload'
import { MobileAppError } from '../../src/utils/errors'
import { useLessonContent } from '../../src/hooks/useContent'

export default function InstructorCourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: course, isLoading } = useInstructorCourse(id!)
  const [updating, setUpdating] = useState(false)
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null)

  const { pickAndUpload, isUploading, progress } = useUpload()

  const handleUpload = async (lessonId: string, type: 'VIDEO' | 'DOCUMENT') => {
    try {
      setActiveUploadId(lessonId)
      await pickAndUpload(lessonId, type)
      Alert.alert('Success', 'Content uploaded successfully')
      queryClient.invalidateQueries({ queryKey: ['instructor', 'course', id] })
    } catch (error) {
      if (error instanceof MobileAppError) {
        const actions: AlertButton[] = [{ text: 'OK' }]
        if (error.isRetryable) {
          actions.unshift({
            text: 'Retry',
            onPress: () => handleUpload(lessonId, type),
          })
        }
        Alert.alert('Upload failed', error.message, actions)
      } else {
        Alert.alert('Error', 'Failed to upload content')
      }
    } finally {
      setActiveUploadId(null)
    }
  }

  const toggleStatus = async () => {
    if (!course) return

    const newStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'

    Alert.alert(
      'Confirm Change',
      `Are you sure you want to ${newStatus === 'PUBLISHED' ? 'publish' : 'unpublish'} this course?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              setUpdating(true)
              await apiClient.patch(`/api/v1/courses/${id}/status`, { status: newStatus })
              queryClient.invalidateQueries({ queryKey: ['instructor', 'course', id] })
              queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] })
            } catch {
              Alert.alert('Error', 'Failed to update course status')
            } finally {
              setUpdating(false)
            }
          },
        },
      ],
    )
  }

  if (isLoading || !course) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    )
  }

  const sortedModules = (course.modules || []).slice().sort((a, b) => getOrder(a) - getOrder(b))

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen
        options={{
          title: 'Manage Course',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push(`/instructor-course/${id}/edit`)}>
              <AppText className="text-indigo-600 font-bold mr-4">Edit</AppText>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1">
        <View className="bg-white p-6 border-b border-slate-100 mb-4">
          <AppText className="text-2xl font-bold text-slate-900 mb-2">{course.title}</AppText>
          <View className="flex-row items-center mb-6">
            <View
              className={`px-2 py-1 rounded-md ${course.status === 'PUBLISHED' ? 'bg-emerald-100' : 'bg-slate-100'} mr-3`}
            >
              <AppText
                className={`text-xs font-bold ${course.status === 'PUBLISHED' ? 'text-emerald-700' : 'text-slate-600'}`}
              >
                {course.status}
              </AppText>
            </View>
            <AppText className="text-slate-500 text-sm">
              {course.enrollmentCount} Active Students
            </AppText>
          </View>

          <View className="flex-row items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <View>
              <AppText className="font-bold text-slate-900">Visibility</AppText>
              <AppText className="text-slate-500 text-xs">Publicly visible to students</AppText>
            </View>
            <Switch
              value={course.status === 'PUBLISHED'}
              onValueChange={toggleStatus}
              disabled={updating}
              trackColor={{ false: '#cbd5e1', true: '#818cf8' }}
              thumbColor={course.status === 'PUBLISHED' ? '#4f46e5' : '#f1f5f9'}
            />
          </View>
        </View>

        <View className="px-4">
          <View className="flex-row justify-between items-center mb-4">
            <AppText className="text-lg font-bold text-slate-900">Curriculum</AppText>
            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="add-circle-outline" size={20} color="#4f46e5" />
              <AppText className="text-indigo-600 font-medium ml-1">Add Module</AppText>
            </TouchableOpacity>
          </View>

          {sortedModules.map((module, index) => (
            <View
              key={module.id}
              className="bg-white rounded-xl border border-slate-100 mb-3 overflow-hidden"
            >
              <TouchableOpacity className="flex-row items-center p-4">
                <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center mr-3">
                  <AppText className="text-slate-600 font-bold text-xs">{index + 1}</AppText>
                </View>
                <AppText className="flex-1 font-bold text-slate-900">{module.title}</AppText>
                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
              </TouchableOpacity>

              <View className="bg-slate-50 border-t border-slate-100">
                {module.lessons
                  .slice()
                  .sort((a, b) => getOrder(a) - getOrder(b))
                  .map((lesson) => (
                    <LessonRow
                      key={lesson.id}
                      lesson={lesson}
                      onUpload={handleUpload}
                      isUploading={activeUploadId === lesson.id && isUploading}
                      progress={progress}
                    />
                  ))}
              </View>
            </View>
          ))}

          {(!course.modules || course.modules.length === 0) && (
            <View className="bg-white p-8 rounded-xl border border-dashed border-slate-300 items-center">
              <Ionicons name="list-outline" size={32} color="#94a3b8" />
              <AppText className="text-slate-500 mt-2">No modules added yet</AppText>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="p-4 bg-white border-t border-slate-100 gap-y-3">
        <TouchableOpacity
          className="bg-white border border-slate-200 p-4 rounded-xl items-center"
          onPress={() => router.push(`/instructor-course/${id}/analytics`)}
        >
          <View className="flex-row items-center">
            <Ionicons name="bar-chart-outline" size={20} color="#4f46e5" />
            <AppText className="text-indigo-600 font-bold ml-2">View Course Analytics</AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-indigo-600 p-4 rounded-xl items-center shadow-lg shadow-indigo-200"
          onPress={() => router.push(`/instructor-course/${id}/assignments`)}
        >
          <View className="flex-row items-center">
            <Ionicons name="clipboard-outline" size={20} color="white" />
            <AppText className="text-white font-bold ml-2">Manage Assignments</AppText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function LessonRow({
  lesson,
  onUpload,
  isUploading,
  progress,
}: {
  lesson: { id: string; title: string; type: 'VIDEO' | 'DOCUMENT' | 'QUIZ' }
  onUpload: (lessonId: string, type: 'VIDEO' | 'DOCUMENT') => void
  isUploading: boolean
  progress: number
}) {
  const { data: contentItems } = useLessonContent(lesson.id)
  const content = contentItems?.[0]
  const status = content?.status
  const metadata = content?.metadata
  const statusLabel = formatStatus(status)

  return (
    <View className="border-b border-slate-100">
      <TouchableOpacity
        className="flex-row items-center p-3 pl-15"
        onPress={() => {
          if (lesson.type !== 'QUIZ') {
            Alert.alert(
              'Manage Content',
              `Upload or replace content for ${lesson.title}`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: `Upload ${lesson.type === 'VIDEO' ? 'Video' : 'Document'}`,
                  onPress: () => onUpload(lesson.id, lesson.type as 'VIDEO' | 'DOCUMENT'),
                },
              ],
            )
          }
        }}
      >
        <Ionicons
          name={lesson.type === 'VIDEO' ? 'play-circle' : (lesson.type === 'QUIZ' ? 'help-circle' : 'document-text')}
          size={16}
          color={status === 'READY' ? '#10b981' : status === 'FAILED' ? '#f43f5e' : '#64748b'}
          style={{ marginRight: 8, marginLeft: 36 }}
        />
        <View className="flex-1">
          <AppText className="text-sm text-slate-900" numberOfLines={1}>
            {lesson.title}
          </AppText>
          <View className="flex-row items-center mt-1">
            <AppText className={`text-[10px] mr-2 ${status === 'FAILED' ? 'text-rose-600' : 'text-slate-500'}`}>
              {statusLabel}
            </AppText>
            {metadata?.durationSecs ? (
              <AppText className="text-[10px] text-slate-500 mr-2">
                {formatDuration(metadata.durationSecs)}
              </AppText>
            ) : null}
            {metadata?.sizeBytes ? (
              <AppText className="text-[10px] text-slate-500">
                {formatBytes(metadata.sizeBytes)}
              </AppText>
            ) : null}
          </View>
        </View>

        {isUploading ? (
          <View className="flex-row items-center">
            <AppText className="text-[10px] text-indigo-600 mr-1 font-bold">{progress}%</AppText>
            <ActivityIndicator size="small" color="#4f46e5" />
          </View>
        ) : (
          status === 'READY' ? (
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          ) : (
            <Ionicons name="cloud-upload-outline" size={16} color="#4f46e5" />
          )
        )}
      </TouchableOpacity>

      {isUploading && (
        <View className="h-0.5 bg-slate-200 w-full overflow-hidden">
          <View className="h-full bg-indigo-600" style={{ width: `${progress}%` }} />
        </View>
      )}
    </View>
  )
}

function formatStatus(status?: string) {
  if (!status) return 'No media'
  if (status === 'PROCESSING') return 'Processing'
  if (status === 'UPLOADING') return 'Uploading'
  if (status === 'READY') return 'Ready'
  if (status === 'FAILED') return 'Failed'
  return status
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  if (!remaining) return `${minutes}m`
  return `${minutes}m ${remaining}s`
}

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  const kb = bytes / 1024
  return `${kb.toFixed(0)} KB`
}

function getOrder(item: { sortOrder?: number; orderIndex?: number }) {
  if (typeof item.sortOrder === 'number') return item.sortOrder
  if (typeof item.orderIndex === 'number') return item.orderIndex
  return 0
}
