import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GuidesPage from './GuidesPage'
import { GUIDES, GUIDE_GROUPS } from './guides/guides'

describe('página de guías', () => {
  it('cada tipo tiene al menos una guía', () => {
    for (const { id } of GUIDE_GROUPS) {
      expect(GUIDES.some((guide) => guide.group === id)).toBe(true)
    }
  })

  it('agrupa las guías por tipo, con un enlace a cada tipo', () => {
    render(
      <MemoryRouter>
        <GuidesPage />
      </MemoryRouter>
    )
    const nav = screen.getByRole('navigation', { name: 'Tipos de guía' })
    for (const { id, label } of GUIDE_GROUPS) {
      expect(within(nav).getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
      const section = screen.getByRole('heading', { level: 2, name: label }).closest('section')!
      const guides = GUIDES.filter((guide) => guide.group === id)
      expect(within(section).getAllByRole('link')).toHaveLength(guides.length)
    }
  })
})
