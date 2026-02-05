import { Paragraph } from '@/shared/ui/Typography'
import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCourse } from '../api/useCourses'
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
  ArrowLeft
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { Module, Lesson } from '@/shared/types/course'

export function LessonPlayerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const { data: course, isLoading, isError } = useCourse(courseId!)
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

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading player...</div>
  }

  if (isError || !course || !currentLesson) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Heading3>Lesson not found</Heading3>
        <Link to={`/courses/${courseId}`}>
          <Button variant="outline" className="mt-4">Back to Course</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900 z-20">
        <div className="flex items-center gap-4">
          <Link to={`/courses/${courseId}`} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="hidden md:block">
            <h1 className="font-semibold line-clamp-1">{course.title}</h1>
            <Small className="text-slate-400">{currentLesson.title}</Small>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-white hover:bg-slate-800"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
                <PlayCircle size={64} className="text-blue-500 mb-4" />
                <Paragraph className="text-slate-400 text-center px-4">
                  Video Player Placeholder<br />
                  <span className="text-sm">Source: {currentLesson.contentUrl || 'No URL provided'}</span>
                </Paragraph>
              </div>
            )}
            {currentLesson.contentType === 'DOCUMENT' && (
              <div className="h-full w-full max-w-4xl bg-white text-slate-900 p-8 overflow-auto">
                <h2 className="text-2xl font-bold mb-6">{currentLesson.title}</h2>
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
                <Button size="lg" className="w-full">Start Quiz</Button>
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
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-30"
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
            <div className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full font-semibold">
              15% Complete
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
                  {module.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order).map((lesson: Lesson) => (
                    <Link
                      key={lesson.id}
                      to={`/courses/${courseId}/lesson/${lesson.id}`}
                      className={cn(
                        "flex items-start gap-3 p-4 hover:bg-slate-800 transition-colors group",
                        lesson.id === lessonId ? "bg-slate-800 border-l-2 border-blue-500" : ""
                      )}
                    >
                      <div className="mt-0.5">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-700 group-hover:border-slate-500 transition-colors flex items-center justify-center">
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {lesson.contentType === 'VIDEO' && <PlayCircle size={14} className="text-slate-400" />}
                          {lesson.contentType === 'DOCUMENT' && <FileText size={14} className="text-slate-400" />}
                          {lesson.contentType === 'QUIZ' && <HelpCircle size={14} className="text-slate-400" />}
                          <span className={lesson.id === lessonId ? "text-blue-400" : "text-slate-300"}>
                            {lesson.title}
                          </span>
                        </div>
                        {lesson.duration && <Small className="text-slate-500">{lesson.duration}</Small>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
