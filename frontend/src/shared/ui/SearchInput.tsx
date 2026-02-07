import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from './Input'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/utils/cn'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (value: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  className,
  debounceMs = 500,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounce(localValue, debounceMs)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
      onSearch?.(debouncedValue)
    }
  }, [debouncedValue, onChange, onSearch, value])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
    onSearch?.('')
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 text-slate-400" size={18} />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-10 pr-10 h-10"
        placeholder={placeholder}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}
