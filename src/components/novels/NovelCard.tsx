import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { NovelIndex, NovelSummary } from '@/types/novel'
import { seriesName } from '@/utils/novelTranslations'
import LazyImage from '../common/LazyImage'
import NovelSpanishBadge from './NovelSpanishBadge'

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
        className="rounded-xl border border-line bg-surface overflow-hidden group flex gap-4 p-3"
      >
        <LazyImage
          src={cover}
          alt={novel.title}
          containerClassName="w-12 aspect-[2/3] shrink-0 rounded"
          className="w-full h-full object-cover rounded"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg text-fg group-hover:text-fg truncate">{novel.title}</h3>
          {subtitle && <p className="text-sm text-fg truncate">{subtitle}</p>}
          <p className="text-sm text-muted truncate">
            {[seriesLabel, details].filter(Boolean).join(' · ')}
          </p>
          <div className="mt-1">
            <NovelSpanishBadge spanish={novel.spanish} />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className="h-full">
      <Link
        to={`/novela/${novel.slug}`}
        className="rounded-xl border border-line bg-surface overflow-hidden group flex flex-col h-full"
      >
        <LazyImage
          src={cover}
          alt={novel.title}
          containerClassName="aspect-[2/3] bg-surface"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <NovelSpanishBadge spanish={novel.spanish} />
          </div>
          <h3 className="text-lg text-fg group-hover:text-fg transition-colors line-clamp-3">
            {novel.title}
          </h3>
          {subtitle && <p className="text-sm text-fg line-clamp-2">{subtitle}</p>}
          <div className="mt-auto pt-2 text-sm text-muted">
            {seriesLabel && <p className="line-clamp-1">{seriesLabel}</p>}
            <p className="line-clamp-2">{details}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
