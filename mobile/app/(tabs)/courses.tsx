import React, { useState, useMemo, useCallback } from 'react'
import { View, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { AppText } from '../../src/components/AppText'
import { Input } from '../../src/components/Input'
import { CourseListItem } from '../../src/components/CourseListItem'
import { EmptyState } from '../../src/components/EmptyState'
import { FilterModal, FilterState } from '../../src/components/FilterModal'
import { useInfiniteCourses } from '../../src/hooks/useCourses'
import { Ionicons } from '@expo/vector-icons'

export default function CoursesScreen() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    level: '',
    category: '',
    sortBy: 'createdAt,desc',
  })

  const { data, isLoading, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCourses({
      status: 'PUBLISHED',
      search,
      level: filters.level,
      // category: filters.category, // assuming backend supports this
    })

  const courses = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || []
  }, [data])

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== '' && v !== 'createdAt,desc',
  ).length

  const handleCoursePress = useCallback((id: string) => {
    router.push(`/course/${id}`)
  }, [router])

  const renderItem = useCallback(({ item }: { item: any }) => (
    <View className="px-6">
      <CourseListItem course={item} onPress={() => handleCoursePress(item.id)} />
    </View>
  ), [handleCoursePress])

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return <View className="h-10" />
    return (
      <View className="py-4">
        <ActivityIndicator color="#4f46e5" />
      </View>
    )
  }, [isFetchingNextPage])

  const renderEmpty = useCallback(() => (
    <EmptyState
      title="No courses found"
      description={
        search
          ? `We couldn't find any courses matching "${search}"`
          : 'Our course catalog is currently empty.'
      }
      icon="search-outline"
      actionLabel={search ? 'Clear Search' : 'Refresh'}
      onAction={() => (search ? setSearch('') : refetch())}
    />
  ), [search, refetch])

  return (
    <View className="flex-1 bg-background">
      <View className="p-6 pb-2 bg-white border-b border-slate-100">
        <AppText variant="h1" className="mb-4">
          Explore Courses
        </AppText>
        <View className="flex-row gap-3">
          <Input
            placeholder="Search for courses..."
            value={search}
            onChangeText={setSearch}
            containerClassName="mb-0 flex-1"
            inputClassName="h-12 border-slate-100 bg-slate-50"
            clearButtonMode="while-editing"
          />
          <TouchableOpacity
            onPress={() => setIsFilterVisible(true)}
            className={`w-12 h-12 rounded-xl border border-slate-100 items-center justify-center ${activeFiltersCount > 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50'}`}
          >
            <Ionicons
              name="filter"
              size={20}
              color={activeFiltersCount > 0 ? '#4f46e5' : '#64748b'}
            />
            {activeFiltersCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-indigo-600 w-5 h-5 rounded-full items-center justify-center border-2 border-white">
                <AppText className="text-[10px] text-white font-bold">{activeFiltersCount}</AppText>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && !data ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingVertical: 24 }}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}

      <FilterModal
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        filters={filters}
        onApply={setFilters}
        onClear={() => setFilters({ level: '', category: '', sortBy: 'createdAt,desc' })}
      />
    </View>
  )
}
