import React, { useState, useEffect } from 'react'
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { AppText } from '../../../src/components/AppText'
import { Input } from '../../../src/components/Input'
import { Button } from '../../../src/components/Button'
import { Select } from '../../../src/components/Select'
import { useInstructorCourse, useUpdateCourse } from '../../../src/hooks/useInstructor'
import { Ionicons } from '@expo/vector-icons'

export default function EditCourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { data: course, isLoading } = useInstructorCourse(id!)
  const updateMutation = useUpdateCourse()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'PROGRAMMING',
    level: 'BEGINNER',
    price: '0',
    thumbnailUrl: '',
  })

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: (course as any).category || 'PROGRAMMING',
        level: course.level || 'BEGINNER',
        price: course.price?.toString() || '0',
        thumbnailUrl: course.thumbnailUrl || '',
      })
    }
  }, [course])

  const handleSave = async () => {
    if (!formData.title.trim() || formData.title.length < 5) {
      Alert.alert('Error', 'Title must be at least 5 characters')
      return
    }

    try {
      await updateMutation.mutateAsync({
        id: id!,
        data: {
          ...formData,
          price: parseFloat(formData.price) || 0,
        } as any,
      })
      Alert.alert('Success', 'Course updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ])
    } catch (error) {
      Alert.alert('Error', 'Failed to update course')
    }
  }

  if (isLoading || !course) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <AppText>Loading...</AppText>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ title: 'Edit Details' }} />
      <ScrollView className="flex-1 bg-white p-4">
        <View className="space-y-6 pb-20">
          <Input
            label="Course Title"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Enter course title"
          />

          <Input
            label="Thumbnail URL"
            value={formData.thumbnailUrl}
            onChangeText={(text) => setFormData({ ...formData, thumbnailUrl: text })}
            placeholder="https://example.com/image.jpg"
          />

          <Input
            label="Description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Describe your course"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Select
            label="Category"
            value={formData.category}
            onValueChange={(val) => setFormData({ ...formData, category: val })}
            options={[
              { label: 'Programming', value: 'PROGRAMMING' },
              { label: 'Design', value: 'DESIGN' },
              { label: 'Business', value: 'BUSINESS' },
              { label: 'Marketing', value: 'MARKETING' },
            ]}
          />

          <Select
            label="Level"
            value={formData.level}
            onValueChange={(val) => setFormData({ ...formData, level: val })}
            options={[
              { label: 'Beginner', value: 'BEGINNER' },
              { label: 'Intermediate', value: 'INTERMEDIATE' },
              { label: 'Advanced', value: 'ADVANCED' },
            ]}
          />

          <Input
            label="Price ($)"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text.replace(/[^0-9.]/g, '') })}
            placeholder="0.00"
            keyboardType="numeric"
          />

          <View className="pt-4">
            <Button
              title={updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              onPress={handleSave}
              disabled={updateMutation.isPending}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
