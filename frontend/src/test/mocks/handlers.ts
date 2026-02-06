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
      status: 'ENROLLED',
      progress: 0,
      lastAccessedAt: new Date().toISOString(),
      enrolledAt: new Date().toISOString(),
    }, { status: 201 })
  }),
]
