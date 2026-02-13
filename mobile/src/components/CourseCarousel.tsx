import React from 'react'
import { FlatList, View, ActivityIndicator } from 'react-native'
import { AppText } from './AppText'
import { CourseCard } from './CourseCard'
import { Course } from '../types'
import { useRouter } from 'expo-router'

interface CourseCarouselProps {
  title: string
  courses: Course[] | undefined
  isLoading: boolean
}

export const CourseCarousel = ({ title, courses, isLoading }: CourseCarouselProps) => {
  const router = useRouter()

  if (isLoading) {
    return (
      <View className="py-8 items-center">
        <ActivityIndicator color="#4f46e5" />
      </View>
    )
  }

  if (!courses || courses.length === 0) {
    return null
  }

  return (
    <View className="mb-8">
      <View className="px-4 flex-row justify-between items-end mb-4">
        <AppText variant="h2">{title}</AppText>
        <AppText
          variant="small"
          color="primary"
          weight="bold"
          onPress={() => router.push('/(tabs)/courses')}
        >
          See All
        </AppText>
      </View>
      <FlatList
        data={courses}
        renderItem={({ item, index }) => (
          <CourseCard
            course={item}
            index={index}
            onPress={() => router.push(`/course/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  )
}
