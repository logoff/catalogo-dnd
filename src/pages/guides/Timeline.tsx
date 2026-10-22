import { Link } from 'react-router-dom'
import { getAllProducts } from '@/services/dataLoader'
import { formatDate } from '@/utils/formatters'
import type { Language } from '@/types'

interface TimelineEntry {
  date?: string
  title: string
  publisher?: string
  to: string
}

// Publicaciones en un idioma, sin repetir las que comparten título y fecha dentro de un producto
function getTimeline(language: Language): TimelineEntry[] {
  return getAllProducts()
    .flatMap((product) => {
      const editionPath = product.primaryEdition === '5e' ? '2014' : '2024'
      const seen = new Set<string>()
      return product.publications
        .filter((pub) => pub.language === language)
        .filter((pub) => {
          const key = `${pub.title}|${pub.date}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
        .map((pub) => ({
          date: pub.date,
          title: pub.title,
          publisher: pub.publisher,
          to: `/producto/${editionPath}/${product.code.toLowerCase()}`,
        }))
    })
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '') || a.title.localeCompare(b.title))
}

interface TimelineProps {
  language: Language
  showPublisher?: boolean
}

export default function Timeline({ language, showPublisher = false }: TimelineProps) {
  const timeline = getTimeline(language)
  const today = new Date().toISOString().slice(0, 10)

  const byYear = new Map<string, TimelineEntry[]>()
  for (const entry of timeline.filter((e) => e.date)) {
    const year = entry.date!.slice(0, 4)
    byYear.set(year, [...(byYear.get(year) ?? []), entry])
  }
  const announced = timeline.filter((e) => !e.date)

  const renderEntry = (entry: TimelineEntry, index: number) => (
    <li key={index}>
      {entry.date && <span className="text-gray-400">{formatDate(entry.date)}: </span>}
      <Link to={entry.to}>{entry.title}</Link>
      {showPublisher && entry.publisher && (
        <span className="text-gray-400"> ({entry.publisher})</span>
      )}
      {entry.date && entry.date > today && <span className="text-gray-400"> · próximamente</span>}
    </li>
  )

  return (
    <>
      {[...byYear].map(([year, entries]) => (
        <section key={year}>
          <h2>{year}</h2>
          <ul>{entries.map(renderEntry)}</ul>
        </section>
      ))}
      {announced.length > 0 && (
        <section>
          <h2>Anunciados, sin fecha</h2>
          <ul>{announced.map(renderEntry)}</ul>
        </section>
      )}
    </>
  )
}
