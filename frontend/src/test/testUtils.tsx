import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/shared/context/AuthContext'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
}

interface RenderOptions {
  route?: string
  withAuth?: boolean
}

export function renderWithProviders(ui: ReactElement, options: RenderOptions = {}) {
  const { route = '/', withAuth = true } = options
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {withAuth ? (
        <AuthProvider>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </AuthProvider>
      ) : (
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      )}
    </QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper })
}
