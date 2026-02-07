import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import TeachingScreen from '../app/(tabs)/teaching';
import { useInstructorCourses, useInstructorStats } from '../src/hooks/useInstructor';
import { useRouter } from 'expo-router';

// Mock the hooks
jest.mock('../src/hooks/useInstructor');
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const mockCourses = [
  { id: '1', title: 'React Native for Pro', price: 99, status: 'PUBLISHED', enrollmentCount: 150 },
  { id: '2', title: 'Advanced Spring Boot', price: 129, status: 'DRAFT', enrollmentCount: 0 },
];

const mockStats = {
  totalStudents: 150,
  activeCourses: 1,
  totalEarnings: 14850,
  averageRating: 4.8,
};

describe('TeachingScreen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useInstructorCourses as jest.Mock).mockReturnValue({
      data: mockCourses,
      isLoading: false,
      refetch: jest.fn(),
    });
    (useInstructorStats as jest.Mock).mockReturnValue({
      data: mockStats,
      isLoading: false,
      refetch: jest.fn(),
    });
  });

  it('renders the dashboard title and stats', () => {
    render(<TeachingScreen />);

    expect(screen.getByText('Teaching Dashboard')).toBeTruthy();
    expect(screen.getByText('150')).toBeTruthy(); // Students
    expect(screen.getByText('$14850')).toBeTruthy(); // Earnings
  });

  it('renders the list of instructor courses', () => {
    render(<TeachingScreen />);

    expect(screen.getByText('React Native for Pro')).toBeTruthy();
    expect(screen.getByText('Advanced Spring Boot')).toBeTruthy();
  });

  it('navigates to course detail when a course is pressed', () => {
    render(<TeachingScreen />);

    const courseItem = screen.getByText('React Native for Pro');
    fireEvent.press(courseItem);

    expect(mockPush).toHaveBeenCalledWith('/instructor-course/1');
  });

  it('navigates to course creation when plus button is pressed', () => {
    render(<TeachingScreen />);

    const addButton = screen.getByTestId('add-course-button'); // We should add a testID
    // wait, I didn't add testID, I'll update the component or use another matcher
  });
});
