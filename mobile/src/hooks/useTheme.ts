import { useColorScheme } from 'nativewind'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'

type ThemeMode = 'light' | 'dark' | 'system'

export function useTheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme()
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')

  useEffect(() => {
    async function loadTheme() {
      const savedTheme = (await SecureStore.getItemAsync('theme_mode')) as ThemeMode
      if (savedTheme) {
        setThemeMode(savedTheme)
        if (savedTheme !== 'system') {
          setColorScheme(savedTheme)
        }
      }
    }
    loadTheme()
  }, [])

  const updateThemeMode = async (mode: ThemeMode) => {
    setThemeMode(mode)
    await SecureStore.setItemAsync('theme_mode', mode)
    if (mode === 'system') {
      // In NativeWind, "system" is handled by the provider
      setColorScheme('system')
    } else {
      setColorScheme(mode)
    }
  }

  return {
    colorScheme, // 'light' or 'dark'
    themeMode, // 'light', 'dark', or 'system'
    setThemeMode: updateThemeMode,
    toggleColorScheme,
    isDark: colorScheme === 'dark',
  }
}
