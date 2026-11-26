import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import Badge, { SpanishMark } from '@/components/ui/Badge'
import { headingClass } from '@/components/ui/styles'
import type { Release } from '@/types/releases'
import { groupByMonth, releaseSectionLabel } from '@/utils/releaseGroups'

// «24 nov», o solo «nov» si el dato no da el día; en los anunciados, el año o «Sin fecha»
function shortDate(release: Release): string {
  if (!release.date) return release.year ?? 'Sin fecha'
  return format(parseISO(release.date), release.monthOnly ? 'MMM' : 'd MMM', { locale: es })
}

export function ReleaseItem({ release }: { release: Release }) {
  return (
    <li className="flex gap-4 py-3">
      <span className="w-20 shrink-0 pt-0.5 font-mono text-sm whitespace-nowrap text-muted tabular-nums">
        {shortDate(release)}
      </span>
      <div className="min-w-0 flex-1">
        <Link
          to={release.path}
          className="font-medium text-fg hover:underline"
          // Evento de Umami: qué secciones e idiomas se visitan desde las novedades
          data-umami-event="novedades"
          data-umami-event-seccion={release.section}
          data-umami-event-idioma={release.language ?? 'sin idioma'}
        >
          {release.name}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <Badge>
            {releaseSectionLabel(release)}
            {release.context && ` · ${release.context}`}
          </Badge>
          {release.language === 'castellano' && <SpanishMark>Castellano</SpanishMark>}
          {release.language === 'english' && <SpanishMark active={false}>Inglés</SpanishMark>}
        </div>
      </div>
    </li>
  )
}

export function ReleaseList({ releases }: { releases: Release[] }) {
  return (
    <ul className="divide-y divide-line">
      {releases.map((release) => (
        <ReleaseItem key={`${release.path}|${release.key}|${release.date}`} release={release} />
      ))}
    </ul>
  )
}

// Lista agrupada por meses, cada uno con su título de grupo
export function ReleasesByMonth({ releases }: { releases: Release[] }) {
  return (
    <div className="space-y-6">
      {groupByMonth(releases).map(({ month, releases: items }) => (
        <section key={month}>
          <h3 className={headingClass('group', 'mb-1')}>{month}</h3>
          <ReleaseList releases={items} />
        </section>
      ))}
    </div>
  )
}
