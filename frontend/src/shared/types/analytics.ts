export interface GlobalStats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  activeLearnersLast30Days: number;
}

export interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
  completionRate: number; // 0 to 100
  averageRating: number;
  revenue: number;
}

export interface EnrollmentTrend {
  date: string;
  count: number;
}

export interface AnalyticsFilter {
  courseId?: string;
  startDate?: string;
  endDate?: string;
}
