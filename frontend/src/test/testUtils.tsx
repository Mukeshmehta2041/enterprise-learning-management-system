import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/shared/context/AuthContext'
import { ToastProvider } from '@/shared/context/ToastContext'
import { UIProvider } from '@/shared/context/UIContext'
import { TenantProvider } from '@/shared/context/TenantContext'
import { NotificationProvider } from '@/features/notifications/context/NotificationContext'

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
      <TenantProvider>
        <UIProvider>
          <ToastProvider>
            <AuthProvider>
              <NotificationProvider>
                {withAuth ? (
                  <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
                ) : (
                  <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
                )}
              </NotificationProvider>
            </AuthProvider>
          </ToastProvider>
        </UIProvider>
      </TenantProvider>
    </QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper })
}
