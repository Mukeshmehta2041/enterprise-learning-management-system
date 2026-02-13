import React, { useState, useRef, useEffect, useMemo } from 'react'
import { View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Modal } from 'react-native'
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av'
import Markdown from 'react-native-markdown-display'
import { AppText } from './AppText'
import { usePlaybackToken } from '../hooks/useContent'
import { useUpdateProgressMutation } from '../hooks/useEnrollments'
import { Ionicons } from '@expo/vector-icons'
import * as Network from 'expo-network'

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

interface ContentPlayerProps {
  type: 'VIDEO' | 'READING' | 'DOCUMENT' | 'QUIZ'
  content?: string // Markdown for reading/document
  contentId?: string // ID for video playback token
  lessonId?: string
  enrollmentId?: string
  initialPositionSecs?: number
  isLoading?: boolean
  onComplete?: () => void
}

export function ContentPlayer({
  type,
  content,
  contentId,
  lessonId,
  enrollmentId,
  initialPositionSecs = 0,
  isLoading: isInitialLoading,
  onComplete
}: ContentPlayerProps) {
  const videoRef = useRef<Video>(null)
  const [hasResumed, setHasResumed] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState(0)
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null)
  const [showQualityModal, setShowQualityModal] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)

  const { data: playbackData, isLoading: isTokenLoading, isError, error } = usePlaybackToken(type === 'VIDEO' ? contentId : undefined)
  const updateProgress = useUpdateProgressMutation()

  const isLoading = isInitialLoading || (type === 'VIDEO' && isTokenLoading)

  const currentUrl = useMemo(() => {
    if (selectedQuality && playbackData?.renditions) {
      return playbackData.renditions.find(r => r.quality === selectedQuality)?.url || playbackData.playbackUrl
    }
    return playbackData?.playbackUrl
  }, [selectedQuality, playbackData])

  // Network-aware defaults
  useEffect(() => {
    const autoSelectQuality = async () => {
      if (type !== 'VIDEO' || !playbackData?.renditions?.length) return

      const network = await Network.getNetworkStateAsync()
      if (network.type === Network.NetworkStateType.CELLULAR) {
        // Find lowest quality for cellular
        const renditions = [...playbackData.renditions].sort((a, b) =>
          parseInt(a.quality) - parseInt(b.quality)
        )
        if (renditions.length > 0) {
          setSelectedQuality(renditions[0].quality)
        }
      }
    }
    autoSelectQuality()
  }, [playbackData, type])

  useEffect(() => {
    if (type === 'VIDEO' && !isLoading && playbackData && videoRef.current && !hasResumed && initialPositionSecs > 0) {
      videoRef.current.setPositionAsync(initialPositionSecs * 1000)
      setHasResumed(true)
    }
  }, [isLoading, playbackData, initialPositionSecs, hasResumed, type])

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return

    setCurrentPosition(status.positionMillis)

    if (status.didJustFinish) {
      onComplete?.()
      if (enrollmentId && lessonId) {
        updateProgress.mutate({ enrollmentId, lessonId, completed: true })
      }
    }

    // Save position every 15 seconds
    const currentSecs = Math.floor(status.positionMillis / 1000)
    if (currentSecs > 0 && currentSecs !== lastSavedTime && currentSecs % 15 === 0) {
      if (enrollmentId && lessonId) {
        updateProgress.mutate({ enrollmentId, lessonId, positionSecs: currentSecs })
        setLastSavedTime(currentSecs)
      }
    }
  }

  const handleQualityChange = (quality: string | null) => {
    setSelectedQuality(quality)
    setShowQualityModal(false)
    // expo-av Video source change handles position reset, we might want to restore it
    // But Video component handles source changes by resetting. 
    // We can rely on the resume logic or manually setPosition after source load if needed.
    setHasResumed(false) // Trigger resume effect for the new source
  }

  if (isLoading) {
    return (
      <View className="h-60 items-center justify-center bg-slate-900 rounded-xl">
        <ActivityIndicator color="#6366f1" />
        <AppText className="mt-4 text-slate-400">Securing your stream...</AppText>
      </View>
    )
  }

  if (type === 'VIDEO') {
    if (isError) {
      const isAccessDenied = (error as any)?.status === 403
      const errorMessage = (error as any)?.message || ''
      const isCourseUnavailable = typeof errorMessage === 'string'
        && errorMessage.toLowerCase().includes('not available')
      return (
        <View className="h-60 items-center justify-center bg-slate-900 rounded-xl px-8 border border-slate-800">
          {isAccessDenied ? (
            <View className="items-center">
              <Ionicons name="lock-closed" size={32} color="#f59e0b" />
              <AppText className="mt-4 text-white font-bold">
                {isCourseUnavailable ? 'Course Unavailable' : 'Access Restricted'}
              </AppText>
              <AppText className="mt-2 text-slate-400 text-center text-xs">
                {isCourseUnavailable
                  ? 'This course is currently unpublished or archived.'
                  : 'This lesson requires an active enrollment. Your access may have been revoked.'}
              </AppText>
            </View>
          ) : (
            <View className="items-center">
              <Ionicons name="alert-circle" size={32} color="#ef4444" />
              <AppText className="mt-4 text-white font-bold">Playback Error</AppText>
              <AppText className="mt-2 text-slate-400 text-center text-xs">
                We couldn't authorize this stream. Please try again later.
              </AppText>
            </View>
          )}
        </View>
      )
    }

    if (!playbackData?.playbackUrl) {
      return (
        <View className="h-60 items-center justify-center bg-slate-900 rounded-xl border border-slate-800">
          <AppText color="muted">Video not available</AppText>
        </View>
      )
    }

    return (
      <View className="h-60 bg-black rounded-xl overflow-hidden border border-slate-800 shadow-xl relative">
        <Video
          ref={videoRef}
          source={{ uri: currentUrl || '' }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          style={StyleSheet.absoluteFill}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />

        {playbackData?.renditions && playbackData.renditions.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowQualityModal(true)}
            style={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 }}
          >
            <Ionicons name="settings-outline" size={20} color="white" />
          </TouchableOpacity>
        )}

        <Modal
          visible={showQualityModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowQualityModal(false)}
        >
          <TouchableOpacity
            className="flex-1 bg-black/50 justify-end"
            onPress={() => setShowQualityModal(false)}
          >
            <View className="bg-slate-900 rounded-t-3xl p-6">
              <AppText className="text-white font-bold text-lg mb-4">Select Quality</AppText>

              <TouchableOpacity
                onPress={() => handleQualityChange(null)}
                className={cn("py-4 border-b border-slate-800", !selectedQuality && "bg-slate-800 rounded-lg px-4")}
              >
                <AppText className={cn("text-slate-300", !selectedQuality && "text-white font-bold")}>Auto</AppText>
              </TouchableOpacity>

              {playbackData?.renditions?.map(r => (
                <TouchableOpacity
                  key={r.quality}
                  onPress={() => handleQualityChange(r.quality)}
                  className={cn("py-4 border-b border-slate-800", selectedQuality === r.quality && "bg-slate-800 rounded-lg px-4")}
                >
                  <AppText className={cn("text-slate-300", selectedQuality === r.quality && "text-white font-bold")}>{r.quality}</AppText>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => setShowQualityModal(false)}
                className="mt-6 py-4 bg-slate-800 rounded-xl items-center"
              >
                <AppText className="text-white font-bold">Cancel</AppText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }

  if (type === 'READING' || type === 'DOCUMENT') {
    return (
      <ScrollView className="bg-white p-4 rounded-xl border border-slate-100 min-h-[300px]">
        <Markdown
          style={{
            body: { color: '#0f172a', fontSize: 16, lineHeight: 24 },
            heading1: { color: '#1e293b', marginBottom: 16 },
            link: { color: '#4f46e5' },
          }}
        >
          {content || 'This lesson has no written content.'}
        </Markdown>
      </ScrollView>
    )
  }

  return (
    <View className="p-8 items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
      <AppText color="muted">Quiz content coming soon...</AppText>
    </View>
  )
}
