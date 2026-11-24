import { Link } from 'react-router-dom'
import type { ComicSummary } from '@/types/comic'
import { issueCountLabel, publisherGroup, spanishNames } from '@/utils/comicTranslations'
import LazyImage from '../common/LazyImage'
import { SpanishMark } from '@/components/ui/Badge'
import { cardClass } from '@/components/ui/styles'
import { CardBody, CardCover } from '@/components/ui/Card'

// Portada genérica para las series sin portada
export const COMIC_PLACEHOLDER = '/images/comics/placeholder.svg'

export default function ComicCard({ comic }: { comic: ComicSummary }) {
  const details = [publisherGroup(comic.publisher), comic.years, issueCountLabel(comic)]
    .filter(Boolean)
    .join(' · ')
  const subtitle =
    comic.spanishTitle && comic.spanishTitle !== comic.title ? comic.spanishTitle : null

  return (
    <Link to={`/comic/${comic.slug}`} className={cardClass(true, 'h-full')}>
      <CardCover aspect="aspect-[2/3]">
        <LazyImage
          src={comic.thumbnail ?? COMIC_PLACEHOLDER}
          alt={comic.title}
          containerClassName="h-full"
          className="h-full w-full object-cover"
        />
      </CardCover>
      <CardBody>
        <h3 className="line-clamp-3 text-[15px] leading-snug font-semibold tracking-tight">
          {comic.title}
        </h3>
        {subtitle && (
          <p className="line-clamp-2 text-sm">
            <SpanishMark active={comic.spanish === 'spain'}>{subtitle}</SpanishMark>
          </p>
        )}
        <p className="line-clamp-2 text-sm text-muted">{details}</p>
        {!subtitle && (
          <SpanishMark active={comic.spanish === 'spain'}>
            {spanishNames[comic.spanish]}
          </SpanishMark>
        )}
        {comic.availableToBuy && <p className="text-xs text-muted">A la venta</p>}
      </CardBody>
    </Link>
  )
}
