import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { License, RpgBook, RpgSystem } from '@/types/rpg'
import { buildRpgIndex } from '@/utils/rpg'
import { setRpgIndex } from '@/services/rpgLoader'
import LicensesPage from './LicensesPage'
import LicenseDetailPage from './LicenseDetailPage'

const ogl: License = {
  slug: 'ogl',
  name: 'Open Game License',
  short_name: 'OGL',
  kind: 'license',
  holder: 'Wizards of the Coast',
  date: '2000',
  description: 'Qué es la OGL.\n\nQué permite.',
  links: [{ label: 'Texto legal', url: 'https://example.com/ogl' }],
  status_notes: [{ date: '2023-01-27', text: 'Se mantiene.', source: 'https://example.com/nota' }],
}
const srd: License = {
  ...ogl,
  slug: 'srd',
  name: 'System Reference Document',
  short_name: 'SRD',
  kind: 'reference_document',
  description: 'Qué es el SRD.\n\nQué trae.',
  status_notes: undefined,
  published_under: [{ license: 'ogl', since: '2003' }],
}
const unused: License = { ...ogl, slug: 'otra', name: 'Otra licencia', status_notes: undefined }
const system: RpgSystem = {
  slug: 'pathfinder-1e',
  name: 'Pathfinder 1E',
  family: 'pathfinder',
  publisher: 'Paizo',
  date: '2009-08',
  description: 'Qué es.\n\nCómo se juega.',
  features: ['d20'],
  licenses: [{ license: 'ogl', since: '2009' }],
  links: [{ label: 'Paizo', url: 'https://paizo.com' }],
}
const book: RpgBook = {
  slug: 'core-rulebook',
  system: 'pathfinder-1e',
  title: 'Core Rulebook',
  kind: 'core',
  core: true,
  description: 'Qué trae.\n\nPara quién es.',
  source: 'https://paizo.com',
  editions: [
    { language: 'english', publisher: 'Paizo', date: '2009-08' },
    { language: 'castellano', title: 'Reglamento básico', publisher: 'Devir', date: '2011' },
  ],
}

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/licencias" element={<LicensesPage />} />
        <Route path="/licencia/:slug" element={<LicenseDetailPage />} />
      </Routes>
    </MemoryRouter>
  )

describe('páginas de licencias', () => {
  beforeEach(() => setRpgIndex(buildRpgIndex([ogl, srd, unused], [system], [book])))

  it('el listado muestra cada licencia con su tipo, titular y sistemas que la usan', () => {
    renderAt('/licencias')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Licencias abiertas' })
    ).toBeInTheDocument()
    const card = screen.getByRole('link', { name: /Open Game License/ })
    expect(card).toHaveAttribute('href', '/licencia/ogl')
    expect(card).toHaveTextContent('Licencia')
    expect(card).toHaveTextContent('Wizards of the Coast · 2000')
    expect(card).toHaveTextContent('La usa 1 sistema')
    expect(screen.getByRole('link', { name: /Otra licencia/ })).toHaveTextContent(
      'Ningún sistema de la sección la usa directamente'
    )
  })

  it('la ficha muestra explicación, datos, notas, enlaces, sistemas y libros', () => {
    renderAt('/licencia/ogl')
    expect(screen.getByRole('heading', { level: 1, name: 'Open Game License' })).toBeInTheDocument()
    expect(screen.getByText('Qué es la OGL.')).toBeInTheDocument()
    expect(screen.getByText(/Se mantiene\./)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Texto legal' })).toHaveAttribute(
      'href',
      'https://example.com/ogl'
    )
    expect(screen.getByRole('link', { name: /Pathfinder 1E/ })).toHaveAttribute(
      'href',
      '/rol/pathfinder-1e'
    )
    expect(screen.getByRole('link', { name: 'Reglamento básico' })).toHaveAttribute(
      'href',
      '/rol/pathfinder-1e/core-rulebook'
    )
  })

  it('el documento de referencia y su licencia se enlazan en los dos sentidos', () => {
    renderAt('/licencia/srd')
    const related = screen.getByRole('heading', { name: 'Licencias relacionadas' }).parentElement!
    expect(within(related).getByRole('link', { name: 'Open Game License' })).toHaveAttribute(
      'href',
      '/licencia/ogl'
    )
    expect(screen.getByText(/OGL \(desde 2003\)/)).toBeInTheDocument()
    expect(screen.getByText(/Ningún sistema de la sección la usa directamente/)).toBeInTheDocument()
  })

  it('una licencia que no existe muestra la página de no encontrado', () => {
    renderAt('/licencia/no-existe')
    expect(screen.queryByRole('heading', { name: 'Datos' })).toBeNull()
    expect(screen.getByText(/no encontrad/i)).toBeInTheDocument()
  })
})
