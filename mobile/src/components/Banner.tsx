import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Animated } from 'react-native'
import { AppText } from './AppText'
import { Ionicons } from '@expo/vector-icons'

export type BannerType = 'info' | 'success' | 'warning' | 'error'

interface BannerProps {
  message: string
  type?: BannerType
  isVisible: boolean
  onHide: () => void
  autoHide?: boolean
}

export function Banner({
  message,
  type = 'info',
  isVisible,
  onHide,
  autoHide = true,
}: BannerProps) {
  const [fadeAnim] = useState(new Animated.Value(0))

  const hide = React.useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onHide())
  }, [fadeAnim, onHide])

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()

      if (autoHide) {
        const timer = setTimeout(() => {
          hide()
        }, 5000)
        return () => clearTimeout(timer)
      }
    } else {
      hide()
    }
  }, [isVisible, autoHide, fadeAnim, hide])

  if (!isVisible) return null

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          icon: 'checkmark-circle',
          iconColor: '#10b981',
        }
      case 'warning':
        return { bg: 'bg-amber-50', text: 'text-amber-800', icon: 'warning', iconColor: '#f59e0b' }
      case 'error':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-800',
          icon: 'alert-circle',
          iconColor: '#f43f5e',
        }
      default:
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-800',
          icon: 'information-circle',
          iconColor: '#3b82f6',
        }
    }
  }

  const colors = getColors()

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className={`absolute top-12 left-6 right-6 z-50 p-4 rounded-2xl border border-white/20 shadow-lg ${colors.bg}`}
    >
      <View className="flex-row items-center">
        <Ionicons name={colors.icon as any} size={24} color={colors.iconColor} />
        <View className="flex-1 ml-3 mr-2">
          <AppText variant="body" weight="medium" className={colors.text}>
            {message}
          </AppText>
        </View>
        <TouchableOpacity onPress={hide}>
          <Ionicons name="close" size={20} color={colors.iconColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}
