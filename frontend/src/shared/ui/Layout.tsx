import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  footer?: ReactNode
}

export function Card({ children, className, title, description, footer }: CardProps) {
  return (
    <div className={cn('bg-white border border-slate-200 rounded-lg shadow-sm', className)}>
      {(title || description) && (
        <div className="p-6 border-b border-slate-100">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="p-6 border-t border-slate-100 bg-slate-50/50">{footer}</div>}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8', className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="text-slate-500 text-sm">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-[1600px]',
    xl: 'max-w-[1800px]',
    full: 'max-w-full',
  }

  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8 w-full', sizes[size], className)}>
      {children}
    </div>
  )
}
