import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface TextProps {
  children: ReactNode
  className?: string
  id?: string
}

export function Heading1({ children, className, id }: TextProps) {
  return (
    <h1 id={id} className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900', className)}>
      {children}
    </h1>
  )
}

export function Heading2({ children, className, id }: TextProps) {
  return (
    <h2 id={id} className={cn('scroll-m-20 border-b border-slate-200 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-slate-900', className)}>
      {children}
    </h2>
  )
}

export function Heading3({ children, className, id }: TextProps) {
  return (
    <h3 id={id} className={cn('scroll-m-20 text-2xl font-semibold tracking-tight text-slate-900', className)}>
      {children}
    </h3>
  )
}

export function Heading4({ children, className, id }: TextProps) {
  return (
    <h4 id={id} className={cn('scroll-m-20 text-xl font-semibold tracking-tight text-slate-900', className)}>
      {children}
    </h4>
  )
}

export function Paragraph({ children, className }: TextProps) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6 text-slate-700', className)}>
      {children}
    </p>
  )
}

export function Lead({ children, className }: TextProps) {
  return (
    <p className={cn('text-xl text-slate-500', className)}>
      {children}
    </p>
  )
}

export function Small({ children, className }: TextProps) {
  return (
    <small className={cn('text-sm font-medium leading-none text-slate-500', className)}>
      {children}
    </small>
  )
}

export const TextSmall = Small

export function Muted({ children, className }: TextProps) {
  return (
    <p className={cn('text-sm text-slate-500', className)}>
      {children}
    </p>
  )
}

export const TextMuted = Muted
