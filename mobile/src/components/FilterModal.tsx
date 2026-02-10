import React from 'react'
import { View, Modal, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppText } from './AppText'
import { Button } from './Button'
import { Select } from './Select'
import { Ionicons } from '@expo/vector-icons'

export interface FilterState {
  level: string
  category: string
  sortBy: string
}

interface FilterModalProps {
  isVisible: boolean
  onClose: () => void
  filters: FilterState
  onApply: (filters: FilterState) => void
  onClear: () => void
}

export function FilterModal({
  isVisible,
  onClose,
  filters: initialFilters,
  onApply,
  onClear,
}: FilterModalProps) {
  const [filters, setFilters] = React.useState<FilterState>(initialFilters)

  const levels = [
    { label: 'All Levels', value: '' },
    { label: 'Beginner', value: 'BEGINNER' },
    { label: 'Intermediate', value: 'INTERMEDIATE' },
    { label: 'Advanced', value: 'ADVANCED' },
  ]

  const categories = [
    { label: 'All Categories', value: '' },
    { label: 'Programming', value: 'PROGRAMMING' },
    { label: 'Design', value: 'DESIGN' },
    { label: 'Business', value: 'BUSINESS' },
    { label: 'Marketing', value: 'MARKETING' },
  ]

  const sortOptions = [
    { label: 'Newest', value: 'createdAt,desc' },
    { label: 'Oldest', value: 'createdAt,asc' },
    { label: 'Price: Low to High', value: 'price,asc' },
    { label: 'Price: High to Low', value: 'price,desc' },
    { label: 'Popularity', value: 'enrollmentCount,desc' },
  ]

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <SafeAreaView className="bg-white rounded-t-3xl h-[80%]">
          <View className="p-4 border-b border-slate-100 flex-row justify-between items-center">
            <AppText variant="h3">Filters</AppText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-6">
            <Select
              label="Course Level"
              value={filters.level}
              onValueChange={(val) => setFilters({ ...filters, level: val })}
              options={levels}
            />

            <Select
              label="Category"
              value={filters.category}
              onValueChange={(val) => setFilters({ ...filters, category: val })}
              options={categories}
            />

            <Select
              label="Sort By"
              value={filters.sortBy}
              onValueChange={(val) => setFilters({ ...filters, sortBy: val })}
              options={sortOptions}
            />
          </ScrollView>

          <View className="p-6 border-t border-slate-100 flex-row gap-4">
            <Button
              title="Clear All"
              variant="outline"
              className="flex-1"
              onPress={() => {
                onClear()
                onClose()
              }}
            />
            <Button
              title="Apply Filters"
              className="flex-2"
              onPress={() => {
                onApply(filters)
                onClose()
              }}
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}
