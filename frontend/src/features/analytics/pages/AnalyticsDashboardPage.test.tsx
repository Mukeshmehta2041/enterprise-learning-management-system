import { screen, waitFor } from '@testing-library/react';
import { AnalyticsDashboardPage } from './AnalyticsDashboardPage';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '@/test/testUtils';

describe('AnalyticsDashboardPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderPage = () => {
    return renderWithProviders(<AnalyticsDashboardPage />, { withAuth: true });
  };

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
