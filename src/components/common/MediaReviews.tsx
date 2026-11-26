import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { getReviewOutlet } from '@/services/reviewOutlets'
import { formatDate } from '@/utils/formatters'
import type { Review } from '@/types'
import { headingClass } from '@/components/ui/styles'

const languageLabel = { english: 'En inglés', castellano: 'En castellano' } as const

// Cada reseña con la nota en la escala de su medio: nunca se calcula una media
export default function MediaReviews({ reviews }: { reviews: Review[] }) {
  const sorted = [...reviews].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section>
      <h2 className={headingClass('section', 'mb-4')}>Reseñas</h2>
      <ul className="divide-y divide-line rounded-xl border border-line bg-surface px-4 sm:px-6">
        {sorted.map((review) => {
          const outlet = getReviewOutlet(review.outlet)
          const name = outlet?.name ?? review.outlet
          const details = [
            languageLabel[review.language],
            review.author,
            formatDate(review.date),
          ].filter(Boolean)

          return (
            <li key={review.url} className="py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className={headingClass('item')}>{name}</h3>
                {review.score !== undefined && outlet?.scale && (
                  <p className="font-mono text-lg tabular-nums">
                    {`${review.score}/${outlet.scale}`}
                  </p>
                )}
              </div>
              <p className="text-sm text-muted">
                {details.join(' · ')}
                {review.spanish_edition && (
                  <span className="ml-2 rounded-md bg-accent-soft px-1.5 py-0.5 text-xs font-medium text-accent">
                    Edición en castellano
                  </span>
                )}
              </p>
              <p className="mt-2 max-w-3xl leading-relaxed">{review.summary}</p>
              <a
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm text-muted underline underline-offset-2 transition-colors duration-150 hover:text-fg sm:min-h-0"
              >
                Leer la reseña en {name}
                <ArrowTopRightOnSquareIcon className="size-3.5" aria-hidden="true" />
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
