import { Link } from 'react-router-dom'
import type { NovelIndex, NovelSummary } from '@/types/novel'
import { seriesName } from '@/utils/novelTranslations'
import LazyImage from '../common/LazyImage'
import NovelSpanishBadge from './NovelSpanishBadge'
import { cardClass } from '@/components/ui/styles'
import { CardBody, CardCover } from '@/components/ui/Card'

interface NovelCardProps {
  novel: NovelSummary
  series: NovelIndex['series']
  view?: 'grid' | 'list'
}

// Portada genérica para las novelas sin portada (las publicadas solo en la web)
export const NOVEL_PLACEHOLDER = '/images/novels/placeholder.svg'

export default function NovelCard({ novel, series, view = 'grid' }: NovelCardProps) {
  const novelSeries = novel.series && series.find((s) => s.id === novel.series!.id)
  const seriesLabel = novelSeries ? `${seriesName(novelSeries)} ${novel.series!.number}` : null
  const details = [novel.authors.join(', '), novel.year].filter(Boolean).join(' · ')
  const cover = novel.thumbnail ?? NOVEL_PLACEHOLDER
  const subtitle = novel.titleEs && novel.titleEs !== novel.title ? novel.titleEs : null

  if (view === 'list') {
    return (
      <Link
        to={`/novela/${novel.slug}`}
        className="flex items-center gap-4 px-4 py-3 transition-colors duration-150 hover:bg-well"
      >
        <LazyImage
          src={cover}
          alt=""
          containerClassName="aspect-[2/3] w-11 shrink-0 rounded"
          className="h-full w-full object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h3 className="truncate text-[15px] font-semibold tracking-tight">{novel.title}</h3>
            {subtitle && <p className="truncate text-sm">{subtitle}</p>}
            <p className="truncate text-sm text-muted">
              {[seriesLabel, details].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="shrink-0 sm:w-56 sm:text-right">
            <NovelSpanishBadge spanish={novel.spanish} />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/novela/${novel.slug}`} className={cardClass(true, 'h-full')}>
      <CardCover aspect="aspect-[2/3]">
        <LazyImage
          src={cover}
          alt={novel.title}
          containerClassName="h-full"
          className="h-full w-full object-cover"
        />
      </CardCover>
      <CardBody>
        {seriesLabel && <p className="line-clamp-1 text-xs text-muted">{seriesLabel}</p>}
        <h3 className="line-clamp-3 text-[15px] leading-snug font-semibold tracking-tight">
          {novel.title}
        </h3>
        {subtitle && <p className="line-clamp-2 text-sm">{subtitle}</p>}
        <p className="line-clamp-2 text-sm text-muted">{details}</p>
        <NovelSpanishBadge spanish={novel.spanish} />
      </CardBody>
    </Link>
  )
}
