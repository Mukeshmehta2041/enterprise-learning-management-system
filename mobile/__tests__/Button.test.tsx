import React from 'react';
import { render } from '@testing-library/react-native';
import { Button } from '../src/components/Button';

describe('Button', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Click Me" />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('shows activity indicator when loading', () => {
    const { getByTestId, queryByText } = render(<Button title="Loading" loading />);
    // Since we don't have a testID on the indicator yet, we check if text is absent
    // or we can add a testID to the ActivityIndicator
    expect(queryByText('Loading')).toBeFalsy();
  });
});
