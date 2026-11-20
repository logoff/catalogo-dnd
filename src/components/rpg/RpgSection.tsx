import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import type { RpgBookSummary, RpgSystem } from '@/types/rpg'
import { bookPath } from '@/utils/rpg'
import { bookKindGroups, bookKindNames } from '@/utils/rpgTranslations'
import { SpanishMark } from '@/components/ui/Badge'
import { headingClass } from '@/components/ui/styles'

export const SECTION_NAME = 'Otros juegos de rol'
export const EDITIONS_NAME = 'Ediciones de D&D'

// Las fichas de sistema y de libro sirven a dos secciones: otros juegos de rol y las ediciones
// anteriores de D&D, que usan el mismo modelo de datos
export type RpgSectionId = 'rol' | 'ediciones'

const SECTIONS: Record<RpgSectionId, { name: string; path: string }> = {
  rol: { name: SECTION_NAME, path: '/rol' },
  ediciones: { name: EDITIONS_NAME, path: '/ediciones' },
}

// Contenedor de las páginas de la sección, con las migas de pan
export function RpgPage({
  crumbs,
  children,
  section = 'rol',
}: {
  crumbs: { label: string; to?: string }[]
  children: ReactNode
  section?: RpgSectionId
}) {
  const { name, path } = SECTIONS[section]
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: name, to: path }, ...crumbs]} />
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

const yearOf = (date: string | null) => (date ? date.slice(0, 4) : null)

// Marca de castellano de un libro: su título en castellano (o «En castellano» si no cambia) y
// el año de la primera edición en castellano, para no confundirlo con el del original
export function SpanishEditionMark({
  book,
  className,
}: {
  book: RpgBookSummary
  className?: string
}) {
  if (!book.spanish) return null
  const year = yearOf(book.spanishDate)
  return (
    <SpanishMark className={className}>
      <span lang="es">
        {book.titleEs && book.titleEs !== book.title ? book.titleEs : 'En castellano'}
      </span>
      {year && <span className="font-mono tabular-nums">· {year}</span>}
    </SpanishMark>
  )
}

// Lista compacta de libros con enlace a su ficha: título y año del original y, debajo, el título
// y el año en castellano. Dentro de un grupo de una misma edición y tipo, sin sistema ni tipo
export function BookList({
  books,
  systems,
  yearOnly = false,
}: {
  books: RpgBookSummary[]
  systems: RpgSystem[]
  yearOnly?: boolean
}) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {books.map((book) => {
        const system = systems.find((s) => s.slug === book.system)
        const year = yearOf(book.originalDate)
        return (
          <li
            key={book.slug}
            className="flex flex-wrap items-baseline justify-between gap-x-4 py-2"
          >
            <div className="min-w-0">
              <Link
                to={bookPath(book, systems)}
                className="font-medium text-fg underline-offset-2 hover:underline"
              >
                {book.title}
              </Link>
              {year && (
                <span className="ml-1.5 font-mono text-sm text-muted tabular-nums">· {year}</span>
              )}
              <div>
                <SpanishEditionMark book={book} />
              </div>
            </div>
            {!yearOnly && (
              <span className="text-sm text-muted">
                {[system?.name, bookKindNames[book.kind]].filter(Boolean).join(' · ')}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

// Libros de una edición anterior de D&D agrupados por tipo, cada grupo por la fecha del original
export function BooksByKind({ books, systems }: { books: RpgBookSummary[]; systems: RpgSystem[] }) {
  return (
    <div className="space-y-6">
      {bookKindGroups.map(([kind, title]) => {
        const group = books
          .filter((book) => book.kind === kind)
          .sort((a, b) => (a.originalDate ?? '').localeCompare(b.originalDate ?? ''))
        if (group.length === 0) return null
        return (
          <section key={kind} aria-label={title}>
            <h3 className={headingClass('group', 'mb-2')}>{title}</h3>
            <BookList books={group} systems={systems} yearOnly />
          </section>
        )
      })}
    </div>
  )
}
