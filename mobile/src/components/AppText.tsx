import React, { memo } from 'react'
import { Text, TextProps } from 'react-native'

interface AppTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'small' | 'tiny'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black'
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'danger' | 'white'
  className?: string
}

export const AppText = memo(({
  variant = 'body',
  weight = 'normal',
  color = 'default',
  className = '',
  ...props
}: AppTextProps) => {
  const variantStyles = {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-semibold',
    h3: 'text-xl font-semibold',
    h4: 'text-lg font-semibold',
    body: 'text-base',
    caption: 'text-sm',
    small: 'text-xs',
    tiny: 'text-[10px]',
  }

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black',
  }

  const colorStyles = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary',
    danger: 'text-red-500',
    white: 'text-white',
  }

  const combinedClassName =
    `${variantStyles[variant]} ${weightStyles[weight]} ${colorStyles[color]} ${className}`.trim()

  // Map variants to accessibility roles
  const headerVariants = ['h1', 'h2', 'h3', 'h4']
  const accessibilityRole = headerVariants.includes(variant) ? 'header' : props.accessibilityRole

  return <Text className={combinedClassName} accessibilityRole={accessibilityRole} {...props} />
})
