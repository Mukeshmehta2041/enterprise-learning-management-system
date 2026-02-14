import { forwardRef, useId } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { label: string; value: string | number }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    const generatedId = useId()
    const selectId = props.id ?? generatedId
    const errorId = `${selectId}-error`
    return (
      <div className={cn('space-y-1', !className?.includes('w-') && 'w-full')}>
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'flex h-10 w-full rounded-md border border-slate-300 bg-white pl-3 pr-8 py-2 text-sm ring-offset-white appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:border-slate-400 cursor-pointer',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 group-hover:text-slate-600 transition-colors">
            <ChevronDown size={className?.includes('h-8') ? 14 : 16} strokeWidth={2.5} />
          </div>
        </div>
        {error && <p id={errorId} className="text-[10px] text-red-500 mt-0.5">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
