import React from 'react'
import { View, ScrollView } from 'react-native'
import { Stack } from 'expo-router'
import { AppText } from '../../src/components/AppText'
import { ListItem } from '../../src/components/ListItem'
import { useTheme } from '../../src/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'

export default function AppearanceScreen() {
  const { themeMode, setThemeMode } = useTheme()

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Appearance', headerShown: true }} />

      <View className="mt-6">
        <AppText variant="caption" weight="semibold" color="muted" className="px-6 mb-2 uppercase">
          Theme Mode
        </AppText>
        <ListItem
          title="Light"
          leftIcon="sunny-outline"
          rightElement={
            themeMode === 'light' ? <Ionicons name="checkmark" size={24} color="#4f46e5" /> : null
          }
          onPress={() => setThemeMode('light')}
        />
        <ListItem
          title="Dark"
          leftIcon="moon-outline"
          rightElement={
            themeMode === 'dark' ? <Ionicons name="checkmark" size={24} color="#4f46e5" /> : null
          }
          onPress={() => setThemeMode('dark')}
        />
        <ListItem
          title="System"
          leftIcon="settings-outline"
          subtitle="Use device settings"
          rightElement={
            themeMode === 'system' ? <Ionicons name="checkmark" size={24} color="#4f46e5" /> : null
          }
          onPress={() => setThemeMode('system')}
        />
      </View>

      <View className="p-6">
        <AppText color="muted" variant="small">
          Selecting 'System' will automatically switch the app's appearance based on your device's
          display settings.
        </AppText>
      </View>
    </ScrollView>
  )
}
