import { useState } from 'react'
import { Container, Heading1, TextMuted, Stepper, Card } from '@/shared/ui'
import { BasicInfoForm } from '../../components/instructor/BasicInfoForm'
import { CurriculumForm } from '../../components/instructor/CurriculumForm'
import { CourseReview } from '../../components/instructor/CourseReview'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

const steps = [
  { title: 'Information', description: 'Basic course details' },
  { title: 'Curriculum', description: 'Modules and lessons' },
  { title: 'Publish', description: 'Review and go live' },
]

export function CourseCreatePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [courseData, setCourseData] = useState<any>({
    title: '',
    description: '',
    category: '',
    level: '',
    price: 0,
    modules: []
  })
  const navigate = useNavigate()

  const handleNext = (data: any) => {
    setCourseData((prev: any) => ({ ...prev, ...data }))
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
    <Container className="py-8 max-w-4xl">
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
          <CourseReview
            data={courseData}
            onBack={handleBack}
            onSubmit={() => {
              // Final submission logic
              alert('Course submitted successfully!')
              navigate('/courses')
            }}
          />
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
