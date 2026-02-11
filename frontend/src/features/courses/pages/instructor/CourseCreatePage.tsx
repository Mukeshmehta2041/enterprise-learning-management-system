import { useState, useEffect } from 'react'
import { Container, Heading1, TextMuted, Stepper, Card } from '@/shared/ui'
import { BasicInfoForm } from '../../components/instructor/BasicInfoForm'
import { CurriculumForm } from '../../components/instructor/CurriculumForm'
import { CourseReview } from '../../components/instructor/CourseReview'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useCreateCourse } from '../../api/useCreateCourse'
import { useUI } from '@/shared/context/UIContext'
import type { CourseDetail, Module } from '@/shared/types/course'

const steps = [
  { title: 'Information', description: 'Basic course details' },
  { title: 'Curriculum', description: 'Modules and lessons' },
  { title: 'Publish', description: 'Review and go live' },
]

export function CourseCreatePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const { setBreadcrumbs } = useUI()
  const [courseData, setCourseData] = useState<Partial<CourseDetail>>({
    title: '',
    description: '',
    category: '',
    level: 'BEGINNER',
    price: 0,
    modules: []
  })

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Instructor', href: '/instructor/courses' },
      { label: 'My Courses', href: '/instructor/courses' },
      { label: 'New Course' },
    ])
    return () => setBreadcrumbs(null)
  }, [setBreadcrumbs])

  const navigate = useNavigate()
  const createCourse = useCreateCourse()

  const handleNext = (data: Partial<CourseDetail>) => {
    setCourseData((prev) => ({ ...prev, ...data }))
    setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/courses')
    }
  }

  return (
    <Container className="py-8" size="lg">
      <div className="mb-8">
        <Heading1>Create New Course</Heading1>
        <TextMuted>Follow the steps to set up your professional course</TextMuted>
      </div>

      <Card className="mb-8 p-6">
        <Stepper steps={steps} currentStep={currentStep} />
      </Card>

      <div className="space-y-6">
        {currentStep === 1 && (
          <BasicInfoForm
            initialData={courseData}
            onNext={handleNext}
            onCancel={handleCancel}
          />
        )}

        {currentStep === 2 && (
          <CurriculumForm
            initialData={courseData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <div className="relative">
            {createCourse.isPending && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-xl">
                <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-lg shadow-xl border">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  <p className="font-medium text-slate-900">Creating your course...</p>
                </div>
              </div>
            )}
            <CourseReview
              data={courseData as Partial<CourseDetail> & { modules: Partial<Module>[] }}
              onBack={handleBack}
              isSubmitting={createCourse.isPending}
              onSubmit={() => {
                createCourse.mutate(courseData as Partial<CourseDetail>)
              }}
            />
          </div>
        )}
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <AlertTriangle className="text-amber-500 h-5 w-5 shrink-0" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold">Unsaved Changes</p>
          <p>Your progress is currently saved in the browser session. Make sure to complete all steps to publish the course.</p>
        </div>
      </div>
    </Container>
  )
}
