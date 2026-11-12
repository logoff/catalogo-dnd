import clsx from 'clsx'
import type { SpanishSummary } from '@/types/videogame'
import { spanishSummaryNames } from '@/utils/videogameTranslations'

interface SpanishBadgeProps {
  summary: SpanishSummary
}

// Resumen del mejor castellano disponible, para tarjetas y cabecera de la ficha
export default function SpanishBadge({ summary }: SpanishBadgeProps) {
  return (
    <span
      className={clsx('badge', {
        'badge-castellano': summary === 'full' || summary === 'text',
        'badge-english': summary === 'none',
      })}
    >
      {spanishSummaryNames[summary]}
    </span>
  )
}
