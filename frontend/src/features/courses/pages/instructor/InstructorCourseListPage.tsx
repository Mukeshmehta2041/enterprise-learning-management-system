import { useState } from 'react'
import { Plus, SlidersHorizontal, Edit, Eye, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Heading1,
  TextMuted,
  Button,
  Container,
  SearchInput,
  FilterChips,
  Pagination,
  Badge,
  IconButton,
  Select,
} from '@/shared/ui'
import { useUrlFilters } from '@/shared/hooks/useUrlFilters'
import { useCourses } from '../../api/useCourses'
import { type CourseFilters } from '@/shared/types/course'
import { format } from 'date-fns'

const INITIAL_FILTERS: CourseFilters = {
  page: 1,
  limit: 10,
  search: '',
  status: '',
  sort: 'createdAt',
  order: 'desc',
}

export function InstructorCourseListPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useUrlFilters(INITIAL_FILTERS)
  const [showFilters, setShowFilters] = useState(false)

  // In a real app, we would use a specific hook for instructor courses
  // that automatically filters by instructorId on the backend.
  const { data, isLoading } = useCourses(filters)

  const handleFilterChange = (key: keyof CourseFilters, value: any) => {
    const patch: Partial<CourseFilters> = { [key]: value }
    if (key !== 'page') patch.page = 1
    // @ts-ignore
    setFilters(patch)
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success'
      case 'DRAFT':
        return 'secondary'
      case 'ARCHIVED':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Heading1>My Courses</Heading1>
          <TextMuted>Manage and author your courses here</TextMuted>
        </div>
        <Button onClick={() => navigate('/instructor/courses/new')} className="gap-2">
          <Plus size={20} />
          Create New Course
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex-grow max-w-md">
          <SearchInput
            value={filters.search || ''}
            onChange={(val) => handleFilterChange('search', val)}
            placeholder="Search your courses..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={`${filters.sort}-${filters.order}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-')
              // @ts-ignore
              setFilters({ sort, order, page: 1 })
            }}
            options={[
              { label: 'Newest First', value: 'createdAt-desc' },
              { label: 'Oldest First', value: 'createdAt-asc' },
              { label: 'Title: A-Z', value: 'title-asc' },
              { label: 'Enrollments: High to Low', value: 'totalEnrollments-desc' },
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

      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-slate-200 mb-6 flex gap-4">
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Published', value: 'PUBLISHED' },
              { label: 'Archived', value: 'ARCHIVED' },
            ]}
            className="w-48"
          />
        </div>
      )}

      <FilterChips
        filters={
          filters.status
            ? [
              {
                key: 'status',
                label: 'Status',
                value: filters.status,
                displayValue: filters.status,
              },
            ]
            : []
        }
        onRemove={() => handleFilterChange('status', '')}
        onClearAll={() => setFilters({ status: '', search: '', page: 1 })}
        className="mb-6"
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-bottom border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Course</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Enrollments</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Last Updated</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : !data?.content || data.content.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No courses found matching your criteria.
                  </td>
                </tr>
              ) : (
                data.content.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-900">{course.title}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(course.status)}>
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{course.totalEnrollments}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {format(new Date(course.updatedAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <IconButton
                          variant="ghost"
                          onClick={() => navigate(`/courses/${course.id}`)}
                          title="View Course"
                          aria-label={`View ${course.title}`}
                        >
                          <Eye size={18} />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
                          title="Edit Course"
                          aria-label={`Edit ${course.title}`}
                        >
                          <Edit size={18} />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          className="text-red-500 hover:text-red-600"
                          title="Delete"
                          aria-label={`Delete ${course.title}`}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex justify-center">
            <Pagination
              currentPage={filters.page || 1}
              totalPages={data.totalPages}
              onPageChange={(page) => handleFilterChange('page', page)}
            />
          </div>
        )}
      </div>
    </Container>
  )
}
