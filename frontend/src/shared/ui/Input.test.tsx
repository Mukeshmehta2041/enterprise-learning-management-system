import { render, screen } from '@testing-library/react'
import { Input } from './Input'
import { describe, it, expect } from 'vitest'

describe('Input', () => {
  it('renders with label and id', () => {
    render(<Input label="Email" id="email-field" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email-field')
  })

  it('shows error message and sets aria-invalid', () => {
    render(<Input id="email" error="Required field" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Required field')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-describedby', 'email-error')
  })
})
