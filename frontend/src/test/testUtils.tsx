import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/shared/context/AuthContext'
import { ToastProvider } from '@/shared/context/ToastContext'

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
      <ToastProvider>
        {withAuth ? (
          <AuthProvider>
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
          </AuthProvider>
        ) : (
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        )}
      </ToastProvider>
    </QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper })
}
