import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NovelBestseller from './NovelBestseller'

const source = 'https://www.hawes.com/1992/1992-09-27.pdf'

describe('NovelBestseller', () => {
  it('muestra la lista de tapa dura con el mes y enlaza a la fuente en una pestaña nueva', () => {
    render(<NovelBestseller bestseller={{ list: 'hardcover', date: '1992-09-27', source }} />)
    const link = screen.getByRole('link')
    expect(link).toHaveTextContent(
      'Superventas de The New York Times · septiembre de 1992 (tapa dura)'
    )
    expect(link).toHaveAttribute('href', source)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('distingue la lista de bolsillo', () => {
    render(<NovelBestseller bestseller={{ list: 'paperback', date: '1985-01-13', source }} />)
    expect(screen.getByRole('link')).toHaveTextContent('enero de 1985 (bolsillo)')
  })
})
