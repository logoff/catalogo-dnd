import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { Novel, NovelAnthology, NovelEdition, NovelSeries } from '@/types/novel'
import { buildNovelIndex } from '@/utils/novels'
import { cacheNovel, setAnthologies, setNovelIndex, setSeries } from '@/services/novelLoader'
import { getAllVideogames } from '@/services/videogameLoader'
import NovelDetailPage from './NovelDetailPage'

const english: NovelEdition = {
  language: 'english',
  country: 'us',
  publisher: 'TSR',
  date: '1985-04',
  format: 'mass_market',
  isbn13: 9780880381741,
}

const spanish = (publisher: string, date: string, extra: Partial<NovelEdition> = {}) =>
  ({
    language: 'castellano',
    spain: true,
    title: 'La tumba de Huma',
    publisher,
    date,
    format: 'paperback',
    ...extra,
  }) as NovelEdition

const novel = (title: string, extra: Partial<Novel>): Novel => ({
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  title,
  authors: ['Margaret Weis', 'Tracy Hickman'],
  setting: 'dragonlance',
  kind: 'novel',
  description: 'De qué trata.\n\nDónde encaja.',
  source: 'https://example.com/fuente',
  editions: [english],
  ...extra,
})

const game = getAllVideogames()[0]
const link = [{ store: 'amazon' as const, url: 'https://www.amazon.es/dp/8445011103/' }]

const novels = [
  novel('Dragons of Autumn Twilight', { series: { id: 'chronicles', number: 1 }, date: '1984-11' }),
  novel('Dragons of Winter Night', {
    series: { id: 'chronicles', number: 2 },
    date: '1985-04',
    editions: [
      english,
      { ...english, country: 'uk', publisher: 'Penguin Books', date: '1986-08', isbn13: undefined },
      spanish('Timun Mas', '1987'),
      spanish('Planeta DeAgostini', '2005'),
      spanish('Minotauro', '2022-06', { purchase_links: link }),
      spanish('Editorial de fuera', '1990', { spain: false }),
    ],
    related_videogames: [game.slug],
  }),
  novel('Dragons of Spring Dawning', { series: { id: 'chronicles', number: 3 }, date: '1985-09' }),
  novel('The Legend of Huma', { date: '1988-02' }),
]

const series: NovelSeries[] = [
  {
    id: 'chronicles',
    title: 'Dragonlance Chronicles',
    title_es: 'Crónicas de la Dragonlance',
    setting: 'dragonlance',
    collections: [
      {
        language: 'castellano',
        spain: true,
        title: 'Crónicas de la Dragonlance (estuche)',
        publisher: 'Timun Mas',
        date: '2012',
        format: 'paperback',
        novels: [
          'dragons-of-autumn-twilight',
          'dragons-of-winter-night',
          'dragons-of-spring-dawning',
        ],
      },
    ],
  },
]

const anthologies: NovelAnthology[] = [
  {
    id: 'tales-of-the-lance',
    title: 'The Magic of Krynn',
    title_es: 'La magia de Krynn',
    settings: ['dragonlance'],
    description: 'Relatos de la Dragonlance de varios autores.\n\nPrimera de las antologías.',
    source: 'https://example.com/antologia',
    series: ['chronicles'],
    editions: [
      { language: 'english', country: 'us', publisher: 'TSR', date: '1987-03' },
      spanish('Timun Mas', '1990', { title: 'La magia de Krynn', purchase_links: link }),
    ],
  },
  {
    id: 'huma-tales',
    title: 'Tales of Huma',
    settings: ['dragonlance'],
    description: 'Relatos sobre Huma.\n\nSolo ligada a una novela.',
    source: 'https://example.com/huma',
    novels: ['the-legend-of-huma'],
    editions: [{ language: 'english', country: 'us', publisher: 'TSR', date: '1990' }],
  },
]

const renderPage = (slug: string) =>
  render(
    <MemoryRouter initialEntries={[`/novela/${slug}`]}>
      <Routes>
        <Route path="/novela/:slug" element={<NovelDetailPage />} />
      </Routes>
    </MemoryRouter>
  )

const section = (name: string) =>
  screen.getByRole('heading', { name, level: 2 }).closest('section')!

