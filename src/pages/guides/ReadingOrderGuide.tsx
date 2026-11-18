import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { NovelSummary } from '@/types/novel'
import { useNovelIndex } from '@/hooks/useNovelData'
import { READING_ORDERS, resolveReadingOrder, type ReadingOrderId } from '@/utils/readingOrders'
import LazyImage from '@/components/common/LazyImage'
import NovelSpanishBadge from '@/components/novels/NovelSpanishBadge'
import { NOVEL_PLACEHOLDER } from '@/components/novels/NovelCard'
import GuideLayout from './GuideLayout'

interface ReadingOrderGuideProps {
  order: ReadingOrderId
  title: string
  description: string
  children: ReactNode
}

// Fila de una novela en las guías: portada, títulos, año, castellano y enlace a la ficha
export function NovelRow({ novel, position }: { novel: NovelSummary; position?: number }) {
  const subtitle = novel.titleEs && novel.titleEs !== novel.title ? novel.titleEs : null
  return (
    <li className="flex items-center gap-4">
      {position !== undefined && (
        <span className="w-6 shrink-0 text-right text-muted">{position}.</span>
      )}
      <LazyImage
        src={novel.thumbnail ?? NOVEL_PLACEHOLDER}
        alt=""
        containerClassName="w-10 aspect-[2/3] shrink-0 rounded"
        className="w-full h-full object-cover rounded"
      />
      <div className="min-w-0 flex-1">
        <Link to={`/novela/${novel.slug}`}>{novel.title}</Link>
        {subtitle && <span className="text-fg"> · {subtitle}</span>}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
          {novel.year && <span>{novel.year}</span>}
          <NovelSpanishBadge spanish={novel.spanish} />
        </div>
      </div>
    </li>
  )
}

export default function ReadingOrderGuide({
  order,
  title,
  description,
  children,
}: ReadingOrderGuideProps) {
  const index = useNovelIndex()
  let position = 0

  return (
    <GuideLayout title={title} description={description}>
      {children}
      {!index ? (
        <p className="text-muted">Cargando novelas…</p>
      ) : (
        resolveReadingOrder(READING_ORDERS[order], index).map((block) => (
          <section key={block.title}>
            <h2>{block.title}</h2>
            <ol className="space-y-3">
              {block.novels.map((novel) => (
                <NovelRow key={novel.slug} novel={novel} position={++position} />
              ))}
            </ol>
          </section>
        ))
      )}
    </GuideLayout>
  )
}
