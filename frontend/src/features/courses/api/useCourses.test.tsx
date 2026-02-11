import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import type { ReactNode } from 'react'
import { useCourses } from './useCourses'
import { createTestQueryClient } from '@/test/testUtils'
import { apiClient } from '@/shared/api/client'
import type { CourseFilters } from '@/shared/types/course'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

describe('useCourses', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('fetches courses with filters', async () => {
    const mockGet = apiClient.get as unknown as ReturnType<typeof vi.fn>
    mockGet.mockResolvedValue({
      data: {
        content: [],
        pageNumber: 0,
        pageSize: 9,
        totalElements: 0,
        totalPages: 0,
        last: true,
      },
    })

    const filters: CourseFilters = { page: 0, size: 9, search: '', category: '', level: '' }
    const filtersWithLimit = { ...filters, limit: 9 }
    const queryClient = createTestQueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useCourses(filters), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGet).toHaveBeenCalledWith('/courses', { params: filtersWithLimit })
  })
})
