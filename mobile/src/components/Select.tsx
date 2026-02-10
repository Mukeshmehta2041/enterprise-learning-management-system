import React, { useState } from 'react'
import { View, TouchableOpacity, Modal, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppText } from './AppText'
import { Ionicons } from '@expo/vector-icons'

interface Option {
  label: string
  value: string
}

interface SelectProps {
  label?: string
  value?: string
  onValueChange: (value: string) => void
  options: Option[]
  placeholder?: string
  error?: string
}

export function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  error,
}: SelectProps) {
  const [isVisible, setIsVisible] = useState(false)

  const selectedOption = options.find((o) => o.value === value)

  return (
    <View className="mb-4">
      {label && (
        <AppText variant="caption" weight="medium" className="mb-1.5 ml-1">
          {label}
        </AppText>
      )}

      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className={`flex-row items-center justify-between w-full bg-white border ${error ? 'border-red-500' : 'border-slate-200'} px-4 py-3 rounded-xl`}
      >
        <AppText color={selectedOption ? 'default' : 'muted'} className="text-base">
          {selectedOption ? selectedOption.label : placeholder}
        </AppText>
        <Ionicons name="chevron-down" size={20} color="#64748b" />
      </TouchableOpacity>

      {error && (
        <AppText color="danger" variant="small" className="mt-1 ml-1">
          {error}
        </AppText>
      )}

      <Modal visible={isVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <SafeAreaView className="bg-white rounded-t-3xl h-2/3">
            <View className="p-4 border-b border-slate-100 flex-row justify-between items-center">
              <AppText variant="h3">{label || 'Select Option'}</AppText>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueChange(item.value)
                    setIsVisible(false)
                  }}
                  className={`p-4 border-b border-slate-50 flex-row justify-between items-center ${value === item.value ? 'bg-indigo-50' : ''}`}
                >
                  <AppText className={value === item.value ? 'text-indigo-600 font-bold' : ''}>
                    {item.label}
                  </AppText>
                  {value === item.value && <Ionicons name="checkmark" size={20} color="#4f46e5" />}
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  )
}
