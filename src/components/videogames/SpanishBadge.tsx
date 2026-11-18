import type { SpanishSummary } from '@/types/videogame'
import { spanishSummaryNames } from '@/utils/videogameTranslations'
import { SpanishMark } from '@/components/ui/Badge'

interface SpanishBadgeProps {
  summary: SpanishSummary
}

// Resumen del mejor castellano disponible, para tarjetas y cabecera de la ficha
export default function SpanishBadge({ summary }: SpanishBadgeProps) {
  return <SpanishMark active={summary !== 'none'}>{spanishSummaryNames[summary]}</SpanishMark>
}
