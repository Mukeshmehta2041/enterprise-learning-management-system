import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAssignment, useSubmission, useSubmitAssignment } from '../api/useAssignments'
import { useUI } from '@/shared/context/UIContext'
import { Container, Card } from '@/shared/ui/Layout'
import { Heading1, Heading2, Heading3, Paragraph, Small } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { Textarea } from '@/shared/ui/Textarea'
import {
  ChevronLeft,
  Calendar,
  Award,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  MessageSquare,
  ExternalLink
} from 'lucide-react'

export function AssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>()
  const navigate = useNavigate()
  const { data: assignment, isLoading: isAssignmentLoading } = useAssignment(assignmentId!)
  const { data: submission, isLoading: isSubmissionLoading } = useSubmission(assignmentId!)
  const submitMutation = useSubmitAssignment()
  const { setBreadcrumbs } = useUI()

  useEffect(() => {
    if (assignment) {
      setBreadcrumbs([
        { label: 'Assignments', href: '/assignments' },
        { label: assignment.title }
      ])
    }
    return () => setBreadcrumbs(null)
  }, [assignment, setBreadcrumbs])

  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    try {
      await submitMutation.mutateAsync({
        assignmentId: assignmentId!,
        content
      })
      setContent('')
    } catch (err) {
      console.error('Submission failed', err)
    }
  }

  if (isAssignmentLoading || isSubmissionLoading) {
    return (
      <div className="py-20 text-center" role="status" aria-live="polite">
        Loading assignment...
      </div>
    )
  }

  if (!assignment) {
    return (
      <Container className="py-20 text-center">
        <Heading2>Assignment not found</Heading2>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/assignments')}
        >
          Back to Assignments
        </Button>
      </Container>
    )
  }

  const isOverdue = assignment?.dueDate ? new Date(assignment.dueDate) < new Date() : false

  return (
    <Container className="py-8">
      <Link to="/assignments" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-6 transition-colors">
        <ChevronLeft size={16} className="mr-1" />
        Back to Assignments
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <Heading1 className="mb-0 text-3xl">{assignment.title}</Heading1>
              <div className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {assignment.courseTitle}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-4 py-4 border-y border-slate-100 mb-6">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar size={18} className="text-blue-500" />
                <span className="text-sm">Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : 'No deadline'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Award size={18} className="text-yellow-500" />
                <span className="text-sm">{assignment.maxScore} Points Possible</span>
              </div>
              {assignment.lessonId && (
                <Link
                  to={`/courses/${assignment.courseId}/lesson/${assignment.lessonId}`}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium md:ml-auto"
                >
                  <ExternalLink size={18} />
                  <span>View Related Lesson</span>
                </Link>
              )}
            </div>

            <Heading3 className="mb-4">Instructions</Heading3>
            <Paragraph className="text-slate-600 whitespace-pre-wrap">
              {assignment.description}
            </Paragraph>
          </Card>

          {!submission ? (
            <Card className="p-6">
              <Heading3 className="mb-4">Your Submission</Heading3>
              {isOverdue && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                  <AlertCircle size={16} />
                  <span>The deadline has passed. You may still submit, but it will be marked as late.</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  label="Response"
                  placeholder="Type your response here or provide a URL to your project..."
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={submitMutation.isPending}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!content.trim() || submitMutation.isPending}
                  isLoading={submitMutation.isPending}
                >
                  <UploadCloud size={20} className="mr-2" />
                  Submit Assignment
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="p-6 border-emerald-200 bg-emerald-50/20">
              <div className="flex items-center justify-between mb-6">
                <Heading3 className="mb-0">Your Submission</Heading3>
                <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-100 px-3 py-1 rounded-full text-sm">
                  <CheckCircle2 size={16} />
                  {submission.status}
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg mb-6">
                <Small className="text-slate-400 block mb-2">Submitted on {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Date unknown'}</Small>
                <div className="text-slate-700 whitespace-pre-wrap">{submission.content}</div>
              </div>

              {submission.status === 'GRADED' && (
                <div className="p-4 bg-white border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Award size={18} className="text-yellow-500" />
                      Instructor Feedback
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {submission.grade} / {assignment.maxScore}
                    </div>
                  </div>
                  <Paragraph className="text-slate-600 italic">
                    "{submission.feedback || 'No written feedback provided.'}"
                  </Paragraph>
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <Heading3 className="text-lg mb-4">Submission Status</Heading3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Status</span>
                <span className={`font-bold ${submission ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {submission ? 'Submitted' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Due Date</span>
                <span className={isOverdue ? 'text-red-600 font-medium' : 'text-slate-900'}>
                  {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No deadline'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Grading</span>
                <span className="text-slate-900">
                  {submission?.status === 'GRADED' ? 'Complete' : 'Pending Review'}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-50 border-blue-100">
            <div className="flex gap-3">
              <MessageSquare size={20} className="text-blue-500 shrink-0" />
              <div>
                <Small className="font-bold text-blue-900 block">Need help?</Small>
                <Small className="text-blue-700">Contact your instructor via the course discussion forum.</Small>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}
