import { useGlobalStats, useCourseAnalytics, useEnrollmentTrends } from '../api/analyticsHooks';
import { Card, PageHeader, Container } from '@/shared/ui/Layout';
import { Users, BookOpen, GraduationCap, DollarSign, TrendingUp, Filter, Calendar, FileText, Star } from 'lucide-react';
import { TextMuted, TextSmall } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui';
import { useState } from 'react';
import { CSVLink } from 'react-csv';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

export function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const { data: globalStats, isLoading: isGlobalLoading } = useGlobalStats();
  const { data: courseStats, isLoading: isCourseLoading } = useCourseAnalytics({
    courseId: selectedCourse || undefined,
  });
  const { data: trends, isLoading: isTrendLoading } = useEnrollmentTrends();

  if (isGlobalLoading || isCourseLoading || isTrendLoading) {
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
          <div className="flex gap-2">
            <CSVLink
              data={courseStats || []}
              filename={`course-analytics-${new Date().toISOString().split('T')[0]}.csv`}
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Export CSV
            </CSVLink>
          </div>
        }
      />

      {/* Filters */}
      <Card className="mb-8 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <label htmlFor="course-filter" className="text-sm font-medium text-slate-700">Filter by Course:</label>
          </div>

          <select
            id="course-filter"
            className="text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {courseStats?.map(course => (
              <option key={course.courseId} value={course.courseId}>{course.courseTitle}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 ml-auto">
            <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <label htmlFor="start-date" className="sr-only">Start Date</label>
            <input
              id="start-date"
              type="date"
              className="text-sm border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <span className="text-slate-400">to</span>
            <label htmlFor="end-date" className="sr-only">End Date</label>
            <input
              id="end-date"
              type="date"
              className="text-sm border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>
      </Card>

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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card title="Enrollment Trends" description="Daily enrollment counts over time.">
          <div className="h-[300px] w-full pt-4" role="img" aria-label="Line chart showing enrollment trends over the selected period.">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#4f46e5' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Course Revenue" description="Revenue breakdown by course.">
          <div className="h-[300px] w-full pt-4" role="img" aria-label="Bar chart showing revenue per course.">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="courseTitle"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                  hide
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {courseStats?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
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
