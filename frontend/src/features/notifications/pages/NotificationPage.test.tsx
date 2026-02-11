import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotificationPage } from './NotificationPage';
import { useNotifications, useMarkAsRead } from '../api/notificationHooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Mock the hooks
vi.mock('../api/notificationHooks', () => ({
  useNotifications: vi.fn(),
  useMarkAsRead: vi.fn(),
}));

const mockedUseNotifications = vi.mocked(useNotifications);
const mockedUseMarkAsRead = vi.mocked(useMarkAsRead);

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('NotificationPage', () => {
  const mockNotifications = [
    {
      id: '1',
      title: 'Course Enrollment',
      message: 'You have enrolled in Java Basics',
      type: 'ENROLLMENT',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'System Update',
      message: 'Service will be down for 5 mins',
      type: 'INFO',
      read: true,
      createdAt: new Date().toISOString(),
    },
  ];

  it('renders notifications correctly', () => {
    mockedUseNotifications.mockReturnValue({
      data: mockNotifications,
      isLoading: false,
    } as any);
    mockedUseMarkAsRead.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any);

    render(<NotificationPage />, { wrapper });

    expect(screen.getByText('Course Enrollment')).toBeInTheDocument();
    expect(screen.getByText('System Update')).toBeInTheDocument();
    expect(screen.getByText('You have enrolled in Java Basics')).toBeInTheDocument();
  });

  it('filters notifications by unread', () => {
    mockedUseNotifications.mockReturnValue({
      data: mockNotifications,
      isLoading: false,
    } as any);

    render(<NotificationPage />, { wrapper });

    const unreadChip = screen.getByText(/Unread/);
    fireEvent.click(unreadChip);

    expect(screen.getByText('Course Enrollment')).toBeInTheDocument();
    expect(screen.queryByText('System Update')).not.toBeInTheDocument();
  });

  it('shows empty state when no results match', () => {
    mockedUseNotifications.mockReturnValue({
      data: mockNotifications,
      isLoading: false,
    } as any);

    render(<NotificationPage />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/Search notifications/);
    fireEvent.change(searchInput, { target: { value: 'non-existent' } });

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});
