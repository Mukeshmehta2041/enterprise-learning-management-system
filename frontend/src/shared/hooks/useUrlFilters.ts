import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

/**
 * A hook to sync state with URL search parameters.
 * Useful for filters, search, and pagination.
 */
export function useUrlFilters<T extends Record<string, string | number | undefined>>(initialFilters: T) {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => {
    const currentFilters = { ...initialFilters }

    Object.keys(initialFilters).forEach((key) => {
      const value = searchParams.get(key)
      if (value !== null) {
        // Handle conversion based on initial value type
        const initialValue = initialFilters[key]
        if (typeof initialValue === 'number') {
          (currentFilters as any)[key] = Number(value)
        } else {
          (currentFilters as any)[key] = value
        }
      }
    })

    return currentFilters
  }, [searchParams, initialFilters])

  const setFilters = useCallback((newFilters: Partial<T> | ((prev: T) => T)) => {
    setSearchParams((prevSearchParams) => {
      const nextParams = new URLSearchParams(prevSearchParams)

      const updatedFilters = typeof newFilters === 'function' ? newFilters(filters) : newFilters

      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === initialFilters[key]) {
          nextParams.delete(key)
        } else {
          nextParams.set(key, String(value))
        }
      })

      // Reset cursor/page to first page whenever filters change (if applicable)
      if (nextParams.has('cursor') && !('cursor' in updatedFilters)) {
        nextParams.delete('cursor')
      }

      return nextParams
    })
  }, [filters, setSearchParams, initialFilters])

  return [filters, setFilters] as const
}
