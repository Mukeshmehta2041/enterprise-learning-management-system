import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { AppText } from '../../../../src/components/AppText';
import { Button } from '../../../../src/components/Button';
import { ContentPlayer } from '../../../../src/components/ContentPlayer';
import { apiClient } from '../../../../src/api/client';
import { Ionicons } from '@expo/vector-icons';

export default function LessonScreen() {
  const { id: courseId, lessonId } = useLocalSearchParams();
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsOffline(!state.isConnected);
    };
    checkNetwork();
  }, []);

  // Fetch course to get navigation context (prev/next lessons)
  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/courses/${courseId}`);
      return response.data;
    },
  });

  // Fetch specific lesson content
  const { data: lesson, isLoading, error, refetch } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      // In a real app, this might be a separate endpoint for full content
      // For now, find it in the course modules
      const allLessons = course?.modules?.flatMap((m: any) => m.lessons) || [];
      const found = allLessons.find((l: any) => l.id === lessonId);

      if (!found) throw new Error('Lesson not found');

      // If found, fetch detailed content if needed, or just return found
      // Mocking a fetch for detailed content:
      // const res = await apiClient.get(`/api/v1/courses/${courseId}/lessons/${lessonId}`);
      // return res.data;

      return found;
    },
    enabled: !!course,
  });

  const allLessons = course?.modules?.flatMap((m: any) => m.lessons) || [];
  const currentIndex = allLessons.findIndex((l: any) => l.id === lessonId);
  const prevLesson = allLessons[currentIndex - 1];
  const nextLesson = allLessons[currentIndex + 1];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-background">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <AppText variant="h3" className="mt-4">Failed to load lesson</AppText>
        <Button title="Retry" onPress={() => refetch()} className="mt-6" />
      </View>
    );
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
        <AppText variant="h2" className="mb-2">{lesson.title}</AppText>
        <View className="flex-row items-center mb-6">
          <Ionicons name="time-outline" size={14} color="#64748b" />
          <AppText variant="small" color="muted" className="ml-1">
            {lesson.durationMinutes || 0} min • {lesson.type}
          </AppText>
        </View>

        <ContentPlayer
          type={lesson.type}
          content={lesson.contentUrl || lesson.contentMarkdown || "This is sample lesson content. In a real application, this would be fetched from the backend API."}
        />

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
                Alert.alert("Congratulations!", "You have completed all lessons in this course.");
                router.back();
              }}
              size="md"
            />
          )}
        </View>
      </View>
    </View>
  );
}
