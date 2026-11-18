import type { ReactNode } from 'react'
import { slugify } from '@/utils/formatters'

// Sección de una ficha, con un ancla para la navegación por secciones
export function DetailSection({
  title,
  id = slugify(title),
  children,
}: {
  title: string
  id?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-line pt-8">
      <h2 className="mb-4 text-xl">{title}</h2>
      {children}
    </section>
  )
}

// Datos de la cabecera de una ficha, en dos columnas: etiqueta y valor
export function DataList({ children }: { children: ReactNode }) {
  return (
    <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-2 text-sm sm:grid-cols-[10rem_1fr]">
      {children}
    </dl>
  )
}

export function DataRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </>
  )
}
