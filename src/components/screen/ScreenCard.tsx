import { Link } from 'react-router-dom'
import { FilmIcon } from '@heroicons/react/24/outline'
import type { ScreenWorkWithMeta } from '@/types/screen'
import { kindNames, yearsLabel } from '@/utils/screen'
import { cardClass } from '@/components/ui/styles'
import { CardBody } from '@/components/ui/Card'
import { SpanishMark } from '@/components/ui/Badge'
import LazyImage from '../common/LazyImage'

// Cartel de una obra, o un hueco con un icono si aún no tiene
export function ScreenPoster({
  work,
  className,
  thumbnail = true,
}: {
  work: ScreenWorkWithMeta
  className?: string
  thumbnail?: boolean
}) {
  if (!work.poster) {
    return (
      <div className={`flex items-center justify-center bg-well ${className ?? ''}`}>
        <FilmIcon className="size-10 text-muted" aria-hidden="true" />
      </div>
    )
  }
  return (
    <LazyImage
      src={thumbnail ? work.poster.thumbnail : work.poster.image}
      alt={`Cartel de ${work.displayTitle}`}
      containerClassName={className}
      className="h-full w-full object-cover"
    />
  )
}

export default function ScreenCard({ work }: { work: ScreenWorkWithMeta }) {
  const details = [kindNames[work.kind], yearsLabel(work)].filter(Boolean).join(' · ')

  return (
    <Link to={`/cine-y-series/${work.slug}`} className={cardClass(true, 'h-full')}>
      <ScreenPoster work={work} className="aspect-[2/3] border-b border-line" />
      <CardBody>
        <p className="text-xs text-muted">{details}</p>
        <h3 className="line-clamp-3 text-[15px] leading-snug font-semibold tracking-tight">
          {work.displayTitle}
        </h3>
        {work.hasSpanish && <SpanishMark>En castellano</SpanishMark>}
      </CardBody>
    </Link>
  )
}
