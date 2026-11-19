import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from './Footer'

describe('Footer', () => {
  it('enlaza al feed de novedades', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /Novedades \(RSS\)/ })).toHaveAttribute(
      'href',
      '/feed.xml'
    )
  })
})
