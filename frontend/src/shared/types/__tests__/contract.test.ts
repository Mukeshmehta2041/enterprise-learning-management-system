import { describe, it, expect } from 'vitest'
import { CourseSchema } from '../course'
import { UserSchema } from '../user'

describe('API Contract Validation', () => {
  it('should validate a valid course response', () => {
    const validCourse = {
      id: '1',
      title: 'Spring Boot Expert',
      description: 'Master Spring Boot',
      instructorId: 'inst-1',
      instructorName: 'John Doe',
      category: 'Backend',
      level: 'ADVANCED',
      price: 99.99,
      status: 'PUBLISHED',
      totalEnrollments: 100,
      rating: 4.8,
      duration: '10h',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    }

    const result = CourseSchema.safeParse(validCourse)
    expect(result.success).toBe(true)
  })

  it('should fail if critical field is missing in course', () => {
    const invalidCourse = {
      id: '1',
      title: 'Spring Boot Expert',
      // description missing
      instructorId: 'inst-1',
    }

    const result = CourseSchema.safeParse(invalidCourse)
    expect(result.success).toBe(false)
  })

  it('should validate a valid user response', () => {
    const validUser = {
      id: 'user-1',
      email: 'test@example.com',
      roles: ['STUDENT'],
      displayName: 'Test User'
    }

    const result = UserSchema.safeParse(validUser)
    expect(result.success).toBe(true)
  })
})
