import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import type { ReactNode } from 'react'
import { useEnrollments } from './useEnrollments'
import { createTestQueryClient } from '@/test/testUtils'
import { apiClient } from '@/shared/api/client'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('useEnrollments', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('fetches enrollments list', async () => {
    const mockGet = apiClient.get as unknown as ReturnType<typeof vi.fn>
    mockGet.mockResolvedValue({ data: [] })

    const queryClient = createTestQueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useEnrollments(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGet).toHaveBeenCalledWith('/enrollments')
  })
})
