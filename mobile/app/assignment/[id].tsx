import React, { useState } from 'react'
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AppText } from '../../src/components/AppText'
import { Button } from '../../src/components/Button'
import { Badge } from '../../src/components/Badge'
import { Card } from '../../src/components/Card'
import { Input } from '../../src/components/Input'
import { apiClient } from '../../src/api/client'
import { Ionicons } from '@expo/vector-icons'

export default function AssignmentDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [submissionText, setSubmissionText] = useState('')

  const {
    data: assignment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['assignment', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/assignments/${id}`)
      return response.data
    },
  })

  const submitMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiClient.post(`/api/v1/assignments/${id}/submit`, { text })
      return response.data
    },
    onSuccess: () => {
      Alert.alert('Success', 'Your assignment has been submitted.')
      queryClient.invalidateQueries({ queryKey: ['assignment', id] })
      queryClient.invalidateQueries({ queryKey: ['assignments', 'list'] })
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit assignment')
    },
  })

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    )
  }

  if (error || !assignment) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-background">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <AppText variant="h3" className="mt-4">
          Failed to load assignment
        </AppText>
        <Button title="Go Back" onPress={() => router.back()} className="mt-6" />
      </View>
    )
  }

  const isSubmitted = assignment.status === 'SUBMITTED' || assignment.status === 'GRADED'

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen options={{ headerTitle: 'Assignment' }} />
      <ScrollView className="flex-1 p-6">
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <AppText variant="h1" className="flex-1 mr-2">
              {assignment.title}
            </AppText>
            <Badge
              label={assignment.status}
              variant={
                assignment.status === 'GRADED'
                  ? 'success'
                  : assignment.status === 'SUBMITTED'
                    ? 'primary'
                    : 'warning'
              }
            />
          </View>
          <AppText color="muted">{assignment.courseTitle}</AppText>
        </View>

        <Card className="mb-6">
          <AppText variant="caption" weight="bold" color="muted" className="mb-2">
            DESCRIPTION
          </AppText>
          <AppText variant="body" className="mb-4">
            {assignment.description}
          </AppText>

          <View className="flex-row items-center pt-4 border-t border-slate-50">
            <Ionicons name="calendar-outline" size={16} color="#64748b" />
            <AppText variant="small" color="muted" className="ml-2">
              Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
            </AppText>
          </View>
        </Card>

        {assignment.status === 'GRADED' && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <AppText variant="caption" weight="bold" color="primary" className="mb-2">
              GRADE & FEEDBACK
            </AppText>
            <AppText variant="h2" color="primary">
              {assignment.grade}/100
            </AppText>
            <AppText variant="body" className="mt-2">
              {assignment.feedback || 'Excellent work!'}
            </AppText>
          </Card>
        )}

        {!isSubmitted ? (
          <View>
            <AppText variant="h3" className="mb-4">
              Your Submission
            </AppText>
            <Input
              placeholder="Type your submission here..."
              multiline
              numberOfLines={6}
              value={submissionText}
              onChangeText={setSubmissionText}
              inputClassName="h-40 align-top"
            />
            <Button
              title="Submit Assignment"
              onPress={() => submitMutation.mutate(submissionText)}
              loading={submitMutation.isPending}
              disabled={!submissionText.trim()}
              className="mt-2"
            />
          </View>
        ) : (
          <View>
            <AppText variant="h3" className="mb-4">
              My Submission
            </AppText>
            <Card className="bg-slate-50">
              <AppText variant="body">{assignment.submissionText || 'No text provided.'}</AppText>
              <AppText variant="small" color="muted" className="mt-4 italic">
                Submitted on {new Date(assignment.submittedAt).toLocaleString()}
              </AppText>
            </Card>
            <AppText variant="small" color="muted" className="mt-4 text-center">
              This assignment has already been submitted and cannot be edited.
            </AppText>
          </View>
        )}

        <View className="h-10" />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
