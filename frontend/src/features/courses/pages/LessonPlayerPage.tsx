import { Paragraph, Heading2, Heading3 } from '@/shared/ui/Typography'
import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourse } from '../api/useCourses'
import { useLessonContent } from '../api/useContent'
import { useLessonAssignments, useSubmitAssignment, useSubmission } from '@/features/assignments/api/useAssignments'
import { useEnrollment, useUpdateProgress } from '@/features/enrollments/api/useEnrollments'
import { Button } from '@/shared/ui/Button'
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Lock,
  Trophy,
  FileText,
  Send,
  Calendar
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useAccess } from '@/shared/hooks/useAccess'
import { QuizPlayer } from '../components/QuizPlayer'
import { VideoPlayer } from '../components/VideoPlayer'
import { Card, Badge, Input } from '@/shared/ui'
import type { Module, Lesson } from '@/shared/types/course'
import type { Assignment } from '@/shared/types/assignment'

export function LessonPlayerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const { hasRole } = useAccess()

  const { data: course, isLoading: isCourseLoading, isError } = useCourse(courseId!)
  const { data: enrollment, isLoading: isEnrollmentLoading } = useEnrollment(courseId!)
  const { data: contentData, isLoading: isContentLoading } = useLessonContent(lessonId)
  const { data: assignments } = useLessonAssignments(lessonId!)

  const updateProgress = useUpdateProgress(courseId!)

  const [isSidebarOpen] = useState(true)
  const [hasDismissedCompletion, setHasDismissedCompletion] = useState(false)

  const isStaff = hasRole(['INSTRUCTOR', 'ADMIN'])

  /* ---------------------------------- Lessons ---------------------------------- */

  const allLessons = useMemo(() => {
    if (!course?.modules) return []

    return [...course.modules]
      .sort((a: Module, b: Module) => a.order - b.order)
      .flatMap((m: Module) =>
        [...m.lessons].sort((a: Lesson, b: Lesson) => a.order - b.order)
      )
  }, [course])

  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId)
  const currentLesson = currentLessonIndex >= 0 ? allLessons[currentLessonIndex] : undefined
  const nextLesson = allLessons[currentLessonIndex + 1]
  const prevLesson = allLessons[currentLessonIndex - 1]

  /* ---------------------------------- Derived State ---------------------------------- */

  const showCompletionOverlay = !hasDismissedCompletion && enrollment?.status === 'COMPLETED'
  const completedLessonIds = enrollment?.completedLessonIds ?? []

  const isCompleted = lessonId ? completedLessonIds.includes(lessonId) : false

  const isAvailable =
    !currentLesson?.availableAt ||
    new Date(currentLesson.availableAt) <= new Date()

  const isEnrollmentRevoked =
    !isStaff && ['DROPPED', 'CANCELLED'].includes(enrollment?.status ?? '')

  const isCourseUnavailable =
    !isStaff && !!course?.status && course.status !== 'PUBLISHED'

  const [sessionIntentId] = useState(() =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `session-${Math.random().toString(36).substring(2, 9)}`
  )

  const canWatch = currentLesson?.canWatch ?? Boolean(course?.hasAccess || currentLesson?.isPreview)
  const isPaymentPending = enrollment?.status === 'PENDING_PAYMENT'

  const checkoutPath = useMemo(() => {
    if (!course || !isPaymentPending) return null
    const query = new URLSearchParams({
      courseId: course.id,
      courseName: course.title,
      price: course.price.toFixed(2),
      currency: course.currency || 'USD',
    })
    return `/payments/checkout/${sessionIntentId}?${query.toString()}`
  }, [course, isPaymentPending, sessionIntentId])

  const quizContent = useMemo(() => {
    if (currentLesson?.contentType !== 'QUIZ' || !contentData) return null
    return contentData.find(c => c.type === 'QUIZ') ?? null
  }, [currentLesson?.contentType, contentData])

  const videoContent = useMemo(() => {
    if (currentLesson?.contentType !== 'VIDEO' || !contentData) return null
    return contentData.find(c => c.type === 'VIDEO') ?? null
  }, [currentLesson?.contentType, contentData])

  const initialPositionSecs = useMemo(() => {
    if (!lessonId) return 0
    return enrollment?.lessonPositions?.[lessonId] ?? 0
  }, [enrollment?.lessonPositions, lessonId])

  const handleToggleComplete = () => {
    if (!lessonId) return
    updateProgress.mutate({
      lessonId,
      completed: !isCompleted
    })
  }

  const isLoading =
    isCourseLoading ||
    isEnrollmentLoading ||
    (currentLesson?.contentType === 'QUIZ' && isContentLoading)

  /* ---------------------------------- Loading ---------------------------------- */

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-slate-400 font-medium">Loading player...</p>
        </div>
      </div>
    )
  }

  /* ---------------------------------- Not Found ---------------------------------- */

  if (isError || !course || !currentLesson) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Heading3>Lesson not found</Heading3>
        <Button
          variant="outline"
          className="mt-4 border-slate-700 text-white hover:bg-slate-800"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          Back to Course
        </Button>
      </div>
    )
  }

  /* ---------------------------------- Guard States ---------------------------------- */

  if (isCourseUnavailable) {
    return (
      <CenteredState
        icon={<AlertCircle size={64} className="text-amber-500 mb-6" />}
        title="Course Unavailable"
        description="This course is currently unpublished or archived."
        onBack={() => navigate(`/courses/${courseId}`)}
      />
    )
  }

  if (isEnrollmentRevoked) {
    return (
      <CenteredState
        icon={<Lock size={64} className="text-amber-500 mb-6" />}
        title="Access Revoked"
        description="Your enrollment has been revoked."
        onBack={() => navigate(`/courses/${courseId}`)}
      />
    )
  }

  if (!isStaff && !canWatch) {
    return (
      <CenteredState
        icon={<Lock size={64} className="text-amber-500 mb-6" />}
        title={isPaymentPending ? 'Payment Required' : 'Lesson Locked'}
        description={isPaymentPending
          ? 'Complete payment to unlock this course.'
          : 'Enroll to access this lesson.'}
        actionLabel={checkoutPath ? 'Complete Payment' : undefined}
        onAction={checkoutPath ? () => navigate(checkoutPath) : undefined}
        onBack={() => navigate(`/courses/${courseId}`)}
      />
    )
  }

  if (!isAvailable && !isStaff) {
    return (
      <CenteredState
        icon={<Clock size={64} className="text-amber-500 mb-6" />}
        title="Lesson Locked"
        description={`Available on ${new Date(
          currentLesson.availableAt!
        ).toLocaleString()}`}
        onBack={() => navigate(`/courses/${courseId}`)}
      />
    )
  }

  /* ---------------------------------- UI ---------------------------------- */

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      {showCompletionOverlay && (
        <CompletionOverlay
          courseTitle={course.title}
          onClose={() => setHasDismissedCompletion(true)}
          onDashboard={() => navigate('/dashboard')}
        />
      )}

      <div className="flex-grow flex relative">
        {/* Main Player */}
        <main
          className={cn(
            'flex-grow flex flex-col transition-all duration-300',
            isSidebarOpen ? 'mr-80' : 'mr-0'
          )}
        >
          <div className="flex-grow flex items-center justify-center bg-black p-6">
            {currentLesson.contentType === 'VIDEO' && videoContent && (
              <div className="w-full max-w-5xl">
                <VideoPlayer
                  contentId={videoContent.id}
                  lessonId={lessonId!}
                  courseId={courseId!}
                  initialPositionSecs={initialPositionSecs}
                  onComplete={() => !isCompleted && handleToggleComplete()}
                />
              </div>
            )}

            {currentLesson.contentType === 'QUIZ' && quizContent?.questions && (
              <QuizPlayer
                questions={quizContent.questions}
                onComplete={() => !isCompleted && handleToggleComplete()}
              />
            )}
          </div>

          {/* Lesson Details & Assignments */}
          <div className="bg-slate-900/50 p-8 overflow-y-auto max-h-[40vh] border-t border-slate-800">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Heading2 className="mb-1">{currentLesson.title}</Heading2>
                  <Paragraph className="text-slate-400">
                    {course.title} • Module {course.modules.find(m => m.lessons.some(l => l.id === lessonId))?.title}
                  </Paragraph>
                </div>
                {isCompleted ? (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 size={14} />
                    Completed
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleToggleComplete}>
                    Mark as Complete
                  </Button>
                )}
              </div>

              {assignments && assignments.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-800">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FileText className="text-indigo-400" />
                    Lesson Assignments ({assignments.length})
                  </h3>
                  <div className="grid gap-4">
                    {assignments.map(assignment => (
                      <LessonAssignmentCard key={assignment.id} assignment={assignment} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="h-16 flex items-center justify-between px-8 bg-slate-900 border-t border-slate-800">
            <Button
              variant="outline"
              disabled={!prevLesson}
              onClick={() =>
                prevLesson &&
                navigate(`/courses/${courseId}/lesson/${prevLesson.id}`)
              }
            >
              <ChevronLeft size={18} className="mr-2" />
              Previous
            </Button>

            <span className="text-sm font-medium">
              Lesson {currentLessonIndex + 1} of {allLessons.length}
            </span>

            <Button
              variant="primary"
              disabled={!nextLesson}
              onClick={() =>
                nextLesson &&
                navigate(`/courses/${courseId}/lesson/${nextLesson.id}`)
              }
            >
              Next
              <ChevronRight size={18} className="ml-2" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}

function LessonAssignmentCard({ assignment }: { assignment: Assignment }) {
  const [content, setContent] = useState('')
  const { data: submission, isLoading } = useSubmission(assignment.id)
  const submitMutation = useSubmitAssignment()

  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date()

  const handleSubmit = async () => {
    if (!content.trim()) return
    await submitMutation.mutateAsync({ assignmentId: assignment.id, content })
    setContent('')
  }

  if (isLoading) return <div className="h-24 bg-slate-800 animate-pulse rounded-lg" />

  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-white">{assignment.title}</h4>
          <Paragraph className="text-sm text-slate-400 mt-1">{assignment.description}</Paragraph>
        </div>
        <div className="text-right">
          <Badge variant="secondary">{assignment.maxScore} pts</Badge>
          {assignment.dueDate && (
            <div className={cn("text-[10px] mt-1 flex items-center justify-end gap-1", isOverdue ? "text-rose-400" : "text-slate-500")}>
              <Calendar size={10} />
              {new Date(assignment.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {submission ? (
        <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Your Submission</span>
            <Badge variant={submission.status === 'GRADED' ? 'success' : 'secondary'} className="text-[10px]">
              {submission.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-200">{submission.content}</p>
          {submission.status === 'GRADED' && (
            <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center">
              <span className="text-sm font-bold text-emerald-400">Grade: {submission.grade}/{assignment.maxScore}</span>
              {submission.feedback && <span className="text-xs text-slate-400 italic">"{submission.feedback}"</span>}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <Input
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Type your answer here..."
            className="bg-slate-900 border-slate-700 text-sm"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              className="gap-2"
              onClick={handleSubmit}
              disabled={!content.trim() || submitMutation.isPending}
            >
              <Send size={14} />
              Submit Assignment
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

/* ---------------------------------- Reusable Components ---------------------------------- */

function CenteredState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  onBack
}: {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  onBack: () => void
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-4 text-center">
      {icon}
      <Heading2 className="mb-2">{title}</Heading2>
      <Paragraph className="text-slate-400 max-w-md">
        {description}
      </Paragraph>
      <Button
        variant="outline"
        className="mt-8 border-slate-700 text-white hover:bg-slate-800"
        onClick={onBack}
      >
        Back to Course
      </Button>
      {actionLabel && onAction && (
        <Button
          className="mt-3"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

function CompletionOverlay({
  courseTitle,
  onClose,
  onDashboard
}: {
  courseTitle: string
  onClose: () => void
  onDashboard: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-10 rounded-3xl text-center shadow-2xl">
        <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <Trophy className="h-12 w-12 text-primary" />
          <div className="absolute -top-2 -right-2 h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-900">
            <CheckCircle2 className="h-4 w-4 text-white" />
          </div>
        </div>

        <Heading2 className="mb-2">Course Completed!</Heading2>

        <Paragraph className="text-slate-400 mb-8">
          Congratulations! You finished{' '}
          <span className="text-white font-medium">{courseTitle}</span>.
        </Paragraph>

        <div className="flex flex-col gap-4">
          <Button onClick={onDashboard} size="lg">
            Back to My Learning
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Review Course Material
          </Button>
        </div>
      </div>
    </div>
  )
}
