export interface Enrollment {
  id: string
  userId: string
  courseId: string
  courseTitle: string
  courseThumbnailUrl?: string
  status: 'ENROLLED' | 'COMPLETED' | 'CANCELLED'
  progress: number // percentage 0-100
  lastAccessedAt: string
  enrolledAt: string
}

export interface EnrollRequest {
  courseId: string
}

export interface ProgressUpdate {
  enrollmentId: string
  lessonId: string
  status: 'STARTED' | 'COMPLETED'
}
