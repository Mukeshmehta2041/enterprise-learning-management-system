import { fireEvent, screen } from '@testing-library/react'
import { LoginPage } from './LoginPage'
import { renderWithProviders } from '@/test/testUtils'

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows validation errors for empty submit', async () => {
    renderWithProviders(<LoginPage />)

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument()
    expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
  })
})
