import { useState, useEffect, type ChangeEvent } from 'react'
import {
  useCourses,
  useFeaturedCourses,
  useTrendingCourses,
} from '../api/useCourses'
import { CourseCard } from '../components/CourseCard'
import { CourseSkeleton } from '../components/CourseSkeleton'
import { useUI } from '@/shared/context/UIContext'
import {
  Heading1,
  Heading2,
  TextMuted,
  Heading4,
  Button,
  Select,
  Input,
  Container,
  SearchInput,
  FilterChips,
  Pagination,
  FilterGroup,
} from '@/shared/ui'
import {
  SlidersHorizontal,
  AlertCircle,
  Plus,
  Sparkles,
  TrendingUp,
  Tag,
} from 'lucide-react'
import type { CourseFilters } from '@/shared/types/course'
import { useUrlFilters } from '@/shared/hooks/useUrlFilters'
import { useAccess } from '@/shared/hooks/useAccess'
import { useNavigate } from 'react-router-dom'
import type { AppError } from '@/shared/types/error'

const INITIAL_FILTERS: CourseFilters = {
  page: 1,
  limit: 9,
  search: '',
  category: '',
  level: '',
  tags: '',
  sort: 'createdAt',
  order: 'desc',
  isFeatured: undefined,
  isTrending: undefined,
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

const POPULAR_TAGS = [
  'React',
  'Spring Boot',
  'UI/UX',
  'Data Science',
  'DevOps',
  'Productivity',
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

  const { data, isLoading, isError, error, refetch } =
    useCourses(filters)
  const { data: featuredData } = useFeaturedCourses()
  const { data: trendingData } = useTrendingCourses()

  const isBrowsingAll =
    !filters.search &&
    !filters.category &&
    !filters.level &&
    filters.page === 1

  const handleFilterChange = (
    key: keyof CourseFilters,
    value: unknown
  ) => {
    const patch: Partial<CourseFilters> = {
      [key]: value as CourseFilters[keyof CourseFilters],
    }
    if (key !== 'page') patch.page = 1
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
            CATEGORY_OPTIONS.find(
              (o) => o.value === filters.category
            )?.label || filters.category,
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
            LEVEL_OPTIONS.find(
              (o) => o.value === filters.level
            )?.label || filters.level,
        },
      ]
      : []),
    ...(filters.tags
      ? [
        {
          key: 'tags',
          label: 'Tags',
          value: filters.tags,
          displayValue: filters.tags,
        },
      ]
      : []),
    ...(filters.isFeatured
      ? [
        {
          key: 'isFeatured',
          label: 'Featured',
          value: 'true',
          displayValue: 'Yes',
        },
      ]
      : []),
    ...(filters.isTrending
      ? [
        {
          key: 'isTrending',
          label: 'Trending',
          value: 'true',
          displayValue: 'Yes',
        },
      ]
      : []),
  ]

  return (
    <Container>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Heading1>Courses</Heading1>
          <TextMuted>
            Explore our wide range of professional courses
          </TextMuted>
        </div>

        {hasRole(['INSTRUCTOR', 'ADMIN']) && (
          <Button
            onClick={() =>
              navigate('/instructor/courses/new')
            }
            className="gap-2"
          >
            <Plus size={20} />
            Create New Course
          </Button>
        )}
      </div>

      {/* Featured + Trending */}
      {isBrowsingAll && (
        <div className="space-y-12 mb-12">
          {(featuredData?.content?.length ?? 0) > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles
                  className="text-amber-500"
                  size={24}
                />
                <Heading2>Featured Courses</Heading2>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4">
                {featuredData?.content?.map((course) => (
                  <div
                    key={course.id}
                    className="min-w-[300px] max-w-[300px]"
                  >
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {(trendingData?.content?.length ?? 0) > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp
                  className="text-blue-500"
                  size={24}
                />
                <Heading2>Trending Now</Heading2>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4">
                {trendingData?.content?.map((course) => (
                  <div
                    key={course.id}
                    className="min-w-[300px] max-w-[300px]"
                  >
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex-grow max-w-md">
          <SearchInput
            value={filters.search || ''}
            onChange={(val) =>
              handleFilterChange('search', val)
            }
            placeholder="Search courses..."
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={`${filters.sort}-${filters.order}`}
            onChange={(e) => {
              const [sort, order] =
                e.target.value.split('-')
              setFilters({
                sort,
                order: order as 'asc' | 'desc',
                page: 1,
              })
            }}
            options={[
              {
                label: 'Newest First',
                value: 'createdAt-desc',
              },
              {
                label: 'Oldest First',
                value: 'createdAt-asc',
              },
              {
                label: 'Price: Low to High',
                value: 'price-asc',
              },
              {
                label: 'Price: High to Low',
                value: 'price-desc',
              },
              {
                label: 'Most Popular',
                value: 'totalEnrollments-desc',
              },
            ]}
            className="w-48"
          />

          <Button
            variant="outline"
            onClick={() =>
              setShowFilters(!showFilters)
            }
          >
            <SlidersHorizontal
              size={20}
              className="mr-2"
            />
            Filters
          </Button>
        </div>
      </div>

      {/* Quick Tags */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 text-slate-500">
          <Tag size={16} />
          <span className="text-sm font-medium">Popular tags</span>
        </div>
        <FilterGroup
          options={POPULAR_TAGS.map((tag) => ({ label: tag, value: tag }))}
          selected={filters.tags || ''}
          onSelect={(value) => handleFilterChange('tags', value)}
        />
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 grid gap-6 rounded-xl border border-slate-200 bg-white p-6">
          <div>
            <Heading4 className="mb-2">Level</Heading4>
            <FilterGroup
              options={LEVEL_OPTIONS}
              selected={filters.level || ''}
              onSelect={(value) => handleFilterChange('level', value)}
            />
          </div>

          <div>
            <Heading4 className="mb-2">Category</Heading4>
            <FilterGroup
              options={CATEGORY_OPTIONS}
              selected={filters.category || ''}
              onSelect={(value) => handleFilterChange('category', value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Heading4 className="mb-2">Tags</Heading4>
              <Input
                value={filters.tags || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFilterChange('tags', e.target.value)
                }
                placeholder="e.g. React, Spring, UI"
              />
            </div>
            <div>
              <Heading4 className="mb-2">Highlights</Heading4>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold ${filters.isFeatured ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-600'}`}
                  onClick={() => handleFilterChange('isFeatured', filters.isFeatured ? undefined : true)}
                >
                  Featured
                </button>
                <button
                  type="button"
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold ${filters.isTrending ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                  onClick={() => handleFilterChange('isTrending', filters.isTrending ? undefined : true)}
                >
                  Trending
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters */}
      <FilterChips
        filters={activeFilters}
        onRemove={(key) =>
          handleFilterChange(
            key as keyof CourseFilters,
            ''
          )
        }
        onClearAll={() =>
          setFilters(INITIAL_FILTERS)
        }
        className="mb-6"
      />

      {/* Error */}
      {isError && (
        <div className="text-center py-12 text-red-500">
          <AlertCircle
            size={48}
            className="mb-4 mx-auto"
          />
          <Heading4>Failed to load courses</Heading4>
          <TextMuted>
            {(error as AppError)?.message ||
              'An unexpected error occurred'}
          </TextMuted>
          <div className="mt-4">
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Course Grid */}
      {!isError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && !data
              ? Array.from({ length: 6 }).map(
                (_, i) => (
                  <CourseSkeleton key={i} />
                )
              )
              : data?.content?.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                />
              ))}
          </div>

          {data &&
            (data.totalPages ?? 0) > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={filters.page || 1}
                  totalPages={
                    data.totalPages || 1
                  }
                  onPageChange={(page) =>
                    handleFilterChange(
                      'page',
                      page
                    )
                  }
                />
              </div>
            )}
        </>
      )}
    </Container>
  )
}
