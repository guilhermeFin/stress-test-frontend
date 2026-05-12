import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ComplianceFooter from '@/components/compliance/ComplianceFooter'

describe('ComplianceFooter', () => {
  it('renders default disclaimer text', () => {
    render(<ComplianceFooter />)
    expect(screen.getByText(/not constitute investment advice/i)).toBeTruthy()
  })

  it('renders custom text when provided', () => {
    render(<ComplianceFooter customText='Custom firm disclaimer.' />)
    expect(screen.getByText('Custom firm disclaimer.')).toBeTruthy()
  })

  it('renders compact variant without full disclaimer', () => {
    render(<ComplianceFooter compact />)
    expect(screen.getByText(/Not investment advice/i)).toBeTruthy()
  })
})
