import { useEnrollments } from '../api/useEnrollments'
import { useEffect, useMemo } from 'react'
import { EnrollmentCard } from '../components/EnrollmentCard'
import { Container, Heading1, TextMuted, Heading4, Button, EmptyState } from '@/shared/ui'
import { useNavigate, Link } from 'react-router-dom'
import { GraduationCap, AlertCircle, PlayCircle } from 'lucide-react'
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

  const lastEnrollment = useMemo(() => {
    if (!enrollments || enrollments.length === 0) return null
    return [...enrollments].sort((a, b) =>
      new Date(b.lastAccessedAt || b.enrolledAt).getTime() -
      new Date(a.lastAccessedAt || a.enrolledAt).getTime()
    )[0]
  }, [enrollments])

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Heading1>My Learning</Heading1>
          <TextMuted>Track your progress across all enrolled courses</TextMuted>
        </div>
      </div>

      {lastEnrollment && (
        <div className="mb-12 p-6 rounded-2xl bg-slate-900 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="h-32 w-48 rounded-lg bg-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-700">
              {lastEnrollment.courseThumbnailUrl ? (
                <img src={lastEnrollment.courseThumbnailUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <PlayCircle size={48} className="text-slate-700" />
              )}
            </div>
            <div className="flex-grow text-center md:text-left">
              <span className="inline-block px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                Continue Watching
              </span>
              <Heading4 className="text-white mb-2">{lastEnrollment.courseTitle}</Heading4>
              <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                <div className="h-2 w-48 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${lastEnrollment.progressPct || 0}%` }}
                  />
                </div>
                <span className="text-sm text-slate-400 font-medium">
                  {Math.round(lastEnrollment.progressPct || 0)}% Complete
                </span>
              </div>
              <Button

                className="shadow-lg shadow-primary/25"
              >
                <Link to={lastEnrollment.lastLessonId
                  ? `/courses/${lastEnrollment.courseId}/lesson/${lastEnrollment.lastLessonId}`
                  : `/courses/${lastEnrollment.courseId}`
                }>
                  <PlayCircle size={18} className="mr-2" />
                  Resume Lesson
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

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
