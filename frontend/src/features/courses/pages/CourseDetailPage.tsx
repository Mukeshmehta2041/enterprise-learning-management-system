import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useCourse } from '../api/useCourses'
import { useEnrollment, useEnrollSub } from '@/features/enrollments/api/useEnrollments'
import { useCourseAssignments } from '@/features/assignments/api/useAssignments'
import { useAccess } from '@/shared/hooks/useAccess'
import { useUI } from '@/shared/context/UIContext'
import { Container, Card } from '@/shared/ui/Layout'
import { Heading1, Heading2, Heading3, Muted, Paragraph, Small } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { BookOpen, Clock, Star, Users, PlayCircle, FileText, HelpCircle, Edit, CheckCircle2, ClipboardList, ChevronRight, Lock, BadgeCheck } from 'lucide-react'
import { CourseSkeleton } from '../components/CourseSkeleton'
import { cn } from '@/shared/utils/cn'
import type { Module, Lesson } from '@/shared/types/course'
import type { Assignment } from '@/shared/types/assignment'

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { data: course, isLoading: isCourseLoading, isError } = useCourse(courseId!)
  const { data: enrollment, isLoading: isEnrollmentLoading } = useEnrollment(courseId!)
  const { data: assignments } = useCourseAssignments(courseId!)
  const enrollMutation = useEnrollSub()
  const { hasRole } = useAccess()
  const { setBreadcrumbs } = useUI()

  useEffect(() => {
    if (course) {
      setBreadcrumbs([
        { label: 'Courses', href: '/courses' },
        { label: course.title }
      ])
    }
    return () => setBreadcrumbs(null)
  }, [course, setBreadcrumbs])

  const isLoading = isCourseLoading || isEnrollmentLoading

  const handleEnroll = async () => {
    try {
      if (enrollment) {
        // If already enrolled, find first lesson and go to player
        const firstLesson = course?.modules[0]?.lessons[0]
        if (firstLesson) {
          navigate(`/courses/${courseId}/lesson/${firstLesson.id}`)
        }
        return
      }

      if (course && !course.isFree) {
        await enrollMutation.mutateAsync({ courseId: course.id })

        const intentId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${course.id}-${Date.now()}`
        const query = new URLSearchParams({
          courseId: course.id,
          courseName: course.title,
          price: course.price.toFixed(2),
          currency: course.currency || 'USD',
        })
        navigate(`/payments/checkout/${intentId}?${query.toString()}`)
        return
      }

      await enrollMutation.mutateAsync({ courseId: courseId! })
      // On success, the mutation invalidates queries which will update the UI
    } catch (error) {
      console.error('Enrollment failed', error)
    }
  }

  if (isLoading) {
    return (
      <Container className="py-8" aria-live="polite">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-12 w-3/4 bg-slate-200 animate-pulse rounded" />
            <div className="h-32 w-full bg-slate-200 animate-pulse rounded" />
          </div>
          <div className="lg:col-span-1">
            <CourseSkeleton />
          </div>
        </div>
      </Container>
    )
  }

  if (isError || !course) {
    return (
      <Container className="py-12 text-center">
        <Heading2>Course not found</Heading2>
        <Paragraph>The course you are looking for does not exist or has been removed.</Paragraph>
        <Button className="mt-4" onClick={() => navigate('/courses')}>
          Back to Courses
        </Button>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Heading1 className="mb-4">{course.title}</Heading1>
            </div>
            {hasRole(['INSTRUCTOR', 'ADMIN']) && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate(`/instructor/courses/${courseId}/edit`)}
              >
                <Edit size={16} />
                Edit Course
              </Button>
            )}
          </div>
          <Paragraph className="text-xl text-slate-600 leading-relaxed">
            {course.description}
          </Paragraph>

          <div className="flex flex-wrap gap-6 py-6 border-y border-slate-100">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" size={20} />
              <span className="font-bold">{course.rating.toFixed(1)}</span>
              <Muted>(1,234 ratings)</Muted>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Users size={20} />
              <span>{course.totalEnrollments} students enrolled</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock size={20} />
              <span>{course.duration} total length</span>
            </div>
          </div>

          <section>
            <Heading2 className="mb-6">Course Content</Heading2>
            <div className="space-y-4">
              {course.modules.length === 0 ? (
                <Muted>No modules have been added to this course yet.</Muted>
              ) : (
                course.modules.sort((a: Module, b: Module) => a.order - b.order).map((module: Module) => {
                  const allLessonsInModule = module.lessons;
                  const completedLessonsInModule = allLessonsInModule.filter(l => enrollment?.completedLessonIds.includes(l.id));
                  const isModuleCompleted = allLessonsInModule.length > 0 && completedLessonsInModule.length === allLessonsInModule.length;
                  const moduleProgress = allLessonsInModule.length > 0
                    ? Math.round((completedLessonsInModule.length / allLessonsInModule.length) * 100)
                    : 0

                  return (
                    <div key={module.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                        <div>
                          <Heading3 className="text-lg">{module.title}</Heading3>
                          {module.description && <Small className="mt-1 block">{module.description}</Small>}
                          {enrollment && allLessonsInModule.length > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                                <span>Progress {completedLessonsInModule.length}/{allLessonsInModule.length}</span>
                                <span>{moduleProgress}%</span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500"
                                  style={{ width: `${moduleProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        {isModuleCompleted && (
                          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 size={14} />
                            Section Complete
                          </div>
                        )}
                      </div>
                      <div className="divide-y divide-slate-100">
                        {module.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order).map((lesson: Lesson) => {
                          const isLessonCompleted = enrollment?.completedLessonIds.includes(lesson.id)
                          const lessonAssignments = assignments?.filter((a: Assignment) => a.lessonId === lesson.id) || []
                          const canWatch = lesson.canWatch ?? Boolean(course?.hasAccess || lesson.isPreview)
                          const isLocked = !canWatch

                          return (
                            <div key={lesson.id} className={cn(isLocked && "opacity-75 select-none")}>
                              <div className={cn(
                                "p-4 flex items-center justify-between transition-colors",
                                isLocked ? "cursor-not-allowed bg-slate-50/50" : "hover:bg-slate-50 cursor-pointer"
                              )} onClick={() => {
                                if (!isLocked) {
                                  navigate(`/courses/${courseId}/lessons/${lesson.id}`)
                                }
                              }}>
                                <div className="flex items-center gap-3">
                                  {isLocked ? (
                                    <Lock size={18} className="text-slate-400" />
                                  ) : isLessonCompleted ? (
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                  ) : (
                                    <>
                                      {lesson.contentType === 'VIDEO' && <PlayCircle size={18} className="text-blue-500" />}
                                      {lesson.contentType === 'DOCUMENT' && <FileText size={18} className="text-emerald-500" />}
                                      {lesson.contentType === 'QUIZ' && <HelpCircle size={18} className="text-orange-500" />}
                                    </>
                                  )}
                                  <div className="flex flex-col">
                                    <span className={cn(
                                      "font-medium",
                                      isLessonCompleted ? "text-slate-500 line-through" : "text-slate-700"
                                    )}>
                                      {lesson.title}
                                    </span>
                                    {lesson.isPreview && !course?.hasAccess && (
                                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight flex items-center gap-1">
                                        <BadgeCheck size={10} />
                                        Free Preview
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="text-sm text-slate-400">{lesson.duration}</span>
                              </div>

                              {/* Lesson-specific assignments */}
                              {lessonAssignments.map((assignment: Assignment) => (
                                <Link
                                  to={`/assignments/${assignment.id}`}
                                  key={assignment.id}
                                  className="ml-8 p-3 mr-4 mb-2 flex items-center justify-between bg-indigo-50/50 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <ClipboardList size={16} className="text-indigo-600" />
                                    <div>
                                      <div className="text-sm font-semibold text-indigo-900">{assignment.title}</div>
                                      {assignment.dueDate && (
                                        <div className="text-xs text-indigo-600">
                                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <ChevronRight size={16} className="text-indigo-400" />
                                </Link>
                              ))}
                            </div>
                          )
                        })}

                        {/* Module-specific assignments (not linked to any lesson) */}
                        {assignments?.filter((a: Assignment) => a.moduleId === module.id && !a.lessonId).map((assignment: Assignment) => (
                          <Link
                            to={`/assignments/${assignment.id}`}
                            key={assignment.id}
                            className="m-4 flex items-center justify-between bg-slate-50 border border-slate-200 p-4 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-indigo-100 p-2 rounded-lg">
                                <ClipboardList size={20} className="text-indigo-600" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{assignment.title}</div>
                                <div className="text-sm text-slate-500">Module Assignment</div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-2">
                              Start Assignment
                              <ChevronRight size={16} />
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 overflow-hidden">
            {course.thumbnailUrl ? (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                loading="lazy"
                decoding="async"
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400">
                <BookOpen size={64} />
              </div>
            )}
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {course.hasAccess ? (
                    <span className="text-3xl font-bold text-emerald-600 flex items-center gap-2">
                      <BadgeCheck size={28} />
                      Enrolled
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">
                        {course.isFree ? (
                          <span className="text-emerald-600">FREE</span>
                        ) : (
                          `${course.currency === 'USD' ? '$' : course.currency + ' '}${course.price.toFixed(2)}`
                        )}
                      </span>
                      {course.isFree && (
                        <span className="text-xs text-slate-500 font-medium">Limited time offer</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                variant={course.hasAccess ? "outline" : "primary"}
                onClick={handleEnroll}
                isLoading={enrollMutation.isPending}
              >
                {course.hasAccess ? 'Continue Learning' : (course.isFree ? 'Enroll for Free' : 'Buy Now')}
              </Button>

              <div className="space-y-4">
                <div className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  This course includes:
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <PlayCircle size={16} />
                    <span>On-demand video content</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <FileText size={16} />
                    <span>Downloadable resources</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <HelpCircle size={16} />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <Users size={16} />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <Muted className="text-center italic">
                  Taught by {course.instructorName}
                </Muted>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}
