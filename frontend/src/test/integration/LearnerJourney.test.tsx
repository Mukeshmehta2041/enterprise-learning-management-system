import { screen, waitFor, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { renderWithProviders } from '../testUtils'
import { AppRoutes } from '@/app/router'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:3000/api/v1'

describe('Learner Journey', () => {
  it('should allow a learner to login, browse courses, and enroll', async () => {
    // 1. Render login page
    renderWithProviders(<AppRoutes />, { route: '/login', withAuth: true })

    // 2. Fill login form
    const emailInput = await screen.findByLabelText(/Email/i)
    fireEvent.change(emailInput, { target: { value: 'student@test.com' } })
    const passwordInput = await screen.findByLabelText(/Password/i)
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // 3. Submit login
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

    // 4. Verify login success and redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText(/My Learning/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    // 5. Navigate to courses page - using navigation instead of re-render
    const coursesLink = screen.getByRole('link', { name: /Courses/i })
    fireEvent.click(coursesLink)

    // 6. Verify course is listed
    await waitFor(() => {
      expect(screen.getByText(/Mock Course 1/i)).toBeInTheDocument()
    })

    // 7. Click on course to see details
    fireEvent.click(screen.getByText(/Mock Course 1/i))

    // 8. Verify course detail page
    await waitFor(() => {
      expect(screen.getByText(/Description 1/i)).toBeInTheDocument()
    })

    // 9. Enroll in course
    const enrollButton = screen.getByRole('button', { name: /Enroll Now/i })
    fireEvent.click(enrollButton)

    // 10. Verify enrollment success
    await waitFor(() => {
      expect(screen.getByText(/Enrolled/i)).toBeInTheDocument()
    })
  })

  it('should show error message on failed login', async () => {
    server.use(
      http.post(`${API_URL}/auth/token`, () => {
        return new HttpResponse(JSON.stringify({ message: 'Invalid email or password' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
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
