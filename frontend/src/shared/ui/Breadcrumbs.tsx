import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const location = useLocation()

  // Auto-generate items if not provided
  const breadcrumbItems = items || location.pathname
    .split('/')
    .filter(Boolean)
    .map((path, index, array) => {
      const href = `/${array.slice(0, index + 1).join('/')}`
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
      return { label, href }
    })

  return (
    <nav className={cn('flex items-center text-sm font-medium text-slate-500 mb-4', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/"
            className="flex items-center hover:text-indigo-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {breadcrumbItems.map((item, index) => (
          <li key={item.href || index} className="flex items-center">
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-400 mx-1" />
            {item.href ? (
              <Link
                to={item.href}
                className={cn(
                  'hover:text-indigo-600 transition-colors',
                  index === breadcrumbItems.length - 1 ? 'text-indigo-600 font-semibold pointer-events-none' : ''
                )}
                aria-current={index === breadcrumbItems.length - 1 ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  index === breadcrumbItems.length - 1 ? 'text-indigo-600 font-semibold' : ''
                )}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
