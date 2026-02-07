import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AppLayout } from '@/app/AppLayout'
import { ProtectedRoute } from '@/app/ProtectedRoute'
import { useAuth } from '@/shared/context/AuthContext'
import { NotificationProvider } from '@/features/notifications/context/NotificationContext'

// Lazy load feature components
const LoginPage = lazy(() => import('@/features/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/features/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const CourseListPage = lazy(() => import('@/features/courses/pages/CourseListPage').then(m => ({ default: m.CourseListPage })))
const CourseDetailPage = lazy(() => import('@/features/courses/pages/CourseDetailPage').then(m => ({ default: m.CourseDetailPage })))
const LessonPlayerPage = lazy(() => import('@/features/courses/pages/LessonPlayerPage').then(m => ({ default: m.LessonPlayerPage })))
const MyLearningPage = lazy(() => import('@/features/enrollments/pages/MyLearningPage').then(m => ({ default: m.MyLearningPage })))
const AssignmentListPage = lazy(() => import('@/features/assignments/pages/AssignmentListPage').then(m => ({ default: m.AssignmentListPage })))
const AssignmentDetailPage = lazy(() => import('@/features/assignments/pages/AssignmentDetailPage').then(m => ({ default: m.AssignmentDetailPage })))
const NotificationPage = lazy(() => import('@/features/notifications/pages/NotificationPage').then(m => ({ default: m.NotificationPage })))
const PricingPage = lazy(() => import('@/features/payments/pages/PricingPage').then(m => ({ default: m.PricingPage })))
const CheckoutPage = lazy(() => import('@/features/payments/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })))
const AnalyticsDashboardPage = lazy(() => import('@/features/analytics/pages/AnalyticsDashboardPage').then(m => ({ default: m.AnalyticsDashboardPage })))
const CourseCreatePage = lazy(() => import('@/features/courses/pages/instructor/CourseCreatePage').then(m => ({ default: m.CourseCreatePage })))
const CourseEditPage = lazy(() => import('@/features/courses/pages/instructor/CourseEditPage').then(m => ({ default: m.CourseEditPage })))
const InstructorCourseListPage = lazy(() => import('@/features/courses/pages/instructor/InstructorCourseListPage').then(m => ({ default: m.InstructorCourseListPage })))
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))

function HomePage() {
  const { user } = useAuth()

  if (user?.roles.includes('INSTRUCTOR')) {
    return <Navigate to="/analytics" replace />
  }

  if (user?.roles.includes('ADMIN')) {
    return <Navigate to="/analytics" replace />
  }

  return <Navigate to="/dashboard" replace />
}

// PlaceholderPage removed

function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50" role="status" aria-live="polite">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <span className="sr-only">Loading</span>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated Routes wrapped in AppLayout and ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route element={
            <NotificationProvider>
              <AppLayout />
            </NotificationProvider>
          }>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<MyLearningPage />} />
            <Route path="/courses" element={<CourseListPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/assignments" element={<AssignmentListPage />} />
            <Route path="/assignments/:assignmentId" element={<AssignmentDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/payments/checkout/:intentId" element={<CheckoutPage />} />

            {/* Instructor & Admin Only Routes */}
            <Route element={<ProtectedRoute requiredRoles={['INSTRUCTOR', 'ADMIN']} />}>
              <Route path="/analytics" element={<AnalyticsDashboardPage />} />
              <Route path="/instructor/courses" element={<InstructorCourseListPage />} />
              <Route path="/instructor/courses/new" element={<CourseCreatePage />} />
              <Route path="/instructor/courses/:courseId/edit" element={<CourseEditPage />} />
            </Route>
          </Route>

          {/* Special Routes (No AppLayout) */}
          <Route
            path="/courses/:courseId/lesson/:lessonId"
            element={
              <NotificationProvider>
                <LessonPlayerPage />
              </NotificationProvider>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

