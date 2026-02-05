import { useState } from 'react'
import { useCourses } from '../api/useCourses'
import { CourseCard } from '../components/CourseCard'
import { CourseSkeleton } from '../components/CourseSkeleton'
import { Heading1, TextMuted, Heading4 } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { Container } from '@/shared/ui/Layout'
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react'
import type { CourseFilters } from '@/shared/types/course'

export function CourseListPage() {
  const [filters, setFilters] = useState<CourseFilters>({
    page: 0,
    size: 9,
    search: '',
    category: '',
    level: '',
  })

  const [searchInput, setSearchInput] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, isError, error, refetch } = useCourses(filters)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search: searchInput, page: 0 }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleFilterChange = (key: keyof CourseFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 0 }))
  }

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Heading1>Courses</Heading1>
          <TextMuted>Explore our wide range of professional courses</TextMuted>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 min-w-[300px]">
          <Input
            placeholder="Search courses..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Search size={20} />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-slate-100' : ''}
          >
            <SlidersHorizontal size={20} />
          </Button>
        </form>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={[
              { label: 'All Categories', value: '' },
              { label: 'Programming', value: 'PROGRAMMING' },
              { label: 'Design', value: 'DESIGN' },
              { label: 'Business', value: 'BUSINESS' },
              { label: 'Marketing', value: 'MARKETING' },
            ]}
          />
          <Select
            label="Level"
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            options={[
              { label: 'All Levels', value: '' },
              { label: 'Beginner', value: 'BEGINNER' },
              { label: 'Intermediate', value: 'INTERMEDIATE' },
              { label: 'Advanced', value: 'ADVANCED' },
            ]}
          />
          <div className="flex items-end">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setFilters({ page: 0, size: 9, search: '', category: '', level: '' })
                setSearchInput('')
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <Heading4>Failed to load courses</Heading4>
          <TextMuted className="mb-6">{(error as any)?.response?.data?.message || 'An unexpected error occurred'}</TextMuted>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      )}

      {!isError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <CourseSkeleton key={i} />
              ))
            ) : data?.content.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center text-center">
                <Search size={48} className="text-slate-300 mb-4" />
                <Heading4>No courses found</Heading4>
                <TextMuted>Try adjusting your search or filters</TextMuted>
              </div>
            ) : (
              data?.content.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            )}
          </div>

          {data && data.totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={data.pageNumber === 0}
                onClick={() => handlePageChange(data.pageNumber - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center px-4 font-medium">
                Page {data.pageNumber + 1} of {data.totalPages}
              </div>
              <Button
                variant="outline"
                disabled={data.last}
                onClick={() => handlePageChange(data.pageNumber + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  )
}
