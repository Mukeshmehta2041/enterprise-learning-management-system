import React from 'react'
import { render, waitFor } from './utils/test-utils'
import CoursesScreen from '../app/(tabs)/courses'
import { apiClient } from '../src/api/client'

jest.mock('../src/api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}))

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

describe('CoursesScreen', () => {
  it('loads and displays courses', async () => {
    ;(apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: {
        items: [
          {
            id: '1',
            title: 'React Native for Beginners',
            instructorName: 'John Doe',
            thumbnailUrl: 'https://example.com/thumb.jpg',
            price: 0,
            level: 'BEGINNER',
          },
        ],
      },
    })

    const { getByText } = render(<CoursesScreen />)

    await waitFor(() => {
      expect(getByText('React Native for Beginners')).toBeTruthy()
      expect(getByText('John Doe')).toBeTruthy()
    })
  })

  it('shows empty state when no courses are found', async () => {
    ;(apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: { items: [] },
    })

    const { getByText } = render(<CoursesScreen />)

    await waitFor(() => {
      expect(getByText('No courses found')).toBeTruthy()
    })
  })
})
