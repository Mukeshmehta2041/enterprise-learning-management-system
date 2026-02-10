import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator, GestureResponderEvent } from 'react-native'
import { AppText } from './AppText'
import * as Haptics from 'expo-haptics'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  className?: string
  textClassName?: string
  haptic?: Haptics.ImpactFeedbackStyle
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  textClassName = '',
  haptic = Haptics.ImpactFeedbackStyle.Light,
  onPress,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'bg-transparent border border-primary',
    ghost: 'bg-transparent',
    danger: 'bg-red-500',
  }

  const handlePress = (event: GestureResponderEvent) => {
    if (haptic) {
      Haptics.impactAsync(haptic)
    }
    onPress?.(event)
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 rounded-md',
    md: 'px-4 py-2.5 rounded-lg',
    lg: 'px-6 py-4 rounded-xl',
  }

  const textVariantStyles = {
    primary: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    outline: 'text-primary',
    ghost: 'text-primary',
    danger: 'text-white',
  }

  const textSizeStyles = {
    sm: 'small',
    md: 'body',
    lg: 'h3',
  } as const

  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${isDisabled ? 'opacity-50' : 'active:opacity-80'} ${className}`}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={props.accessibilityLabel || title}
      onPress={handlePress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? '#4f46e5' : '#ffffff'}
          size="small"
        />
      ) : (
        <AppText
          variant={textSizeStyles[size]}
          weight="semibold"
          className={`${textVariantStyles[variant]} ${textClassName}`}
        >
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  )
}
