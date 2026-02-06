import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import { AuthProvider } from '@/shared/context/AuthContext'
import { LoginPage } from '@/features/auth/LoginPage'
import { CourseListPage } from '@/features/courses/pages/CourseListPage'
import { CourseDetailPage } from '@/features/courses/pages/CourseDetailPage'
import { LessonPlayerPage } from '@/features/courses/pages/LessonPlayerPage'
import { ProtectedRoute } from '@/app/ProtectedRoute'
import { createTestQueryClient } from '@/test/testUtils'
import { apiClient } from '@/shared/api/client'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('Learner journey', () => {
  afterEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('allows login, browsing, enrollment, and viewing content', async () => {
    const now = new Date().toISOString()
    const user = {
      id: 'user-1',
      email: 'learner@example.com',
      firstName: 'Learner',
      lastName: 'One',
      roles: ['LEARNER'],
    }
    const course = {
      id: 'course-1',
      title: 'React Basics',
      description: 'Learn the fundamentals of React.',
      instructorId: 'inst-1',
      instructorName: 'Jane Instructor',
      category: 'PROGRAMMING',
      level: 'BEGINNER',
      price: 49,
      status: 'PUBLISHED',
      totalEnrollments: 120,
      rating: 4.6,
      duration: '2h',
      createdAt: now,
      updatedAt: now,
    }
    const courseDetail = {
      ...course,
      modules: [
        {
          id: 'module-1',
          title: 'Getting Started',
          order: 1,
          lessons: [
            {
              id: 'lesson-1',
              title: 'Welcome',
              order: 1,
              contentType: 'VIDEO',
              duration: '5m',
              description: 'Intro lesson',
              contentUrl: 'https://example.com/video',
            },
          ],
        },
      ],
    }
    const enrollment = {
      id: 'enroll-1',
      userId: user.id,
      courseId: course.id,
      courseTitle: course.title,
      courseThumbnailUrl: course.thumbnailUrl,
      status: 'ENROLLED',
      progress: 0,
      lastAccessedAt: now,
      enrolledAt: now,
    }

    let enrolled = false

    const mockGet = apiClient.get as unknown as ReturnType<typeof vi.fn>
    const mockPost = apiClient.post as unknown as ReturnType<typeof vi.fn>

    mockGet.mockImplementation((url: string) => {
      if (url === '/users/me') {
        return Promise.resolve({ data: user })
      }
      if (url === '/courses') {
        return Promise.resolve({
          data: {
            content: [course],
            pageNumber: 0,
            pageSize: 9,
            totalElements: 1,
            totalPages: 1,
            last: true,
          },
        })
      }
      if (url === `/courses/${course.id}`) {
        return Promise.resolve({ data: courseDetail })
      }
      if (url === `/enrollments/course/${course.id}`) {
        if (!enrolled) {
          return Promise.reject({ response: { status: 404 } })
        }
        return Promise.resolve({ data: enrollment })
      }
      return Promise.reject(new Error('Not found'))
    })

    mockPost.mockImplementation((url: string) => {
      if (url === '/auth/token') {
        return Promise.resolve({
          data: {
            access_token: 'token',
            token_type: 'bearer',
            expires_in: 3600,
          },
        })
      }
      if (url === '/enrollments') {
        enrolled = true
        return Promise.resolve({ data: enrollment })
      }
      return Promise.reject(new Error('Not found'))
    })

    const queryClient = createTestQueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<CourseListPage />} />
                <Route path="/courses/:courseId" element={<CourseDetailPage />} />
                <Route path="/courses/:courseId/lesson/:lessonId" element={<LessonPlayerPage />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    )

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'learner@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/courses/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: /react basics/i }))

    const enrollButton = await screen.findByRole('button', { name: /enroll now/i })
    fireEvent.click(enrollButton)

    await waitFor(() => expect(mockPost).toHaveBeenCalledWith('/enrollments', { courseId: course.id }))

    const continueButton = await screen.findByRole('button', { name: /continue learning/i })
    fireEvent.click(continueButton)

    expect(await screen.findByText(/video player placeholder/i)).toBeInTheDocument()
  })
})
