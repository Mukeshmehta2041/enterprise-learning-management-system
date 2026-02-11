import { X } from 'lucide-react'
import { Badge } from './Badge'
import { Button } from './Button'
import { cn } from '@/shared/utils/cn'

interface FilterOption {
  key: string
  label: string
  value: string
  displayValue: string
}

interface FilterChipsProps {
  filters: FilterOption[]
  onRemove: (key: string) => void
  onClearAll: () => void
  className?: string
}

export function FilterChips({
  filters,
  onRemove,
  onClearAll,
  className,
}: FilterChipsProps) {
  if (filters.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm font-medium text-slate-500 mr-2">Filters:</span>
      {filters.map((filter) => (
        <Badge
          key={`${filter.key}-${filter.value}`}
          variant="secondary"
          className="pl-3 pr-1 py-1 gap-1 border-slate-200 bg-slate-100 text-slate-700"
        >
          <span>
            <span className="font-semibold">{filter.label}:</span>{' '}
            {filter.displayValue}
          </span>
          <button
            onClick={() => onRemove(filter.key)}
            className="p-0.5 hover:bg-slate-200 rounded-full transition-colors"
            aria-label={`Remove filter for ${filter.label}`}
          >
            <X size={14} />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-primary hover:text-primary/80 hover:bg-primary/5 font-medium px-2 h-7"
      >
        Clear all
      </Button>
    </div>
  )
}

interface FilterGroupProps {
  options: { label: string; value: string }[]
  selected: string
  onSelect: (value: string) => void
  className?: string
}

export function FilterGroup({ options, selected, onSelect, className }: FilterGroupProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-full transition-colors',
            selected === option.value
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
