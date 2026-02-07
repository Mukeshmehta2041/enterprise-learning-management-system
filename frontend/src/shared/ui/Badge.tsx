import * as React from 'react'
import { cn } from '@/shared/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'primary' | 'destructive'
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80',
    primary: 'border-transparent bg-primary text-white hover:bg-primary/80',
    secondary: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80',
    outline: 'text-slate-950 border-slate-200',
    success: 'border-transparent bg-emerald-100 text-emerald-700',
    warning: 'border-transparent bg-amber-100 text-amber-700',
    error: 'border-transparent bg-rose-100 text-rose-700',
    destructive: 'border-transparent bg-rose-100 text-rose-700',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
