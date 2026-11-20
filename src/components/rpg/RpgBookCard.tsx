import { Link } from 'react-router-dom'
import type { RpgBookSummary, RpgSystem } from '@/types/rpg'
import LazyImage from '@/components/common/LazyImage'
import { SpanishMark } from '@/components/ui/Badge'
import { CardBody, CardCover } from '@/components/ui/Card'
import { cardClass, headingClass } from '@/components/ui/styles'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { bookPath } from '@/utils/rpg'

export default function RpgBookCard({
  book,
  system,
}: {
  book: RpgBookSummary
  system: RpgSystem | undefined
}) {
  return (
    <Link to={bookPath(book, system ? [system] : [])} className={cardClass(true, 'h-full')}>
      <CardCover>
        <LazyImage
          src={book.thumbnail ?? PLACEHOLDER_IMAGE}
          alt={book.title}
          containerClassName="h-full"
          className="h-full w-full object-cover"
        />
      </CardCover>
      <CardBody>
        <h3 className={headingClass('item')}>{book.title}</h3>
        <p className="text-sm text-muted">
          {[system?.name, book.year].filter(Boolean).join(' · ')}
        </p>
        {book.spanish && (
          <SpanishMark className="mt-auto pt-1">
            {book.titleEs && book.titleEs !== book.title ? (
              <span lang="es">{book.titleEs}</span>
            ) : (
              'En castellano'
            )}
          </SpanishMark>
        )}
      </CardBody>
    </Link>
  )
}
