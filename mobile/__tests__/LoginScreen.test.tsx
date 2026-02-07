import React from 'react';
import { render, fireEvent, waitFor } from './utils/test-utils';
import LoginScreen from '../app/(auth)/login';
import { apiClient } from '../src/api/client';
import { useAuthStore } from '../src/state/useAuthStore';
import { useRouter } from 'expo-router';

// Mock dependencies
jest.mock('../src/api/client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../src/state/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

describe('LoginScreen', () => {
  const mockReplace = jest.fn();
  const mockSetAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockSetAuth);
  });

  it('renders login form correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByPlaceholderText('you@example.com')).toBeTruthy();
    expect(getByPlaceholderText('••••••••')).toBeTruthy();
  });

  it('shows validation errors for empty fields', async () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(getByText('Invalid email address')).toBeTruthy();
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('successfully logs in and navigates to tabs', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: {
        user: { id: '1', email: 'test@example.com', fullName: 'Test User' },
        token: 'mock-token',
      },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('you@example.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'password123');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockSetAuth).toHaveBeenCalledWith(
        { id: '1', email: 'test@example.com', fullName: 'Test User' },
        'mock-token'
      );
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });
});
