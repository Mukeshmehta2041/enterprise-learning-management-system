import React, { memo } from 'react'
import { TouchableOpacity, View, Image, Dimensions } from 'react-native'
import { AppText } from './AppText'
import { Ionicons } from '@expo/vector-icons'
import Animated, { FadeInRight } from 'react-native-reanimated'
import { Course } from '../types'

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.75

interface CourseCardProps {
  course: Course
  onPress: () => void
  index: number
}

export const CourseCard = memo(({ course, onPress, index }: CourseCardProps) => {
  const instructorName = course.instructorName || 'Multiple Instructors'

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(400)}
      style={{ width: CARD_WIDTH }}
      className="mr-4"
    >
      <TouchableOpacity
        className="bg-card rounded-2xl overflow-hidden shadow-sm border border-slate-100"
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View className="h-40 bg-slate-200">
          {course.thumbnailUrl ? (
            <Image
              source={{ uri: course.thumbnailUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Ionicons name="school-outline" size={48} color="#94a3b8" />
            </View>
          )}
          {course.isFeatured && (
            <View className="absolute top-2 left-2 bg-primary px-2 py-1 rounded-full">
              <AppText variant="tiny" color="white" weight="bold">FEATURED</AppText>
            </View>
          )}
        </View>
        <View className="p-4">
          <AppText variant="h4" numberOfLines={1} className="mb-1">
            {course.title}
          </AppText>
          <AppText variant="small" color="muted" className="mb-2">
            by {instructorName}
          </AppText>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="star" size={12} color="#f59e0b" />
              <AppText variant="small" className="ml-1 font-medium">
                {course.rating || 4.5}
              </AppText>
            </View>
            <AppText variant="small" weight="bold" color="primary">
              ${course.price || 'Free'}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
})
