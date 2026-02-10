import { useWindowDimensions } from 'react-native'

export function useDeviceType() {
  const { width } = useWindowDimensions()

  const isPhone = width < 768
  const isTablet = width >= 768
  const isLargeTablet = width >= 1024

  return {
    isPhone,
    isTablet,
    isLargeTablet,
    width,
  }
}

export function useResponsiveValue<T>(values: { phone: T; tablet?: T; desktop?: T }): T {
  const { isTablet, isLargeTablet } = useDeviceType()

  if (isLargeTablet && values.desktop !== undefined) return values.desktop
  if (isTablet && values.tablet !== undefined) return values.tablet
  return values.phone
}
