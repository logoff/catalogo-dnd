import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  // Recuento de resultados u otro dato breve bajo el título
  meta?: ReactNode
  // Controles a la derecha (vista, orden…)
  actions?: ReactNode
}

// Cabecera de las páginas de listado: título, descripción y controles
export default function PageHeader({ title, description, meta, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex max-w-3xl flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="text-base text-muted">{description}</p>}
        {meta && <p className="text-sm text-muted">{meta}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
