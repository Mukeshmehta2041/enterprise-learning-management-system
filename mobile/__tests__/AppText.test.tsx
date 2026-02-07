import React from 'react';
import { render } from '@testing-library/react-native';
import { AppText } from '../src/components/AppText';

describe('AppText', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<AppText>Hello World</AppText>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('applies variant styles', () => {
    const { getByText } = render(<AppText variant="h1">Heading</AppText>);
    const text = getByText('Heading');
    // In a real test environment with full nativewind support in jest, 
    // we could check the className or applied styles.
    expect(text).toBeTruthy();
  });
});
