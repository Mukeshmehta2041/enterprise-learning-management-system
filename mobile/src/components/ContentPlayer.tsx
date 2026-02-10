import React from 'react'
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { Video, ResizeMode } from 'expo-av'
import Markdown from 'react-native-markdown-display'
import { AppText } from './AppText'

interface ContentPlayerProps {
  type: 'VIDEO' | 'READING' | 'QUIZ'
  content?: string // URL for video, Markdown for reading
  isLoading?: boolean
}

export function ContentPlayer({ type, content, isLoading }: ContentPlayerProps) {
  if (isLoading) {
    return (
      <View className="h-60 items-center justify-center bg-slate-100 rounded-xl">
        <ActivityIndicator color="#4f46e5" />
      </View>
    )
  }

  if (!content) {
    return (
      <View className="h-60 items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <AppText color="muted">No content available</AppText>
      </View>
    )
  }

  if (type === 'VIDEO') {
    return (
      <View className="h-60 bg-black rounded-xl overflow-hidden">
        <Video
          source={{ uri: content }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          style={StyleSheet.absoluteFill}
        />
      </View>
    )
  }

  if (type === 'READING') {
    return (
      <ScrollView className="flex-1 bg-white p-4 rounded-xl border border-slate-100">
        <Markdown
          style={{
            body: { color: '#0f172a', fontSize: 16, lineHeight: 24 },
            heading1: { color: '#1e293b', marginBottom: 16 },
            link: { color: '#4f46e5' },
          }}
        >
          {content}
        </Markdown>
      </ScrollView>
    )
  }

  return (
    <View className="p-8 items-center justify-center">
      <AppText>Quiz content coming soon...</AppText>
    </View>
  )
}
