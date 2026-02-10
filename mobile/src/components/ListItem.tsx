import React, { memo, ReactNode } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { AppText } from './AppText'
import { Ionicons } from '@expo/vector-icons'

interface ListItemProps {
  title: string
  subtitle?: string
  leftIcon?: keyof typeof Ionicons.glyphMap
  rightIcon?: keyof typeof Ionicons.glyphMap
  rightElement?: ReactNode
  onPress?: () => void
  className?: string
  destructive?: boolean
}

export const ListItem = memo(({
  title,
  subtitle,
  leftIcon,
  rightIcon = 'chevron-forward',
  rightElement,
  onPress,
  className = '',
  destructive = false,
}: ListItemProps) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center bg-white px-4 py-4 border-b border-slate-50 active:bg-slate-50 ${className}`}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      {leftIcon && (
        <View className="mr-3 w-8 items-center">
          <Ionicons name={leftIcon} size={22} color={destructive ? '#ef4444' : '#64748b'} />
        </View>
      )}
      <View className="flex-1">
        <AppText variant="body" weight="medium" color={destructive ? 'danger' : 'default'}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="small" color="muted" className="mt-0.5">
            {subtitle}
          </AppText>
        )}
      </View>
      {rightElement
        ? rightElement
        : onPress && rightIcon && <Ionicons name={rightIcon} size={20} color="#cbd5e1" />}
    </TouchableOpacity>
  )
})
