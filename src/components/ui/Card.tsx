import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'
import { cardClass } from './styles'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cardClass(false, className)} {...props} />
}

// Hueco de la portada: la imagen se apoya en la base sobre el fondo «well»
export function CardCover({
  children,
  className,
  aspect = 'aspect-[3/4]',
}: {
  children: ReactNode
  className?: string
  aspect?: string
}) {
  return (
    <div className={clsx('relative bg-well px-5 pt-5', className)}>
      <div className={clsx('relative overflow-hidden rounded-t', aspect)}>{children}</div>
    </div>
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('flex flex-1 flex-col gap-1.5 p-4', className)} {...props} />
}
