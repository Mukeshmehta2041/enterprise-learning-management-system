import { useGlobalStats, useCourseAnalytics } from '../api/analyticsHooks';
import { Card, PageHeader, Container } from '@/shared/ui/Layout';
import { Users, BookOpen, GraduationCap, DollarSign, TrendingUp, Star } from 'lucide-react';
import { TextMuted, TextSmall } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui';

export function AnalyticsDashboardPage() {
  const { data: globalStats, isLoading: isGlobalLoading } = useGlobalStats();
  const { data: courseStats, isLoading: isCourseLoading } = useCourseAnalytics();

  if (isGlobalLoading || isCourseLoading) {
    return <div className="p-8 text-center text-slate-500">Loading analytics data...</div>;
  }

  const metrics = [
    {
      title: 'Total Students',
      value: globalStats?.totalStudents.toLocaleString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Courses',
      value: globalStats?.totalCourses.toLocaleString() || '0',
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Total Enrollments',
      value: globalStats?.totalEnrollments.toLocaleString() || '0',
      icon: GraduationCap,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Revenue',
      value: `$${globalStats?.totalRevenue.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <Container>
      <PageHeader
        title="Instructor Analytics"
        description="Monitor your courses performance and student engagement."
        actions={
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`${metric.bgColor} p-3 rounded-lg`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div>
                <TextMuted className="text-xs font-medium uppercase tracking-wider">{metric.title}</TextMuted>
                <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center text-emerald-600 gap-1">
              <TrendingUp className="h-3 w-3" />
              <TextSmall className="font-medium text-emerald-600">+12% from last month</TextSmall>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Performance Table */}
        <Card className="lg:col-span-2" title="Course Performance" description="Summary of your most popular courses.">
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-100">
                <tr>
                  <th className="px-6 py-3 font-medium">Course Title</th>
                  <th className="px-6 py-3 font-medium text-center">Enrollments</th>
                  <th className="px-6 py-3 font-medium text-center">Completion</th>
                  <th className="px-6 py-3 font-medium text-center">Rating</th>
                  <th className="px-6 py-3 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!courseStats || courseStats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No course data available yet.
                    </td>
                  </tr>
                ) : (
                  courseStats.map((course) => (
                    <tr key={course.courseId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{course.courseTitle}</td>
                      <td className="px-6 py-4 text-center">{course.totalEnrollments}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full"
                              style={{ width: `${course.completionRate}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600">{course.completionRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-slate-700 font-medium">{course.averageRating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-900">
                        ${course.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Trends / Activity */}
        <div className="space-y-6">
          <Card title="Student Engagement" description="Active learners in the last 30 days.">
            <div className="flex flex-col items-center py-4">
              <div className="text-5xl font-extrabold text-indigo-600">
                {globalStats?.activeLearnersLast30Days || 0}
              </div>
              <TextMuted className="mt-2 text-center">
                Learners are consistently engaging with your content.
              </TextMuted>
            </div>
          </Card>

          <Card title="Quick Actions">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-left font-normal h-auto py-3">
                <div>
                  <div className="font-medium">Create Announcement</div>
                  <div className="text-xs text-slate-500">Notify all enrolled students.</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left font-normal h-auto py-3">
                <div>
                  <div className="font-medium">Review Assignments</div>
                  <div className="text-xs text-slate-500">12 submissions pending review.</div>
                </div>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
