import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Heading1,
  TextMuted,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Breadcrumbs,
} from '@/shared/ui'
import { useCourse } from '../../api/useCourses'
import { BasicInfoForm } from '../../components/instructor/BasicInfoForm'
import { CurriculumForm } from '../../components/instructor/CurriculumForm'
import { Save, Rocket, Settings, List, Info, DollarSign } from 'lucide-react'

export function CourseEditPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { data: course, isLoading, isError } = useCourse(courseId!)

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
    <Container className="py-8">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Instructor', href: '/instructor/courses' },
            { label: 'My Courses', href: '/instructor/courses' },
            { label: 'Edit Course' },
          ]}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Heading1>{course.title}</Heading1>
          <TextMuted>Course ID: {course.id}</TextMuted>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Rocket size={18} />
            Publish Changes
          </Button>
          <Button className="gap-2">
            <Save size={18} />
            Save Draft
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
              }}
              onSubmit={(data) => console.log('Update info', data)}
            />
          </div>
        </TabsContent>

        <TabsContent value="curriculum">
          <div className="max-w-4xl">
            <CurriculumForm
              initialModules={course.modules}
              onSave={(modules) => console.log('Update curriculum', modules)}
            />
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <TextMuted>Pricing and access settings will go here.</TextMuted>
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
