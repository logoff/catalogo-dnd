import { Link } from 'react-router-dom'
import type { RpgBookSummary, RpgSystem } from '@/types/rpg'
import LazyImage from '@/components/common/LazyImage'
import { SpanishMark } from '@/components/ui/Badge'
import { CardBody, CardCover } from '@/components/ui/Card'
import { cardClass } from '@/components/ui/styles'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'

export default function RpgBookCard({
  book,
  system,
}: {
  book: RpgBookSummary
  system: RpgSystem | undefined
}) {
  const title = book.titleEs ?? book.title
  return (
    <Link to={`/rol/${book.system}/${book.slug}`} className={cardClass(true, 'h-full')}>
      <CardCover>
        <LazyImage
          src={book.thumbnail ?? PLACEHOLDER_IMAGE}
          alt={title}
          containerClassName="h-full"
          className="h-full w-full object-cover"
        />
      </CardCover>
      <CardBody>
        <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted">
          {[system?.name, book.year].filter(Boolean).join(' · ')}
        </p>
        {book.spanish && <SpanishMark className="mt-auto pt-1">En castellano</SpanishMark>}
      </CardBody>
    </Link>
  )
}
