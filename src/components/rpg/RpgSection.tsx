import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import type { RpgBookSummary, RpgSystem } from '@/types/rpg'
import { bookKindNames } from '@/utils/rpgTranslations'

export const SECTION_NAME = 'Otros juegos de rol'

// Contenedor de las páginas de la sección, con las migas de pan
export function RpgPage({
  crumbs,
  children,
}: {
  crumbs: { label: string; to?: string }[]
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: SECTION_NAME, to: '/rol' }, ...crumbs]} />
      {children}
    </div>
  )
}

export function RpgLoading({ what }: { what: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="py-12 text-center text-muted">Cargando {what}…</p>
    </div>
  )
}

// Aviso de que el contenido de la sección no es D&D oficial, para distinguir sus fichas de las
// del catálogo
export function UnofficialNotice() {
  return (
    <p className="mb-6 rounded-lg border border-line bg-well px-3 py-2 text-sm text-muted">
      {SECTION_NAME}: no es un producto oficial de Dungeons & Dragons ni de Wizards of the Coast.
    </p>
  )
}

// Lista compacta de libros con enlace a su ficha
export function BookList({ books, systems }: { books: RpgBookSummary[]; systems: RpgSystem[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {books.map((book) => {
        const system = systems.find((s) => s.slug === book.system)
        return (
          <li
            key={book.slug}
            className="flex flex-wrap items-baseline justify-between gap-x-4 py-2"
          >
            <Link
              to={`/rol/${book.system}/${book.slug}`}
              className="font-medium text-fg underline-offset-2 hover:underline"
            >
              {book.titleEs ?? book.title}
            </Link>
            <span className="text-sm text-muted">
              {[system?.name, bookKindNames[book.kind], book.year].filter(Boolean).join(' · ')}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
