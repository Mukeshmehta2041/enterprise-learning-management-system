import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/shared/utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const showMax = 5

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('ellipsis')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }

      if (currentPage < totalPages - 2) pages.push('ellipsis')
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }
    return pages
  }

  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft size={18} />
      </Button>

      {getPageNumbers().map((page, index) =>
        page === 'ellipsis' ? (
          <div
            key={`ellipsis-${index}`}
            className="w-10 h-10 flex items-center justify-center text-slate-400"
          >
            <MoreHorizontal size={18} />
          </div>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'outline'}
            className={cn(
              'w-10 h-10 p-0 font-medium',
              currentPage === page ? 'pointer-events-none' : ''
            )}
            onClick={() => onPageChange(page as number)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight size={18} />
      </Button>
    </nav>
  )
}
