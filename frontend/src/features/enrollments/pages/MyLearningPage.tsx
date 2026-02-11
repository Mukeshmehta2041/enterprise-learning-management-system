import { useEnrollments } from '../api/useEnrollments'
import { useEffect } from 'react'
import { EnrollmentCard } from '../components/EnrollmentCard'
import { Container, Heading1, TextMuted, Heading4, Button, EmptyState } from '@/shared/ui'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, AlertCircle } from 'lucide-react'
import { useUI } from '@/shared/context/UIContext'
import type { AppError } from '@/shared/types/error'

export function MyLearningPage() {
  const { data: enrollments, isLoading, isError, error, refetch } = useEnrollments()
  const navigate = useNavigate()
  const { setBreadcrumbs } = useUI()

  useEffect(() => {
    setBreadcrumbs([{ label: 'My Learning' }])
    return () => setBreadcrumbs(null)
  }, [setBreadcrumbs])

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Heading1>My Learning</Heading1>
          <TextMuted>Track your progress across all enrolled courses</TextMuted>
        </div>
      </div>

      {isError && (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <Heading4>Failed to load enrollments</Heading4>
          <TextMuted className="mb-6">{(error as AppError)?.message || 'Please check your connection and try again'}</TextMuted>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      )}

      {!isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-xl" />
            ))
          ) : enrollments?.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                title="No enrollments yet"
                description="You haven't enrolled in any courses yet. Start your learning journey today!"
                icon={GraduationCap}
                actionLabel="Browse Catalog"
                onAction={() => navigate('/courses')}
              />
            </div>
          ) : (
            enrollments?.map((enrollment) => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))
          )}
        </div>
      )}
    </Container>
  )
}
