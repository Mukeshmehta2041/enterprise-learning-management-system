import { screen } from '@testing-library/react'
import { AppLayout } from '@/app/AppLayout'
import { renderWithProviders } from '@/test/testUtils'

describe('AppLayout', () => {
  it('renders header and children', () => {
    renderWithProviders(
      <AppLayout>
        <div>Test content</div>
      </AppLayout>,
      { withAuth: true }
    )

    expect(screen.getAllByText('LMS Platform')[0]).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})

