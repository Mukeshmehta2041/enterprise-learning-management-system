import { screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { renderWithProviders } from '../testUtils'
import { AppRoutes } from '@/app/router'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:3000/api/v1'

describe('Learner Journey', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should show error message on failed login', async () => {
    server.use(
      http.post(`${API_URL}/auth/token`, () => {
        return HttpResponse.json(
          { message: 'Invalid email or password' },
          { status: 401 }
        )
      })
    )

    renderWithProviders(<AppRoutes />, { route: '/login', withAuth: true })

    const emailInput = await screen.findByLabelText(/Email/i)
    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } })
    const passwordInput = await screen.findByLabelText(/Password/i)
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument()
    })
  })
})
