import { describe, it, expect, beforeAll } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { ScreenWork } from '@/types/screen'
import { enrichScreenWork } from '@/services/screenLoader'
import { loadNovelIndex } from '@/services/novelLoader'
import ScreenDetail from '@/components/screen/ScreenDetail'
import { expectAffiliateNotices } from '@/test/affiliate'
import ScreenPage from './ScreenPage'
import ScreenDetailPage from './ScreenDetailPage'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/cine-y-series" element={<ScreenPage />} />
        <Route path="/cine-y-series/:slug" element={<ScreenDetailPage />} />
      </Routes>
    </MemoryRouter>
  )

const base: ScreenWork = {
  slug: 'obra',
  kind: 'film',
  official: true,
  title: 'Obra',
  description: 'Primer párrafo.\n\nSegundo párrafo.',
  status: 'released',
}

const renderWork = (extra: Partial<ScreenWork>) =>
  render(
    <MemoryRouter>
      <ScreenDetail work={enrichScreenWork({ ...base, ...extra })} />
    </MemoryRouter>
  )

beforeAll(async () => {
  await loadNovelIndex()
})

describe('ScreenPage', () => {
  it('muestra primero las obras oficiales y aparte las no oficiales con su criterio', () => {
    renderAt('/cine-y-series')
    const official = screen.getByRole('region', { name: 'Oficiales' })
    const unofficial = screen.getByRole('region', { name: 'No oficiales' })
    expect(within(official).getByRole('link', { name: /Honor entre ladrones/ })).toBeInTheDocument()
    expect(within(official).queryByRole('link', { name: /Blackmoor/ })).toBeNull()
    expect(within(unofficial).getByRole('link', { name: /Blackmoor/ })).toBeInTheDocument()
    expect(within(unofficial).getByText(/tema principal es D&D/)).toBeInTheDocument()
    expect(
      official.compareDocumentPosition(unofficial) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('la tarjeta enlaza a la ficha con el título en España, el tipo, el año y el castellano', () => {
    renderAt('/cine-y-series')
    const card = screen.getByRole('link', { name: /Honor entre ladrones/ })
    expect(card).toHaveAttribute('href', '/cine-y-series/dungeons-and-dragons-honor-among-thieves')
    expect(card).toHaveTextContent('Película · 2023')
    expect(card).toHaveTextContent('En castellano')
  })

  it('filtra por tipo y omite el bloque que se queda vacío', () => {
    renderAt('/cine-y-series')
    fireEvent.click(screen.getByRole('radio', { name: 'Series' }))
    expect(screen.getByRole('link', { name: /Dragones y mazmorras/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Honor entre ladrones/ })).toBeNull()
    // Los episodios sueltos del catálogo son todos oficiales
    fireEvent.click(screen.getByRole('radio', { name: 'Episodios' }))
    expect(screen.getByRole('link', { name: /La cuna de la reina/ })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'No oficiales' })).toBeNull()
  })

  it('filtra las obras en castellano', () => {
    renderAt('/cine-y-series')
    fireEvent.click(screen.getByRole('checkbox', { name: 'Solo en castellano' }))
    expect(screen.queryByRole('link', { name: /Blackmoor/ })).toBeNull()
    expect(screen.getByRole('link', { name: /Honor entre ladrones/ })).toBeInTheDocument()
  })
})

describe('ScreenDetailPage', () => {
  it('muestra la película con sus títulos, estrenos, ediciones y enlaces externos', () => {
    const { container } = renderAt('/cine-y-series/dungeons-and-dragons-honor-among-thieves')
    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Dungeons & Dragons: Honor entre ladrones',
    })
    expect(heading.parentElement!.nextElementSibling).toHaveTextContent(
      'Dungeons & Dragons: Honor Among Thieves'
    )
    expect(screen.queryByText('No oficial')).toBeNull()
    const releases = container.querySelector<HTMLElement>('#estrenos')!
    expect(within(releases).getByText('EE. UU.')).toBeInTheDocument()
    expect(within(releases).getByText('España')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Comprar en Amazon/ }).length).toBeGreaterThan(0)
    expectAffiliateNotices()
    expect(screen.getByRole('link', { name: /IMDb/ })).toHaveAttribute(
      'href',
      'https://www.imdb.com/title/tt2906216/'
    )
    expect(screen.getByRole('link', { name: /FilmAffinity/ })).toBeInTheDocument()
  })

  it('enlaza a sus novelas y artículos de merchandising', () => {
    const { container } = renderAt('/cine-y-series/dungeons-and-dragons-honor-among-thieves')
    const related = container.querySelector<HTMLElement>('#relacionado')!
    const hrefs = within(related)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
    expect(hrefs).toContain('/novela/the-druids-call')
    expect(hrefs).toContain('/merchandising/funko-pop-honor-among-thieves')
  })

  it('pone primero el tráiler en castellano y no carga YouTube hasta reproducir', () => {
    const { container } = renderAt('/cine-y-series/dungeons-and-dragons-honor-among-thieves')
    const trailers = container.querySelector<HTMLElement>('#traileres')!
    const captions = within(trailers)
      .getAllByRole('figure')
      .map((figure) => figure.textContent)
    expect(captions[0]).toMatch(/En castellano/)
    expect(captions[1]).toMatch(/Versión original en inglés/)
    expect(container.querySelector('iframe')).toBeNull()
    fireEvent.click(within(trailers).getAllByRole('link', { name: /Reproducir/ })[0])
    expect(container.querySelector('iframe')?.getAttribute('src')).toMatch(
      /^https:\/\/www\.youtube-nocookie\.com\/embed\//
    )
  })

  it('publica datos estructurados Movie con sus tráileres y sin valoraciones', () => {
    const { container } = renderAt('/cine-y-series/dungeons-and-dragons-honor-among-thieves')
    const data = [...container.querySelectorAll('script[type="application/ld+json"]')]
      .map((script) => JSON.parse(script.textContent ?? '{}'))
      .find((item) => item['@type'] === 'Movie')
    expect(data).toMatchObject({
      name: 'Dungeons & Dragons: Honor Among Thieves',
      alternateName: 'Dungeons & Dragons: Honor entre ladrones',
      datePublished: '2023-03-31',
    })
    expect(data.trailer[0]['@type']).toBe('VideoObject')
    expect(data.aggregateRating).toBeUndefined()
  })

  it('marca la obra no oficial con su insignia y su motivo', () => {
    renderAt('/cine-y-series/secrets-of-blackmoor')
    expect(screen.getByText('No oficial')).toBeInTheDocument()
    expect(screen.getByText(/sin licencia de Wizards of the Coast/)).toBeInTheDocument()
  })

  it('publica TVSeries en las series, con sus años y temporadas', () => {
    const { container } = renderAt('/cine-y-series/dungeons-and-dragons-1983')
    expect(screen.getByText('1983–1985')).toBeInTheDocument()
    expect(screen.getByText('3 temporadas')).toBeInTheDocument()
    const types = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (script) => JSON.parse(script.textContent ?? '{}')['@type']
    )
    expect(types).toContain('TVSeries')
  })

  it('con un slug inexistente muestra la página de no encontrado', () => {
    renderAt('/cine-y-series/no-existe')
    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()
  })
})

