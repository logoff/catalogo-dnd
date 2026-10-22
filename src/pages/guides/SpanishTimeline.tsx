import { Link } from 'react-router-dom'
import { getAllProducts } from '@/services/dataLoader'
import { formatDate } from '@/utils/formatters'
import GuideLayout from './GuideLayout'

interface TimelineEntry {
  date: string
  title: string
  publisher?: string
  to: string
}

// Todas las publicaciones en castellano con fecha, ordenadas cronológicamente
function getSpanishTimeline(): TimelineEntry[] {
  return getAllProducts()
    .flatMap((product) => {
      const editionPath = product.primaryEdition === '5e' ? '2014' : '2024'
      return product.publications
        .filter((pub) => pub.language === 'castellano' && pub.date)
        .map((pub) => ({
          date: pub.date!,
          title: pub.title,
          publisher: pub.publisher,
          to: `/producto/${editionPath}/${product.code.toLowerCase()}`,
        }))
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title))
}

export default function SpanishTimeline() {
  const timeline = getSpanishTimeline()
  const byYear = new Map<string, TimelineEntry[]>()
  for (const entry of timeline) {
    const year = entry.date.slice(0, 4)
    byYear.set(year, [...(byYear.get(year) ?? []), entry])
  }
  const spanishProducts = getAllProducts().filter((p) => p.languages.includes('castellano'))

  return (
    <GuideLayout
      title="D&D en castellano: cronología"
      description="Todos los libros y cajas de la quinta edición de Dungeons & Dragons publicados en castellano, por orden de publicación y con su editorial."
    >
      <p>
        La quinta edición llegó al castellano en 2017, tres años después que en inglés, de la mano
        de <strong>Edge Entertainment</strong>, con licencia de Gale Force Nine. Edge publicó los
        libros básicos y buena parte de las aventuras hasta 2021. Desde octubre de ese año es{' '}
        <strong>Wizards of the Coast</strong> quien publica directamente en castellano: reeditó los
        libros básicos y algunos títulos de Edge, y desde entonces traduce sus novedades con mucho
        menos retraso.
      </p>
      <p>
        De los {getAllProducts().length} productos del catálogo, {spanishProducts.length} tienen
        edición en castellano. Muchos suplementos y ambientaciones de 2014 nunca se tradujeron.
      </p>

      {[...byYear].map(([year, entries]) => (
        <section key={year}>
          <h2>{year}</h2>
          <ul>
            {entries.map((entry) => (
              <li key={`${entry.date}-${entry.title}`}>
                <span className="text-gray-400">{formatDate(entry.date)}</span>:{' '}
                <Link to={entry.to}>{entry.title}</Link>
                {entry.publisher && <span className="text-gray-400"> ({entry.publisher})</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </GuideLayout>
  )
}
