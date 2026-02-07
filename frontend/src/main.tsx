import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/shared/context/AuthContext'
import { ToastProvider } from '@/shared/context/ToastContext'
import { UIProvider } from '@/shared/context/UIContext'
import { TenantProvider } from '@/shared/context/TenantContext'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import './index.css'
import App from '@/App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TenantProvider>
          <AuthProvider>
            <ToastProvider>
              <UIProvider>
                <App />
              </UIProvider>
            </ToastProvider>
          </AuthProvider>
        </TenantProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
