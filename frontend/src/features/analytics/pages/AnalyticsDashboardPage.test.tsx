import { render, screen, waitFor } from '@testing-library/react';
import { AnalyticsDashboardPage } from './AnalyticsDashboardPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthContext, type AuthContextType } from '@/shared/context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const mockAuthContext: AuthContextType = {
  user: {
    id: '1',
    email: 'instructor@example.com',
    displayName: 'Instructor',
    roles: ['INSTRUCTOR']
  },
  token: 'mock-token',
  isAuthenticated: true,
  isLoading: false,
  login: async () => { },
  logout: () => { },
};

describe('AnalyticsDashboardPage', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  const renderPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={mockAuthContext}>
          <MemoryRouter>
            <AnalyticsDashboardPage />
          </MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>
    );
  };

  it('renders metric cards', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Total Students')).toBeDefined();
      expect(screen.getByText('1,250')).toBeDefined();
      expect(screen.getByText('Total Revenue')).toBeDefined();
      expect(screen.getByText('$125,000')).toBeDefined();
    });
  });

  it('renders charts', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Enrollment Trends')).toBeDefined();
      expect(screen.getByText('Course Revenue')).toBeDefined();
    });
  });

  it('renders course performance table', async () => {
    renderPage();

    await waitFor(() => {
      // Appears in both dropdown and table
      expect(screen.getAllByText('Introduction to Web Development').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Advanced React Patterns').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows export button', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Export CSV')).toBeDefined();
    });
  });
});
