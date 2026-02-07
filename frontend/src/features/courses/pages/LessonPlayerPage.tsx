import { Paragraph } from '@/shared/ui/Typography'
import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCourse } from '../api/useCourses'
import { useEnrollment, useUpdateProgress } from '@/features/enrollments/api/useEnrollments'
import { Heading3, Small } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  PlayCircle,
  FileText,
  HelpCircle,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { Module, Lesson } from '@/shared/types/course'

export function LessonPlayerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const { data: course, isLoading: isCourseLoading, isError } = useCourse(courseId!)
  const { data: enrollment, isLoading: isEnrollmentLoading } = useEnrollment(courseId!)
  const updateProgress = useUpdateProgress(courseId!)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const allLessons = useMemo(() => {
    if (!course) return []
    return course.modules
      .sort((a: Module, b: Module) => a.order - b.order)
      .flatMap((m: Module) => m.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order))
  }, [course])

  const currentLessonIndex = allLessons.findIndex((l: Lesson) => l.id === lessonId)
  const currentLesson = allLessons[currentLessonIndex]
  const nextLesson = allLessons[currentLessonIndex + 1]
  const prevLesson = allLessons[currentLessonIndex - 1]

  const isCompleted = enrollment?.completedLessonIds.includes(lessonId!) || false
  const progressPercentage = enrollment?.completedLessonIds.length && allLessons.length
    ? Math.round((enrollment.completedLessonIds.length / allLessons.length) * 100)
    : 0

  const handleToggleComplete = () => {
    updateProgress.mutate({
      lessonId: lessonId!,
      completed: !isCompleted
    })
  }

  const isLoading = isCourseLoading || isEnrollmentLoading

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-slate-400 font-medium">Loading player...</p>
        </div>
      </div>
    )
  }

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

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900 z-20">
        <div className="flex items-center gap-4">
          <Link
            to={`/courses/${courseId}`}
            aria-label="Back to course"
            className="p-2 hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="hidden md:block">
            <h1 className="font-semibold line-clamp-1">{course.title}</h1>
            <Small className="text-slate-400">{currentLesson.title}</Small>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={isCompleted ? "secondary" : "primary"}
            size="sm"
            onClick={handleToggleComplete}
            isLoading={updateProgress.isPending}
            className="hidden sm:flex"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={16} className="mr-2 text-emerald-500" />
                Completed
              </>
            ) : (
              'Mark as Complete'
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-slate-800"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? 'Close course content' : 'Open course content'}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </header>

      <div className="flex-grow flex relative">
        {/* Main Player Area */}
        <main className={cn(
          "flex-grow flex flex-col transition-all duration-300",
          isSidebarOpen ? "mr-80" : "mr-0"
        )}>
          <div className="flex-grow flex items-center justify-center bg-black">
            {currentLesson.contentType === 'VIDEO' && (
              <div className="aspect-video w-full max-w-5xl bg-slate-900 flex flex-col items-center justify-center border border-slate-800 rounded-lg">
                <PlayCircle size={64} className="text-primary mb-4" />
                <Paragraph className="text-slate-400 text-center px-4">
                  Video Player Placeholder<br />
                  <span className="text-sm">Source: {currentLesson.contentUrl || 'No URL provided'}</span>
                </Paragraph>
                {!isCompleted && (
                  <Button
                    onClick={handleToggleComplete}
                    className="mt-6"
                    size="sm"
                  >
                    Mark Lesson as Done
                  </Button>
                )}
              </div>
            )}
            {currentLesson.contentType === 'DOCUMENT' && (
              <div className="h-full w-full max-w-4xl bg-white text-slate-900 p-8 overflow-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                  <Button
                    variant={isCompleted ? "outline" : "primary"}
                    size="sm"
                    onClick={handleToggleComplete}
                  >
                    {isCompleted ? 'Completed' : 'Mark as Done'}
                  </Button>
                </div>
                <div className="prose max-w-none">
                  <p>Document content would be rendered here.</p>
                  <p>{currentLesson.description}</p>
                </div>
              </div>
            )}
            {currentLesson.contentType === 'QUIZ' && (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-2xl w-full text-center">
                <HelpCircle size={48} className="text-orange-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Knowledge Check</h2>
                <p className="text-slate-400 mb-6">Test your understanding of the previous lessons.</p>
                <Button size="lg" className="w-full" variant="primary">Start Quiz</Button>
              </div>
            )}
          </div>

          {/* Player Navigation */}
          <div className="h-16 flex items-center justify-between px-8 bg-slate-900 border-t border-slate-800">
            <Button
              variant="outline"
              className="text-white border-slate-700 hover:bg-slate-800 disabled:opacity-30"
              disabled={!prevLesson}
              onClick={() => navigate(`/courses/${courseId}/lesson/${prevLesson?.id}`)}
            >
              <ChevronLeft size={20} className="mr-2" />
              Previous
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-medium">
                Lesson {currentLessonIndex + 1} of {allLessons.length}
              </span>
            </div>

            <Button
              variant="primary"
              className="disabled:opacity-30"
              disabled={!nextLesson}
              onClick={() => navigate(`/courses/${courseId}/lesson/${nextLesson?.id}`)}
            >
              Next
              <ChevronRight size={20} className="ml-2" />
            </Button>
          </div>
        </main>

        {/* Sidebar Navigation */}
        <aside className={cn(
          "fixed right-0 top-16 bottom-0 w-80 bg-slate-900 border-l border-slate-800 transition-transform duration-300 z-10 overflow-y-auto",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-bold">Course Content</h2>
            <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-semibold">
              {progressPercentage}% Complete
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {course.modules.sort((a: Module, b: Module) => a.order - b.order).map((module: Module) => (
              <div key={module.id}>
                <div className="p-4 bg-slate-900/50 sticky top-0 bg-slate-900">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {module.title}
                  </h3>
                </div>
                <div>
                  {module.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order).map((lesson: Lesson) => {
                    const isLessonCompleted = enrollment?.completedLessonIds.includes(lesson.id)
                    return (
                      <Link
                        key={lesson.id}
                        to={`/courses/${courseId}/lesson/${lesson.id}`}
                        aria-current={lesson.id === lessonId ? 'page' : undefined}
                        className={cn(
                          "flex items-start gap-3 p-4 hover:bg-slate-800 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
                          lesson.id === lessonId ? "bg-slate-800 border-l-2 border-primary" : ""
                        )}
                      >
                        <div className="mt-0.5">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center",
                            isLessonCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-slate-700 group-hover:border-slate-500"
                          )}>
                            {isLessonCompleted && <CheckCircle2 size={12} fill="currentColor" className="text-emerald-500 stroke-white" />}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            {lesson.contentType === 'VIDEO' && <PlayCircle size={14} className="text-slate-400" />}
                            {lesson.contentType === 'DOCUMENT' && <FileText size={14} className="text-slate-400" />}
                            {lesson.contentType === 'QUIZ' && <HelpCircle size={14} className="text-slate-400" />}
                            <span className={lesson.id === lessonId ? "text-primary" : "text-slate-300"}>
                              {lesson.title}
                            </span>
                          </div>
                          {lesson.duration && <Small className="text-slate-500">{lesson.duration}</Small>}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
