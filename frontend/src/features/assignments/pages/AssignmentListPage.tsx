import { useAssignments } from '../api/useAssignments'
import { useEffect } from 'react'
import { Container, Card } from '@/shared/ui/Layout'
import { Heading1, Heading3, TextMuted, Small } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { Link } from 'react-router-dom'
import { FileText, Calendar, ChevronRight, AlertCircle } from 'lucide-react'
import { useUI } from '@/shared/context/UIContext'

export function AssignmentListPage() {
  const { data: assignments, isLoading, isError, error, refetch } = useAssignments()
  const { setBreadcrumbs } = useUI()

  useEffect(() => {
    setBreadcrumbs([{ label: 'Assignments' }])
    return () => setBreadcrumbs(null)
  }, [setBreadcrumbs])

  const isOverdue = (dueDate: string | null | undefined) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <Heading1>Assignments</Heading1>
        <TextMuted>Stay on top of your coursework and deadlines</TextMuted>
      </div>

      {isError && (
        <Card className="p-8 text-center border-dashed border-red-200 bg-red-50">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <Heading3 className="text-red-900">Failed to load assignments</Heading3>
          <TextMuted className="mb-6">{(error as any)?.response?.data?.message || 'Please check your connection'}</TextMuted>
          <Button onClick={() => refetch()}>Try Again</Button>
        </Card>
      )}

      {!isError && (
        <div className="grid gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-lg" />
            ))
          ) : assignments?.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-slate-200">
              <FileText size={48} className="text-slate-200 mx-auto mb-4" />
              <Heading3>All caught up!</Heading3>
              <TextMuted>No pending assignments at this time.</TextMuted>
            </div>
          ) : (
            assignments?.map((assignment) => (
              <Link
                key={assignment.id}
                to={`/assignments/${assignment.id}`}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg"
              >
                <Card className="p-4 hover:border-blue-300 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${isOverdue(assignment.dueDate) ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                      }`}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <Heading3 className="text-lg group-hover:text-blue-600 transition-colors">
                        {assignment.title}
                      </Heading3>
                      <div className="flex items-center gap-3 mt-1">
                        <Small className="text-slate-500 font-medium">{assignment.courseTitle}</Small>
                        <span className="text-slate-300">•</span>
                        <div className={`flex items-center gap-1 text-xs ${isOverdue(assignment.dueDate) ? 'text-red-600' : 'text-slate-500'
                          }`}>
                          <Calendar size={12} />
                          <span>Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No deadline'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                      <div className="text-sm font-bold text-slate-700">{assignment.maxPoints} pts</div>
                      <Small className="text-slate-400">Maximum Grade</Small>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </Container>
  )
}
