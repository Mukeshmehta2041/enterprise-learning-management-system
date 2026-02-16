import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import {
  Container,
  Heading1,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
} from '@/shared/ui'
import {
  useCourse,
  useUpdateCourse,
  usePublishCourse,
  useSaveAsDraft,
  useSyncCurriculum
} from '../../api/useCourses'
import { useUI } from '@/shared/context/UIContext'
import { BasicInfoForm } from '../../components/instructor/BasicInfoForm'
import { PricingSettingsForm } from '../../components/instructor/PricingSettingsForm'
import type { CourseDetail, ModuleInput } from '@/shared/types/course'
import { CurriculumForm } from '../../components/instructor/CurriculumForm'
import { AssignmentManagement } from '../../components/instructor/AssignmentManagement'
import { Save, Rocket, Settings, List, Info, DollarSign, FileStack } from 'lucide-react'
import { useToast } from '@/shared/context/ToastContext'
import { Badge } from '@/shared/ui/Badge'

export function CourseEditPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { data: course, isLoading, isError } = useCourse(courseId!)
  const { setBreadcrumbs } = useUI()
  const { success, error: showError } = useToast()

  const updateCourseMutation = useUpdateCourse()
  const publishCourseMutation = usePublishCourse()
  const saveAsDraftMutation = useSaveAsDraft()
  const syncCurriculumMutation = useSyncCurriculum()

  useEffect(() => {
    if (course) {
      setBreadcrumbs([
        { label: 'Instructor', href: '/instructor/courses' },
        { label: 'My Courses', href: '/instructor/courses' },
        { label: `Edit: ${course.title}` },
      ])
    }
    return () => setBreadcrumbs(null)
  }, [course, setBreadcrumbs])

  const handlePublish = async () => {
    try {
      await publishCourseMutation.mutateAsync(courseId!)
      success('Course published successfully')
    } catch {
      showError('Failed to publish course')
    }
  }

  const handleSaveDraft = async () => {
    try {
      await saveAsDraftMutation.mutateAsync(courseId!)
      success('Course saved as draft')
    } catch {
      showError('Failed to save draft')
    }
  }

  const handleUpdateInfo = async (data: unknown) => {
    try {
      await updateCourseMutation.mutateAsync({
        id: courseId!,
        data: data as Partial<CourseDetail>,
      })
      success('Course information updated')
    } catch {
      showError('Failed to update course information')
    }
  }

  const handleSyncCurriculum = async (modules: ModuleInput[]) => {
    try {
      await syncCurriculumMutation.mutateAsync({
        id: courseId!,
        modules,
      })
      success('Curriculum updated successfully')
    } catch {
      showError('Failed to update curriculum')
    }
  }

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 rounded w-full"></div>
          <div className="h-64 bg-slate-100 rounded"></div>
        </div>
      </Container>
    )
  }

  if (isError || !course) {
    return (
      <Container className="py-12 text-center">
        <Heading1>Course not found</Heading1>
        <Button onClick={() => navigate('/instructor/courses')} className="mt-4">
          Back to My Courses
        </Button>
      </Container>
    )
  }

  return (
    <Container className="py-8" size="xl">


      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Heading1>{course.title}</Heading1>
            <Badge variant={course.status === 'PUBLISHED' ? 'success' : 'secondary'}>
              {course.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span>ID: {course.id}</span>
            <span>•</span>
            <span className="font-medium text-emerald-600">${course.price}</span>
            <span>•</span>
            <span>{course.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handlePublish}
            disabled={publishCourseMutation.isPending || course.status === 'PUBLISHED'}
          >
            <Rocket size={18} />
            {publishCourseMutation.isPending ? 'Publishing...' : 'Publish Changes'}
          </Button>
          <Button
            className="gap-2"
            onClick={handleSaveDraft}
            disabled={saveAsDraftMutation.isPending || course.status === 'DRAFT'}
          >
            <Save size={18} />
            {saveAsDraftMutation.isPending ? 'Saving...' : 'Save Draft'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="curriculum" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-b border-slate-200 p-0 h-auto rounded-none gap-8">
          <TabsTrigger
            value="info"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-2 px-1 gap-2"
          >
            <Info size={18} />
            Basic Information
          </TabsTrigger>
          <TabsTrigger
            value="curriculum"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-2 px-1 gap-2"
          >
            <List size={18} />
            Curriculum
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-2 px-1 gap-2"
          >
            <FileStack size={18} />
            Assignments
          </TabsTrigger>
          <TabsTrigger
            value="pricing"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-2 px-1 gap-2"
          >
            <DollarSign size={18} />
            Pricing & Settings
          </TabsTrigger>
          <TabsTrigger
            value="danger"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-2 px-1 gap-2"
          >
            <Settings size={18} />
            Danger Zone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="max-w-3xl">
            <BasicInfoForm
              defaultValues={{
                title: course.title,
                description: course.description,
                category: course.category,
                level: course.level,
                price: course.price,
                thumbnailUrl: course.thumbnailUrl ?? '',
                completionThreshold: course.completionThreshold ?? 100,
                requireAllAssignments: course.requireAllAssignments ?? false,
              }}
              onSubmit={handleUpdateInfo}
              isSubmitting={updateCourseMutation.isPending}
            />
          </div>
        </TabsContent>

        <TabsContent value="curriculum">
          <div className="w-full">
            <CurriculumForm
              courseId={course.id}
              initialModules={course.modules}
              onSave={handleSyncCurriculum}
            />
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <div className="w-full">
            <AssignmentManagement course={course} />
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="w-full">
            <PricingSettingsForm
              defaultValues={{
                price: course.price,
                status: course.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
              }}
              onSubmit={handleUpdateInfo}
              isSubmitting={updateCourseMutation.isPending}
            />
          </div>
        </TabsContent>

        <TabsContent value="danger">
          <div className="bg-red-50 p-6 rounded-xl border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Delete Course</h3>
            <p className="text-red-700 mb-4">
              Once you delete a course, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">Delete this course</Button>
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  )
}
