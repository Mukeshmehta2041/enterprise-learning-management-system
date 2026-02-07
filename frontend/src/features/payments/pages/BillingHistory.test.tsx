import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BillingHistory } from '../components/BillingHistory';
import { usePaymentHistory } from '../api/paymentHooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hook
vi.mock('../api/paymentHooks', () => ({
  usePaymentHistory: vi.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('BillingHistory', () => {
  it('renders loading state', () => {
    (usePaymentHistory as any).mockReturnValue({
      isLoading: true,
    });

    render(<BillingHistory />, { wrapper });
    // Should have some pulse elements or similar
    expect(screen.queryByText('Billing History')).not.toBeInTheDocument();
  });

  it('renders empty state when no history', () => {
    (usePaymentHistory as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<BillingHistory />, { wrapper });
    expect(screen.getByText('No transactions found')).toBeInTheDocument();
  });

  it('renders transaction data', () => {
    (usePaymentHistory as any).mockReturnValue({
      data: [
        {
          id: 'tx_1',
          planId: 'PRO_MONTHLY',
          amount: 29.00,
          currency: 'USD',
          status: 'SUCCESS',
          createdAt: '2026-01-01T10:00:00Z',
        }
      ],
      isLoading: false,
    });

    render(<BillingHistory />, { wrapper });
    expect(screen.getByText('PRO MONTHLY')).toBeInTheDocument();
    expect(screen.getByText('$29.00 USD')).toBeInTheDocument();
    expect(screen.getByText('PAID')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (usePaymentHistory as any).mockReturnValue({
      isError: true,
      isLoading: false,
    });

    render(<BillingHistory />, { wrapper });
    expect(screen.getByText('Failed to load billing history')).toBeInTheDocument();
  });
});
