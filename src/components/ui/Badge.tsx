import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'
import { badgeClass, type BadgeVariant } from './styles'

export default function Badge({
  variant,
  mono = false,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant; mono?: boolean }) {
  return <span className={badgeClass(variant, clsx(mono && 'font-mono', className))} {...props} />
}

// Marca de disponibilidad en castellano: punto y texto en el color de acento.
// Sin castellano (`active` a false), solo el texto en neutro
export function SpanishMark({
  children,
  active = true,
  className,
}: {
  children: ReactNode
  active?: boolean
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 text-sm',
        active ? 'text-accent' : 'text-muted',
        className
      )}
    >
      {active && <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />}
      {children}
    </span>
  )
}
