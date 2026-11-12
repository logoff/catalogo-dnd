import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SpanishBadge from './SpanishBadge'
import ReviewScore from './ReviewScore'
import ReleaseTable from './ReleaseTable'
import PurchaseByPlatform from './PurchaseByPlatform'
import PlatformIcon from './PlatformIcon'
import { PLATFORMS_WITH_LOGO } from '@/utils/platformLogos'
import logoSourcesRaw from '/public/images/platforms/sources.json?raw'
import type { Platform } from '@/types/videogame'
import { describeSpanish, formatPartialDate, platformNames } from '@/utils/videogameTranslations'

describe('SpanishBadge', () => {
  it.each([
    ['full', 'En castellano'],
    ['text', 'Textos en castellano'],
    ['none', 'Solo en inglés'],
  ] as const)('%s → %s', (summary, label) => {
    render(<SpanishBadge summary={summary} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})

describe('describeSpanish', () => {
  it('detalla las partes traducidas', () => {
    expect(describeSpanish({ interface: true, subtitles: true, audio: true })).toBe(
      'Textos, subtítulos y voces en castellano'
    )
    expect(describeSpanish({ interface: true, subtitles: true, audio: false })).toBe(
      'Textos y subtítulos en castellano'
    )
    expect(describeSpanish({ interface: false, subtitles: true, audio: false })).toBe(
      'Subtítulos en castellano'
    )
    expect(describeSpanish({ interface: false, subtitles: false, audio: false })).toBe(
      'Solo en inglés'
    )
    expect(describeSpanish(undefined)).toBe('Solo en inglés')
  })
})

describe('formatPartialDate', () => {
  it('respeta la precisión de la fecha', () => {
    expect(formatPartialDate('1988')).toBe('1988')
    expect(formatPartialDate('1988-06')).toBe('junio de 1988')
    expect(formatPartialDate('2012-11-28')).toBe('28 de noviembre de 2012')
  })
})

describe('ReviewScore', () => {
  it('muestra nota, escala, fuente y plataforma con enlace', () => {
    render(
      <ReviewScore
        review={{
          source: 'metacritic',
          score: 96,
          scale: 100,
          url: 'https://www.metacritic.com/game/baldurs-gate-3/',
          platform: 'pc_windows',
        }}
      />
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://www.metacritic.com/game/baldurs-gate-3/')
    expect(link).toHaveTextContent('96/100Metacritic (Windows)')
  })

  it('usa coma decimal en notas sobre 10', () => {
    render(
      <ReviewScore
        review={{ source: 'vandal', score: 9.2, scale: 10, url: 'https://vandal.elespanol.com/x' }}
      />
    )
    expect(screen.getByRole('link')).toHaveTextContent('9,2/10Vandal')
  })
})

describe('ReleaseTable', () => {
  it('ordena por fecha y muestra edición y castellano de cada lanzamiento', () => {
    render(
      <ReleaseTable
        releases={[
          { platform: 'apple_ii' },
          {
            platform: 'pc_windows',
            date: '2012-11-28',
            edition: 'Enhanced Edition',
            spanish: { interface: true, subtitles: true, audio: false },
          },
          {
            platform: 'pc_windows',
            date: '1998-12-21',
            spanish: { interface: false, subtitles: false, audio: false },
          },
        ]}
      />
    )
    const rows = screen.getAllByRole('row').slice(1)
    expect(rows).toHaveLength(3)
    expect(within(rows[0]).getByText('21 de diciembre de 1998')).toBeInTheDocument()
    expect(within(rows[0]).getByText('Original')).toBeInTheDocument()
    expect(within(rows[0]).getByText('Solo en inglés')).toBeInTheDocument()
    expect(within(rows[1]).getByText('Enhanced Edition')).toBeInTheDocument()
    expect(within(rows[1]).getByText('Textos y subtítulos en castellano')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Apple II')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Solo en inglés')).toBeInTheDocument()
  })
})

describe('ReleaseTable con recopilaciones', () => {
  it('la versión indica la recopilación en la que se vende', () => {
    render(
      <ReleaseTable
        releases={[
          { platform: 'pc_windows', date: '2022-03-29', bundle: 'forgotten-realms-archives-2' },
        ]}
      />
    )
    expect(
      screen.getByText('En Forgotten Realms: The Archives – Collection Two')
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Windows' })).toBeInTheDocument()
  })
})

describe('PurchaseByPlatform', () => {
  const renderLinks = (releases: Parameters<typeof PurchaseByPlatform>[0]['releases']) =>
    render(
      <MemoryRouter>
        <PurchaseByPlatform slug="juego" releases={releases} />
      </MemoryRouter>
    )

  it('agrupa por plataforma con el castellano de cada versión', () => {
    renderLinks([
      {
        platform: 'pc_windows',
        spanish: { interface: true, subtitles: true, audio: false },
        purchase_links: [{ store: 'gog', url: 'https://www.gog.com/en/game/juego' }],
      },
      {
        platform: 'ps4',
        purchase_links: [
          { store: 'amazon', url: 'https://www.amazon.es/dp/X', format: 'physical' },
        ],
      },
    ])
    const pc = screen.getByRole('region', { name: 'Windows' })
    expect(within(pc).getByText(/Textos y subtítulos en castellano/)).toBeInTheDocument()
    expect(within(pc).getByRole('link', { name: 'Comprar en GOG' })).toBeInTheDocument()

    const ps4 = screen.getByRole('region', { name: 'PlayStation 4' })
    expect(within(ps4).getByText(/Solo en inglés/)).toBeInTheDocument()
    expect(within(ps4).getByText(/Edición física/)).toBeInTheDocument()
  })

  it('ordena las tiendas siempre igual, sin importar el orden de los datos', () => {
    renderLinks([
      {
        platform: 'pc_windows',
        purchase_links: [
          { store: 'steam', url: 'https://store.steampowered.com/app/1/' },
          { store: 'gog', url: 'https://www.gog.com/en/game/juego' },
        ],
      },
    ])
    const names = screen
      .getAllByRole('link', { name: /^Comprar en/ })
      .map((link) => link.textContent)
    expect(names).toEqual(['Comprar en GOG', 'Comprar en Steam'])
  })

  it('marca los clics para la analítica con el juego y la plataforma', () => {
    renderLinks([
      {
        platform: 'pc_windows',
        purchase_links: [{ store: 'gog', url: 'https://www.gog.com/en/game/juego' }],
      },
    ])
    const link = screen.getByRole('link', { name: 'Comprar en GOG' })
    expect(link).toHaveAttribute('rel', 'sponsored noopener noreferrer')
    expect(link).toHaveAttribute('data-umami-event', 'comprar')
    expect(link).toHaveAttribute('data-umami-event-videojuego', 'juego')
    expect(link).toHaveAttribute('data-umami-event-plataforma', 'pc_windows')
    expect(link).toHaveAttribute('data-umami-event-url', 'https://www.gog.com/en/game/juego')
  })

  it('muestra la versión y su año encima de los botones, no pegados a ellos', () => {
    renderLinks([
      {
        platform: 'pc_windows',
        date: '2012-11-28',
        edition: 'Enhanced Edition',
        spanish: { interface: true, subtitles: true, audio: false },
        purchase_links: [{ store: 'gog', url: 'https://www.gog.com/en/game/juego' }],
      },
    ])
    expect(
      screen.getByText('Enhanced Edition · 2012 · Textos y subtítulos en castellano')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Comprar en GOG' })).toHaveTextContent(
      /^Comprar en GOG$/
    )
  })

  it('cada plataforma lleva su icono con el nombre accesible', () => {
    renderLinks([
      {
        platform: 'ps4',
        purchase_links: [{ store: 'amazon', url: 'https://www.amazon.es/dp/X' }],
      },
    ])
    const ps4 = screen.getByRole('region', { name: 'PlayStation 4' })
    expect(within(ps4).getByRole('img', { name: 'PlayStation 4' })).toBeInTheDocument()
  })

  it('muestra las recopilaciones en un bloque propio con los demás juegos', () => {
    renderLinks([
      { platform: 'pc_dos', date: '1988-06' },
      {
        platform: 'pc_windows',
        date: '2022-03-29',
        bundle: 'forgotten-realms-archives-2',
        spanish: { interface: false, subtitles: false, audio: false },
      },
    ])
    const pc = screen.getByRole('region', { name: 'Windows' })
    expect(within(pc).getByText(/Se vende en la recopilación/)).toBeInTheDocument()
    expect(
      within(pc).getByText('Forgotten Realms: The Archives – Collection Two')
    ).toBeInTheDocument()
    expect(within(pc).getByRole('link', { name: 'Hillsfar' })).toHaveAttribute(
      'href',
      '/videojuego/hillsfar'
    )
    expect(within(pc).getByRole('link', { name: 'Comprar en GOG' })).toBeInTheDocument()
  })

  it('pone lo que se vende suelto antes que las recopilaciones', () => {
    renderLinks([
      { platform: 'xbox_one', date: '2019-10-15', bundle: 'baldurs-gate-1-2-enhanced-xbox' },
      {
        platform: 'xbox_one',
        date: '2019-10-15',
        edition: 'Enhanced Edition',
        purchase_links: [
          { store: 'amazon', url: 'https://www.amazon.es/dp/X', format: 'physical' },
        ],
      },
    ])
    const xbox = screen.getByRole('region', { name: 'Xbox One' })
    const text = xbox.textContent ?? ''
    expect(text.indexOf('Edición física')).toBeLessThan(text.indexOf('Se vende en la recopilación'))
  })

  it('sin enlaces vigentes indica que no está a la venta', () => {
    renderLinks([
      {
        platform: 'pc_windows',
        delisted: true,
        purchase_links: [{ store: 'steam', url: 'https://store.steampowered.com/app/1/' }],
      },
      { platform: 'pc_dos' },
    ])
    expect(screen.getByText('No disponible a la venta.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /^Comprar en/ })).not.toBeInTheDocument()
  })
})

describe('PlatformIcon', () => {
  it('todas las plataformas tienen icono con su nombre', () => {
    for (const platform of Object.keys(platformNames) as Platform[]) {
      const { unmount } = render(<PlatformIcon platform={platform} />)
      expect(screen.getByRole('img', { name: platformNames[platform] })).toBeInTheDocument()
      unmount()
    }
  })
})

describe('logotipos de plataforma', () => {
  const logoSources = JSON.parse(logoSourcesRaw) as Record<string, { license: string }>
  const files = Object.keys(import.meta.glob('/public/images/platforms/*.svg')).map((path) =>
    path.replace('/public/images/platforms/', '').replace('.svg', '')
  )

  it('cada plataforma con logotipo tiene su archivo y su procedencia en Commons', () => {
    const missing = [...PLATFORMS_WITH_LOGO].filter(
      (platform) => !files.includes(platform) || !(platform in logoSources)
    )
    expect(missing).toEqual([])
  })

  it('no hay logotipos sin usar', () => {
    expect(files.filter((file) => !PLATFORMS_WITH_LOGO.has(file as Platform))).toEqual([])
  })

  it('todos los logotipos tienen licencia libre', () => {
    const notFree = Object.entries(logoSources)
      .filter(([, source]) => !['Public domain', 'CC0'].includes(source.license))
      .map(([platform]) => platform)
    expect(notFree).toEqual([])
  })

  it('muestra el logotipo si lo hay y el pictograma si no', () => {
    const { container, unmount } = render(<PlatformIcon platform="ps4" />)
    expect(container.querySelector('img')).toHaveAttribute('src', '/images/platforms/ps4.svg')
    unmount()
    const arcade = render(<PlatformIcon platform="arcade" />)
    expect(arcade.container.querySelector('img')).toBeNull()
    expect(arcade.container.querySelector('svg')).not.toBeNull()
  })
})
