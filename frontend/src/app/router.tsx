import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AppLayout } from '@/app/AppLayout'
import { ProtectedRoute } from '@/app/ProtectedRoute'

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

function HomePage() {
  return <Navigate to="/dashboard" replace />
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      <div className="h-96 rounded-xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center text-slate-400">
        {title} Content Placeholder
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50" role="status" aria-live="polite">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      <span className="sr-only">Loading</span>
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Routes wrapped in AppLayout and ProtectedRoute */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <AppLayout>
                  <HomePage />
                </AppLayout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <MyLearningPage />
                </AppLayout>
              }
            />
            <Route
              path="/courses"
              element={
                <AppLayout>
                  <CourseListPage />
                </AppLayout>
              }
            />
            <Route
              path="/courses/:courseId"
              element={
                <AppLayout>
                  <CourseDetailPage />
                </AppLayout>
              }
            />
            <Route
              path="/courses/:courseId/lesson/:lessonId"
              element={<LessonPlayerPage />}
            />
            <Route
              path="/assignments"
              element={
                <AppLayout>
                  <AssignmentListPage />
                </AppLayout>
              }
            />
            <Route
              path="/assignments/:assignmentId"
              element={
                <AppLayout>
                  <AssignmentDetailPage />
                </AppLayout>
              }
            />

            {/* Instructor & Admin Only Routes */}
            <Route element={<ProtectedRoute requiredRoles={['INSTRUCTOR', 'ADMIN']} />}>
              <Route
                path="/analytics"
                element={
                  <AppLayout>
                    <AnalyticsDashboardPage />
                  </AppLayout>
                }
              />
            </Route>

            <Route
              path="/settings"
              element={
                <AppLayout>
                  <PlaceholderPage title="Settings" />
                </AppLayout>
              }
            />
            <Route
              path="/notifications"
              element={
                <AppLayout>
                  <NotificationPage />
                </AppLayout>
              }
            />
            <Route
              path="/pricing"
              element={
                <AppLayout>
                  <PricingPage />
                </AppLayout>
              }
            />
            <Route
              path="/payments/checkout/:intentId"
              element={
                <AppLayout>
                  <CheckoutPage />
                </AppLayout>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