describe('NovelDetailPage', () => {
  beforeEach(() => {
    setSeries(series)
    setAnthologies(anthologies)
    setNovelIndex(buildNovelIndex(novels, series))
    novels.forEach(cacheNovel)
  })

  it('muestra los datos principales, la descripción y la fuente', () => {
    renderPage('dragons-of-winter-night')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dragons of Winter Night')
    expect(screen.getAllByText('La tumba de Huma').length).toBeGreaterThan(0)
    expect(screen.getByText('Margaret Weis, Tracy Hickman')).toBeInTheDocument()
    expect(screen.getByText('Crónicas de la Dragonlance, 2')).toBeInTheDocument()
    expect(screen.getByText('Dónde encaja.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Fuente' })).toHaveAttribute(
      'href',
      'https://example.com/fuente'
    )
  })

  it('agrupa las ediciones por idioma, de la más reciente a la más antigua', () => {
    renderPage('dragons-of-winter-night')
    const spanishRows = within(section('Ediciones en castellano')).getAllByRole('listitem')
    expect(spanishRows.map((row) => row.textContent)).toEqual([
      expect.stringContaining('Minotauro'),
      expect.stringContaining('Planeta DeAgostini'),
      expect.stringContaining('Editorial de fuera'),
      expect.stringContaining('Timun Mas'),
    ])
    expect(spanishRows[2]).toHaveTextContent('Fuera de España')
    expect(within(spanishRows[0]).getByRole('link', { name: /Amazon/ })).toBeInTheDocument()
    const englishRows = within(section('Ediciones en inglés')).getAllByRole('listitem')
    expect(englishRows[0]).toHaveTextContent('Penguin Books')
    expect(englishRows[0]).toHaveTextContent('Reino Unido')
    expect(englishRows[1]).toHaveTextContent('ISBN 978-0880381741')
  })

  it('muestra los recopilatorios que incluyen la novela', () => {
    renderPage('dragons-of-winter-night')
    expect(
      within(section('Recopilatorios')).getByText('Crónicas de la Dragonlance (estuche)')
    ).toBeInTheDocument()
  })

  it('muestra las antologías de la serie, con el título en castellano y la edición traducida primero', () => {
    renderPage('dragons-of-winter-night')
    const block = section('Antologías')
    expect(within(block).getByRole('heading', { name: 'La magia de Krynn' })).toBeInTheDocument()
    expect(within(block).getAllByText('The Magic of Krynn').length).toBeGreaterThan(0)
    expect(
      within(block).getByText('Relatos de la Dragonlance de varios autores.')
    ).toBeInTheDocument()
    const rows = within(block)
      .getAllByRole('listitem')
      .filter((li) => li.querySelector('a, button'))
    expect(rows[0]).toHaveTextContent('Timun Mas')
    expect(within(rows[0]).getByRole('link', { name: /Amazon/ })).toBeInTheDocument()
    expect(within(block).getByText('Otra edición')).toBeInTheDocument()
    expect(within(block).queryByText('Tales of Huma')).toBeNull()
  })

  it('muestra las antologías ligadas a la propia novela', () => {
    renderPage('the-legend-of-huma')
    expect(
      within(section('Antologías')).getByRole('heading', { name: 'Tales of Huma' })
    ).toBeInTheDocument()
  })

  it('omite la sección de antologías si no hay ninguna', () => {
    setAnthologies([])
    renderPage('the-legend-of-huma')
    expect(screen.queryByRole('heading', { name: 'Antologías' })).toBeNull()
  })

  it('lista la serie con la novela actual destacada y la anterior y la siguiente', () => {
    renderPage('dragons-of-winter-night')
    const list = section('Crónicas de la Dragonlance')
    expect(within(list).getByText('La tumba de Huma')).toHaveAttribute('aria-current', 'page')
    expect(
      within(list).getByRole('link', { name: 'Anterior: Dragons of Autumn Twilight' })
    ).toHaveAttribute('href', '/novela/dragons-of-autumn-twilight')
    expect(
      within(list).getByRole('link', { name: 'Siguiente: Dragons of Spring Dawning' })
    ).toHaveAttribute('href', '/novela/dragons-of-spring-dawning')
  })

  it('enlaza al contenido relacionado', () => {
    renderPage('dragons-of-winter-night')
    expect(within(section('Relacionado')).getByRole('link', { name: game.title })).toHaveAttribute(
      'href',
      `/videojuego/${game.slug}`
    )
  })

  it('avisa de que no está en castellano ni a la venta, y omite serie y recopilatorios', () => {
    renderPage('the-legend-of-huma')
    expect(screen.getByText('No se ha publicado en castellano.')).toBeInTheDocument()
    expect(screen.getByText('No está a la venta en las tiendas del sitio.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Recopilatorios' })).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Crónicas de la Dragonlance' })).toBeNull()
  })

  it('cuenta como traducida la novela que solo salió en castellano en un recopilatorio', () => {
    renderPage('dragons-of-autumn-twilight')
    expect(
      screen.getByText(
        'Solo se ha publicado en castellano dentro de un recopilatorio (ver más abajo).'
      )
    ).toBeInTheDocument()
    expect(screen.getAllByText('En castellano').length).toBeGreaterThan(0)
  })

  it('muestra la página de no encontrado si el slug no existe', async () => {
    renderPage('no-existe')
    expect(await screen.findByText(/no encontrad/i)).toBeInTheDocument()
  })

  it('distingue el botón de compra de las ediciones Kindle', () => {
    const kindle = novel('Con Kindle', {
      editions: [
        { ...english, purchase_links: link },
        {
          ...english,
          format: 'ebook',
          isbn13: undefined,
          purchase_links: [{ store: 'amazon', url: 'https://www.amazon.es/dp/B004G8P1J2/' }],
        },
      ],
    })
    cacheNovel(kindle)
    setNovelIndex(buildNovelIndex([...novels, kindle], series))
    renderPage('con-kindle')
    const buttons = screen.getAllByRole('link', { name: /Comprar en Amazon/ })
    expect(buttons.map((b) => b.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'Comprar en Amazon',
      'Comprar en Amazon Kindle',
    ])
    expect(buttons[1]).toHaveAttribute('data-umami-event-formato', 'ebook')
  })

  it('abre las portadas en el visor', () => {
    const withCover = novel('Con portada', {
      editions: [{ ...english, cover: '/images/novels/con-portada/9780880381741.webp' }],
    })
    cacheNovel(withCover)
    setNovelIndex(buildNovelIndex([...novels, withCover], series))
    renderPage('con-portada')
    fireEvent.click(screen.getByRole('button', { name: /Ver portada/ }))
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
  })
})
