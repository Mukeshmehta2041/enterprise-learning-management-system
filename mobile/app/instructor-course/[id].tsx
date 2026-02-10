import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { AppText } from '../../src/components/AppText'
import { useInstructorCourse } from '../../src/hooks/useInstructor'
import { apiClient } from '../../src/api/client'
import { useQueryClient } from '@tanstack/react-query'

export default function InstructorCourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: course, isLoading } = useInstructorCourse(id!)
  const [updating, setUpdating] = useState(false)

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
        <AppText>Loading...</AppText>
      </View>
    )
  }

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

          {course.modules?.map((module, index) => (
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
                {module.lessons.map((lesson) => (
                  <TouchableOpacity
                    key={lesson.id}
                    className="flex-row items-center p-3 pl-15 border-b border-slate-100"
                  >
                    <Ionicons
                      name={lesson.type === 'VIDEO' ? 'play-circle' : 'document-text'}
                      size={16}
                      color="#64748b"
                      style={{ marginRight: 8, marginLeft: 36 }}
                    />
                    <AppText className="flex-1 text-slate-700 text-sm" numberOfLines={1}>
                      {lesson.title}
                    </AppText>
                    <Ionicons name="ellipsis-vertical" size={16} color="#cbd5e1" />
                  </TouchableOpacity>
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

      <View className="p-4 bg-white border-t border-slate-100">
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
