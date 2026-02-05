import { render, screen } from '@testing-library/react-native'
import { HomeScreen } from '../src/screens/HomeScreen'

describe('HomeScreen', () => {
  it('renders LMS Mobile heading', () => {
    render(<HomeScreen />)
    expect(screen.getByText('LMS Mobile')).toBeOnTheScreen()
  })
})

