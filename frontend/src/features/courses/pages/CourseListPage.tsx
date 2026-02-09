import { useState, useEffect } from 'react'
import { useCourses } from '../api/useCourses'
import { CourseCard } from '../components/CourseCard'
import { CourseSkeleton } from '../components/CourseSkeleton'
import { useUI } from '@/shared/context/UIContext'
import {
  Heading1,
  TextMuted,
  Heading4,
  Button,
  Select,
  Container,
  EmptyState,
  SearchInput,
  FilterChips,
  Pagination,
} from '@/shared/ui'
import { SlidersHorizontal, AlertCircle, Plus } from 'lucide-react'
import type { CourseFilters } from '@/shared/types/course'
import { useUrlFilters } from '@/shared/hooks/useUrlFilters'
import { useAccess } from '@/shared/hooks/useAccess'
import { useNavigate } from 'react-router-dom'

const INITIAL_FILTERS: CourseFilters = {
  page: 1,
  limit: 9,
  search: '',
  category: '',
  level: '',
  sort: 'createdAt',
  order: 'desc',
}

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: '' },
  { label: 'Programming', value: 'PROGRAMMING' },
  { label: 'Design', value: 'DESIGN' },
  { label: 'Business', value: 'BUSINESS' },
  { label: 'Marketing', value: 'MARKETING' },
]

const LEVEL_OPTIONS = [
  { label: 'All Levels', value: '' },
  { label: 'Beginner', value: 'BEGINNER' },
  { label: 'Intermediate', value: 'INTERMEDIATE' },
  { label: 'Advanced', value: 'ADVANCED' },
]

export function CourseListPage() {
  const [filters, setFilters] = useUrlFilters(INITIAL_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const { hasRole } = useAccess()
  const navigate = useNavigate()
  const { setBreadcrumbs } = useUI()

  useEffect(() => {
    setBreadcrumbs([{ label: 'Courses' }])
    return () => setBreadcrumbs(null)
  }, [setBreadcrumbs])

  const { data, isLoading, isError, error, refetch } = useCourses(filters)

  const handleFilterChange = (key: keyof CourseFilters, value: any) => {
    // Reset page to 1 on any filter change except page itself
    const patch: Partial<CourseFilters> = { [key]: value }
    if (key !== 'page') patch.page = 1
    // @ts-ignore - setFilters type handling
    setFilters(patch)
  }

  const activeFilters = [
    ...(filters.category
      ? [
        {
          key: 'category',
          label: 'Category',
          value: filters.category,
          displayValue:
            CATEGORY_OPTIONS.find((o) => o.value === filters.category)?.label ||
            filters.category,
        },
      ]
      : []),
    ...(filters.level
      ? [
        {
          key: 'level',
          label: 'Level',
          value: filters.level,
          displayValue:
            LEVEL_OPTIONS.find((o) => o.value === filters.level)?.label ||
            filters.level,
        },
      ]
      : []),
  ]

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Heading1>Courses</Heading1>
          <TextMuted>Explore our wide range of professional courses</TextMuted>
        </div>
        {hasRole(['INSTRUCTOR', 'ADMIN']) && (
          <Button
            onClick={() => navigate('/instructor/courses/new')}
            className="gap-2 self-start md:self-center"
          >
            <Plus size={20} />
            Create New Course
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex-grow max-w-md">
          <SearchInput
            value={filters.search || ''}
            onChange={(val) => handleFilterChange('search', val)}
            placeholder="Search courses..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={`${filters.sort}-${filters.order}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-')
              // @ts-ignore
              setFilters({ sort, order: order as 'asc' | 'desc', page: 1 })
            }}
            options={[
              { label: 'Newest First', value: 'createdAt-desc' },
              { label: 'Oldest First', value: 'createdAt-asc' },
              { label: 'Price: Low to High', value: 'price-asc' },
              { label: 'Price: High to Low', value: 'price-desc' },
              { label: 'Most Popular', value: 'totalEnrollments-desc' },
            ]}
            className="w-48"
          />
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-slate-100' : ''}
          >
            <SlidersHorizontal size={20} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <FilterChips
        filters={activeFilters}
        onRemove={(key) => handleFilterChange(key as keyof CourseFilters, '')}
        onClearAll={() => {
          // @ts-ignore
          setFilters({
            category: '',
            level: '',
            search: '',
            page: 1,
          })
        }}
        className="mb-6"
      />

      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={CATEGORY_OPTIONS}
          />
          <Select
            label="Level"
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            options={LEVEL_OPTIONS}
          />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-12 text-center text-red-500">
          <AlertCircle size={48} className="mb-4" />
          <Heading4>Failed to load courses</Heading4>
          <TextMuted className="mb-6">
            {(error as any)?.response?.data?.message ||
              'An unexpected error occurred'}
          </TextMuted>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      )}

      {!isError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {isLoading && !data
              ? Array.from({ length: 6 }).map((_, i) => (
                <CourseSkeleton key={i} />
              ))
              : data?.content?.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            {!isLoading && (!data?.content || data.content.length === 0) && (
              <div className="col-span-full">
                <EmptyState
                  title="No courses found"
                  description="Try adjusting your search or filters to find what you're looking for."
                  icon={AlertCircle}
                  actionLabel="Reset Filters"
                  onAction={() => {
                    // @ts-ignore
                    setFilters(INITIAL_FILTERS)
                  }}
                />
              </div>
            )}
          </div>

          {data && (data.totalPages ?? 0) > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={filters.page || 1}
                totalPages={data.totalPages || 1}
                onPageChange={(page) => handleFilterChange('page', page)}
              />
            </div>
          )}
        </>
      )}
    </Container>
  )
}
