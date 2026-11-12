import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import SpanishBadge from './SpanishBadge'
import ReviewScore from './ReviewScore'
import ReleaseTable from './ReleaseTable'
import { describeSpanish, formatPartialDate } from '@/utils/videogameTranslations'

describe('SpanishBadge', () => {
  it.each([
    ['full', 'En castellano'],
    ['text', 'Textos en castellano'],
    ['none', 'Solo en inglés'],
    ['unknown', 'Castellano sin confirmar'],
  ] as const)('%s → %s', (summary, label) => {
    render(<SpanishBadge summary={summary} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})

describe('describeSpanish', () => {
  it('detalla las partes traducidas', () => {
    expect(describeSpanish({ interface: true, subtitles: true, audio: true })).toBe(
      'Textos, subtítulos y voces'
    )
    expect(describeSpanish({ interface: true, subtitles: true, audio: false })).toBe(
      'Textos y subtítulos'
    )
    expect(describeSpanish({ interface: false, subtitles: true, audio: false })).toBe('Subtítulos')
    expect(describeSpanish({ interface: false, subtitles: false, audio: false })).toBe(
      'Solo en inglés'
    )
    expect(describeSpanish(undefined)).toBe('Sin confirmar')
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
    expect(within(rows[1]).getByText('Textos y subtítulos')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Apple II')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Sin confirmar')).toBeInTheDocument()
  })
})