describe('ScreenDetail', () => {
  it('indica cuando no hay ediciones en España ni estrenos, y si está anunciada', () => {
    renderWork({ status: 'announced' })
    expect(screen.getByText(/No consta ninguna edición/)).toBeInTheDocument()
    expect(screen.getByText(/todavía sin fecha de estreno/)).toBeInTheDocument()
    expect(screen.getByText('Anunciada, sin fecha')).toBeInTheDocument()
  })

  it('permite ver el cartel original además del castellano', () => {
    renderWork({
      posters: [
        { language: 'es', image: '/images/screen/obra/poster-es.webp', source: 'https://a.b/' },
        { language: 'en', image: '/images/screen/obra/poster-en.webp', source: 'https://a.b/' },
      ],
    })
    expect(screen.getByRole('img', { name: /en castellano/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'Original' }))
    expect(screen.getByRole('img', { name: /versión original en inglés/ })).toBeInTheDocument()
  })

  it('avisa cuando ninguna edición está a la venta', () => {
    renderWork({
      physical_editions: [{ format: 'dvd', spanish_audio: true, spanish_subtitles: false }],
    })
    expect(screen.getByText('No está a la venta en las tiendas del sitio.')).toBeInTheDocument()
    expect(screen.getByText(/Audio en castellano/)).toBeInTheDocument()
  })
})
