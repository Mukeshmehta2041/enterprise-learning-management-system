import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:3000/api/v1' // This should match what's used in tests

export const handlers = [
  http.post(`${API_URL}/auth/token`, async ({ request }) => {
    return HttpResponse.json({
      access_token: 'mock-token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
    })
  }),

  http.get(`${API_URL}/users/me`, () => {
    return HttpResponse.json({
      id: 'user-1',
      email: 'student@test.com',
      displayName: 'Test Student',
      roles: ['STUDENT'],
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }),

  http.get(`${API_URL}/courses`, () => {
    return HttpResponse.json({
      content: [
        {
          id: 'course-1',
          title: 'Mock Course 1',
          description: 'Description 1',
          instructorId: 'inst-1',
          instructorName: 'Instructor 1',
          category: 'Development',
          level: 'BEGINNER',
          price: 99.99,
          status: 'PUBLISHED',
          totalEnrollments: 10,
          rating: 4.5,
          duration: '5h',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          modules: [],
        },
      ],
      totalElements: 1,
      totalPages: 1,
      size: 10,
      number: 0,
    })
  }),

  http.get(`${API_URL}/courses/course-1`, () => {
    return HttpResponse.json({
      id: 'course-1',
      title: 'Mock Course 1',
      description: 'Description 1',
      instructorId: 'inst-1',
      instructorName: 'Instructor 1',
      category: 'Development',
      level: 'BEGINNER',
      price: 99.99,
      status: 'PUBLISHED',
      totalEnrollments: 10,
      rating: 4.5,
      duration: '5h',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modules: [
        {
          id: 'mod-1',
          title: 'Module 1',
          order: 1,
          lessons: [
            { id: 'less-1', title: 'Lesson 1', order: 1, contentType: 'VIDEO' }
          ]
        }
      ],
    })
  }),

  http.get(`${API_URL}/enrollments`, () => {
    return HttpResponse.json({
      items: [],
      nextCursor: null
    })
  }),

  http.get(`${API_URL}/enrollments/course/course-1`, () => {
    return new HttpResponse(null, { status: 404 })
  }),

  http.get(`${API_URL}/notifications`, () => {
    return HttpResponse.json([])
  }),

  http.post(`${API_URL}/enrollments`, () => {
    return HttpResponse.json({
      id: 'enroll-1',
      userId: 'user-1',
      courseId: 'course-1',
      courseTitle: 'Introduction to Web Development',
      status: 'ENROLLED',
      progress: 0,
      lastAccessedAt: new Date().toISOString(),
      enrolledAt: new Date().toISOString(),
    }, { status: 201 })
  }),

  // Analytics
  http.get(`${API_URL}/analytics/global`, () => {
    return HttpResponse.json({
      totalStudents: 1250,
      totalCourses: 24,
      totalEnrollments: 4800,
      totalRevenue: 125000,
      activeLearnersLast30Days: 850
    })
  }),

  http.get(`${API_URL}/analytics/courses`, () => {
    return HttpResponse.json([
      {
        courseId: 'course-1',
        courseTitle: 'Introduction to Web Development',
        totalEnrollments: 450,
        completionRate: 65,
        averageRating: 4.8,
        revenue: 45000
      },
      {
        courseId: 'course-2',
        courseTitle: 'Advanced React Patterns',
        totalEnrollments: 285,
        completionRate: 42,
        averageRating: 4.6,
        revenue: 32000
      },
      {
        courseId: 'course-3',
        courseTitle: 'System Design for Beginners',
        totalEnrollments: 120,
        completionRate: 30,
        averageRating: 4.2,
        revenue: 12000
      }
    ])
  }),

  http.get(`${API_URL}/analytics/trends`, () => {
    return HttpResponse.json([
      { date: '2026-01-20', count: 12 },
      { date: '2026-01-21', count: 18 },
      { date: '2026-01-22', count: 15 },
      { date: '2026-01-23', count: 25 },
      { date: '2026-01-24', count: 32 },
      { date: '2026-01-25', count: 28 },
      { date: '2026-01-26', count: 45 },
      { date: '2026-01-27', count: 38 },
      { date: '2026-01-28', count: 52 },
      { date: '2026-01-29', count: 48 },
      { date: '2026-01-30', count: 65 }
    ])
  }),
]
