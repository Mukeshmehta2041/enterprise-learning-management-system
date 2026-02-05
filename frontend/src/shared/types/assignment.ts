export interface Assignment {
  id: string
  courseId: string
  courseTitle: string
  title: string
  description: string
  dueDate: string
  maxPoints: number
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface Submission {
  id: string
  assignmentId: string
  userId: string
  content: string // Text response or file URL
  submissionDate: string
  grade?: number
  feedback?: string
  status: 'SUBMITTED' | 'GRADED' | 'LATE'
}

export interface SubmitRequest {
  assignmentId: string
  content: string
}
