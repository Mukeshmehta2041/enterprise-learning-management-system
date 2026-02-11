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

  it('renders metric cards', async () => {
    renderPage();

    // Use findBy to wait for loading to finish and elements to appear
    expect(await screen.findByText('Total Students')).toBeInTheDocument();
    expect(await screen.findByText(/1,250/)).toBeInTheDocument();
    expect(await screen.findByText('Total Revenue')).toBeInTheDocument();
    expect(await screen.findByText(/\$125,000/)).toBeInTheDocument();
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
