import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCourse } from '../api/useCourses'
import { useEnrollment, useEnrollSub } from '@/features/enrollments/api/useEnrollments'
import { Container, Card } from '@/shared/ui/Layout'
import { Heading1, Heading2, Heading3, Muted, Paragraph, Small } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { BookOpen, Clock, Star, Users, ChevronRight, PlayCircle, FileText, HelpCircle } from 'lucide-react'
import { CourseSkeleton } from '../components/CourseSkeleton'
import type { Module, Lesson } from '@/shared/types/course'

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { data: course, isLoading: isCourseLoading, isError } = useCourse(courseId!)
  const { data: enrollment, isLoading: isEnrollmentLoading } = useEnrollment(courseId!)
  const enrollMutation = useEnrollSub()

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
          <div>
            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-blue-600">
              <Link to="/courses">Courses</Link>
              <ChevronRight size={14} />
              <span className="text-slate-500">{course.category}</span>
            </div>
            <Heading1 className="mb-4">{course.title}</Heading1>
            <Paragraph className="text-xl text-slate-600 leading-relaxed">
              {course.description}
            </Paragraph>
          </div>

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
                course.modules.sort((a: Module, b: Module) => a.order - b.order).map((module: Module) => (
                  <div key={module.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-200">
                      <Heading3 className="text-lg">{module.title}</Heading3>
                      {module.description && <Small className="mt-1 block">{module.description}</Small>}
                    </div>
                    <div className="divide-y divide-slate-100">
                      {module.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order).map((lesson: Lesson) => (
                        <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            {lesson.contentType === 'VIDEO' && <PlayCircle size={18} className="text-blue-500" />}
                            {lesson.contentType === 'DOCUMENT' && <FileText size={18} className="text-emerald-500" />}
                            {lesson.contentType === 'QUIZ' && <HelpCircle size={18} className="text-orange-500" />}
                            <span className="text-slate-700 font-medium">{lesson.title}</span>
                          </div>
                          <span className="text-sm text-slate-400">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
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
                <span className="text-3xl font-bold">
                  {enrollment ? 'Enrolled' : `$${course.price.toFixed(2)}`}
                </span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleEnroll}
                isLoading={enrollMutation.isPending}
              >
                {enrollment ? 'Continue Learning' : 'Enroll Now'}
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
