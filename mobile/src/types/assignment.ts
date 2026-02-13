export interface Assignment {
  id: string
  courseId: string
  moduleId?: string
  lessonId?: string
  title: string
  description: string
  dueDate?: string
  maxScore: number
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  content: string
  submittedAt: string
  score?: number
  feedback?: string
  status: 'SUBMITTED' | 'GRADED' | 'RESUBMISSION_REQUIRED'
}
