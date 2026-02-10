import React from 'react'
import { View, ViewProps } from 'react-native'

interface CardProps extends ViewProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <View
      className={`bg-card rounded-2xl p-4 shadow-sm border border-slate-100 ${className}`}
      {...props}
    >
      {children}
    </View>
  )
}
