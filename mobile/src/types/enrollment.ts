export interface Enrollment {
  id: string
  userId: string
  courseId: string
  courseTitle: string
  courseThumbnailUrl?: string
  instructorName: string
  enrolledAt: string
  progress: number // 0 to 100
  status: 'ENROLLED' | 'IN_PROGRESS' | 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'PENDING_PAYMENT'
  lastAccessedAt: string
  completedLessonIds?: string[]
  lessonPositions?: Record<string, number>
}

export interface EnrollmentProgress {
  enrollmentId: string
  completedLessonIds: string[]
  lastLessonId: string
  overallProgress: number
}
