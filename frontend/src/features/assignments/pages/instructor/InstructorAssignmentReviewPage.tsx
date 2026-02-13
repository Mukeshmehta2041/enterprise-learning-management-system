import { useParams, Link } from 'react-router-dom'
import { useAssignment, useSubmissions, useGradeSubmission } from '../../api/useAssignments'
import { Container, Card } from '@/shared/ui/Layout'
import { Heading1, Heading2, Heading3, TextMuted, Small } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { ChevronLeft, CheckCircle2, Clock, User } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/shared/context/ToastContext'

export function InstructorAssignmentReviewPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>()
  const { data: assignment, isLoading: isAssignmentLoading } = useAssignment(assignmentId!)
  const { data: submissions, isLoading: isSubmissionsLoading } = useSubmissions(assignmentId!)
  const gradeMutation = useGradeSubmission()
  const { success, error } = useToast()

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)
  const [grade, setGrade] = useState<{ score: number, feedback: string }>({ score: 0, feedback: '' })

  const selectedSubmission = submissions?.find(s => s.id === selectedSubmissionId)

  const handleGradeSubmit = async () => {
    if (!selectedSubmissionId) return

    try {
      await gradeMutation.mutateAsync({
        submissionId: selectedSubmissionId,
        score: grade.score,
        feedback: grade.feedback
      })
      success('Grade submitted successfully')
      setSelectedSubmissionId(null)
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Failed to submit grade')
    }
  }

  if (isAssignmentLoading || isSubmissionsLoading) return <div className="p-20 text-center">Loading...</div>

  return (
    <Container className="py-8">
      <Link to="/instructor/courses" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-6">
        <ChevronLeft size={16} className="mr-1" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <Heading1>{assignment?.title}</Heading1>
        <TextMuted>Review and grade student submissions</TextMuted>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <Heading2 className="text-xl">Students ({submissions?.length || 0})</Heading2>
          <div className="space-y-2">
            {submissions?.map(submission => (
              <button
                key={submission.id}
                onClick={() => {
                  setSelectedSubmissionId(submission.id)
                  setGrade({
                    score: submission.grade || 0,
                    feedback: submission.feedback || ''
                  })
                }}
                className={`w-full text-left p-4 rounded-lg border transition-all ${selectedSubmissionId === submission.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User size={16} className="text-slate-500" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Student ID: {submission.studentId.substring(0, 8)}</div>
                      <Small className="text-slate-500">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </Small>
                    </div>
                  </div>
                  {submission.status === 'GRADED' ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <Clock size={16} className="text-amber-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <Card className="p-6">
              <div className="mb-6">
                <Heading2 className="text-2xl mb-2">Submission Content</Heading2>
                <div className="p-4 bg-slate-50 rounded-lg whitespace-pre-wrap text-slate-800 border border-slate-100">
                  {selectedSubmission.content}
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <Heading2 className="text-2xl">Grade & Feedback</Heading2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Score</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={assignment?.maxScore}
                        value={grade.score}
                        onChange={(e) => setGrade({ ...grade, score: parseInt(e.target.value) || 0 })}
                      />
                      <span className="text-slate-400">/ {assignment?.maxScore}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Feedback (Optional)</label>
                  <Textarea
                    placeholder="Provide constructive feedback..."
                    value={grade.feedback}
                    onChange={(e) => setGrade({ ...grade, feedback: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setSelectedSubmissionId(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGradeSubmit}
                    isLoading={gradeMutation.isPending}
                  >
                    Save Grade
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-center">
              <User size={48} className="text-slate-300 mb-4" />
              <Heading3>Select a student to start grading</Heading3>
              <TextMuted>Choose an assignment submission from the list on the left.</TextMuted>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
