import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import type { Review } from '@/types/videogame'
import { platformNames, reviewSourceNames } from '@/utils/videogameTranslations'

interface ReviewScoreProps {
  review: Review
}

// Nota con su escala original, la fuente y el enlace a la reseña o al agregador
export default function ReviewScore({ review }: ReviewScoreProps) {
  const context = [review.platform && platformNames[review.platform], review.edition]
    .filter(Boolean)
    .join(', ')
  const score = Number.isInteger(review.score) ? review.score : review.score.toLocaleString('es-ES')

  return (
    <a
      href={review.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-baseline gap-2 text-gray-300 hover:text-dnd-gold"
    >
      <span className="font-display text-2xl text-dnd-gold">{score}</span>
      <span className="text-sm text-gray-400">/{review.scale}</span>
      <span>
        {reviewSourceNames[review.source]}
        {context && <span className="text-gray-400"> ({context})</span>}
      </span>
      <ArrowTopRightOnSquareIcon className="h-3 w-3 self-center opacity-60 group-hover:opacity-100" />
    </a>
  )
}
