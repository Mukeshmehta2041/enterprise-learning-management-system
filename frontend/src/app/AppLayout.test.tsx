import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppLayout } from '@/app/AppLayout'
import { AuthProvider } from '@/shared/context/AuthContext'

describe('AppLayout', () => {
  it('renders header and children', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <AppLayout>
            <div>Test content</div>
          </AppLayout>
        </MemoryRouter>
      </AuthProvider>,
    )

    expect(screen.getByText('LMS Portal')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
})

