import clsx from 'clsx'
import { formatMonthYear } from '@/utils/formatters'

interface SpanishAvailabilityProps {
  // Fecha de la primera edición en castellano, si la hay
  date?: string | null
  // Si existe edición en castellano (aunque no tenga fecha)
  available: boolean
  className?: string
}

// Marca de las tarjetas: en castellano (con el acento) o solo en inglés (neutro)
export default function SpanishAvailability({
  date,
  available,
  className,
}: SpanishAvailabilityProps) {
  if (!available) {
    return <span className={clsx('text-sm text-muted', className)}>Solo en inglés</span>
  }

  const upcoming = date ? date > new Date().toISOString().slice(0, 10) : true
  const label = !date
    ? 'En castellano, sin fecha'
    : upcoming
      ? `En castellano en ${formatMonthYear(date)}`
      : `En castellano · ${formatMonthYear(date)}`

  return (
    <span className={clsx('inline-flex items-center gap-1.5 text-sm text-accent', className)}>
      <span
        className={clsx(
          'size-1.5 shrink-0 rounded-full',
          upcoming ? 'border border-accent' : 'bg-accent'
        )}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}
