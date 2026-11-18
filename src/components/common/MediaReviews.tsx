import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { getReviewOutlet } from '@/services/reviewOutlets'
import { formatDate } from '@/utils/formatters'
import type { Review } from '@/types'

const languageLabel = { english: 'En inglés', castellano: 'En castellano' } as const

// Cada reseña con la nota en la escala de su medio: nunca se calcula una media
export default function MediaReviews({ reviews }: { reviews: Review[] }) {
  const sorted = [...reviews].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section className="card-dnd p-6">
      <h2 className="font-display text-2xl text-dnd-gold mb-4">Reseñas</h2>
      <ul className="divide-y divide-dnd-gold/20">
        {sorted.map((review) => {
          const outlet = getReviewOutlet(review.outlet)
          const name = outlet?.name ?? review.outlet
          const details = [
            languageLabel[review.language],
            review.author,
            formatDate(review.date),
          ].filter(Boolean)

          return (
            <li key={review.url} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold text-lg text-gray-100">{name}</h3>
                {review.score !== undefined && outlet?.scale && (
                  <p className="font-display text-xl text-dnd-gold">
                    {`${review.score}/${outlet.scale}`}
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-400">
                {details.join(' · ')}
                {review.spanish_edition && (
                  <span className="ml-2 rounded bg-dnd-gold/15 px-2 py-0.5 text-dnd-gold">
                    Edición en castellano
                  </span>
                )}
              </p>
              <p className="mt-2 text-gray-300 leading-relaxed">{review.summary}</p>
              <a
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-dnd-gold hover:text-dnd-gold-light underline underline-offset-2"
              >
                Leer la reseña en {name}
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
