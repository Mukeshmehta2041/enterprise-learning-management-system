import { screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderWithProviders } from '../testUtils'
import { AppRoutes } from '@/app/router'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:3000/api/v1'

describe('Instructor Journey', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should allow an instructor to view the analytics dashboard', async () => {
    // Set token to simulate being logged in
    localStorage.setItem('accessToken', 'mock-token')

    // Mock login for instructor
    server.use(
      http.get(`${API_URL}/users/me`, () => {
        return HttpResponse.json({
          id: 'inst-1',
          email: 'instructor@test.com',
          displayName: 'Test Instructor',
          roles: ['INSTRUCTOR'],
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      })
    )

    // Render app starting at analytics page
    renderWithProviders(<AppRoutes />, { route: '/analytics', withAuth: true })

    // Verify instructor can see the dashboard
    await waitFor(() => {
      expect(screen.getByText(/Instructor Analytics/i)).toBeInTheDocument()
    })

    // Verify stats are loaded
    expect(await screen.findByText(/1,250/)).toBeInTheDocument() // Total Students
    expect(await screen.findByText(/4,800/)).toBeInTheDocument() // Total Enrollments

    // Verify course performance table
    expect((await screen.findAllByText(/Introduction to Web Development/))[0]).toBeInTheDocument()
    expect((await screen.findAllByText(/Advanced React Patterns/))[0]).toBeInTheDocument()
  })

  it('should redirect a student away from analytics dashboard', async () => {
    // Set token to simulate being logged in
    localStorage.setItem('accessToken', 'mock-token')

    // Mock login for student (this is the default in handlers, but being explicit)
    server.use(
      http.get(`${API_URL}/users/me`, () => {
        return HttpResponse.json({
          id: 'user-1',
          email: 'student@test.com',
          displayName: 'Test Student',
          roles: ['STUDENT'],
          status: 'ACTIVE',
        })
      })
    )

    // Render app at analytics page
    renderWithProviders(<AppRoutes />, { route: '/analytics', withAuth: true })

    // Verify student is redirected (should show dashboard/mylearning instead of analytics)
    await waitFor(() => {
      expect(screen.queryByText(/Instructor Analytics/i)).not.toBeInTheDocument()
      expect(screen.getByText(/My Learning/i)).toBeInTheDocument()
    })
  })
})
