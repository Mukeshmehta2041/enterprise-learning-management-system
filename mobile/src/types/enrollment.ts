export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  courseThumbnailUrl?: string;
  instructorName: string;
  enrolledAt: string;
  progress: number; // 0 to 100
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
  lastAccessedAt: string;
}

export interface EnrollmentProgress {
  enrollmentId: string;
  completedLessonIds: string[];
  lastLessonId: string;
  overallProgress: number;
}
