import React from 'react'
import { render, fireEvent, waitFor } from './utils/test-utils'
import CourseDetailScreen from '../app/course/[id]'
import { apiClient } from '../src/api/client'
import { useRouter, useLocalSearchParams } from 'expo-router'

jest.mock('../src/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
  Stack: {
    Screen: jest.fn(() => null),
  },
}))

describe('CourseDetailScreen', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'course-1' })
  })

  it('navigates to lesson when a lesson is pressed', async () => {
    ;(apiClient.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/courses/')) {
        return Promise.resolve({
          data: {
            id: 'course-1',
            title: 'Test Course',
            description: 'Test Description',
            modules: [
              {
                id: 'mod-1',
                title: 'Module 1',
                lessons: [{ id: 'less-1', title: 'Lesson 1', type: 'VIDEO' }],
              },
            ],
          },
        })
      }
      if (url.includes('/enrollments')) {
        return Promise.resolve({ data: { items: [] } })
      }
      return Promise.reject(new Error('Not found'))
    })

    const { getByText } = render(<CourseDetailScreen />)

    await waitFor(() => {
      expect(getByText('Lesson 1')).toBeTruthy()
    })

    fireEvent.press(getByText('Lesson 1'))

    expect(mockPush).toHaveBeenCalledWith('/course/course-1/lesson/less-1')
  })
})
