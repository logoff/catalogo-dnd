import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import PageHeader from '@/components/ui/PageHeader'
import SearchField from '@/components/ui/SearchField'
import { cardClass, selectClass } from '@/components/ui/styles'
import RpgBookCard from '@/components/rpg/RpgBookCard'
import { RpgLoading, SECTION_NAME } from '@/components/rpg/RpgSection'
import { useRpgIndex } from '@/hooks/useRpgData'
import type { RpgSystem } from '@/types/rpg'
import { filterBooks, sortBooks, type RpgSort } from '@/utils/rpgFilters'
import { licenseLabel } from '@/utils/rpgTranslations'

const SORTS: { value: RpgSort; label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguos' },
  { value: 'title', label: 'Título' },
]

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-muted">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass.replace('pl-9', 'pl-3')}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default function RpgSectionPage() {
  const index = useRpgIndex()
  const [searchQuery, setSearchQuery] = useState('')
  const [system, setSystem] = useState('')
  const [license, setLicense] = useState('')
  const [spanishOnly, setSpanishOnly] = useState(false)
  const [sort, setSort] = useState<RpgSort>('newest')

  const results = useMemo(
    () =>
      index
        ? sortBooks(filterBooks(index.books, { searchQuery, system, license, spanishOnly }), sort)
        : [],
    [index, searchQuery, system, license, spanishOnly, sort]
  )

  if (!index) return <RpgLoading what="la sección" />

  // Sistemas agrupados por familia, en el orden de la edición más antigua de cada una
  const families = new Map<string, RpgSystem[]>()
  for (const s of index.systems) families.set(s.family, [...(families.get(s.family) ?? []), s])
  const booksOf = (slug: string) => index.books.filter((b) => b.system === slug).length

  return (
    <>
      <MetaTags
        title="Otros juegos de rol: Pathfinder, Tales of the Valiant y más"
        description="Juegos de rol de la familia de D&D que no son de Wizards of the Coast: Pathfinder, Starfinder, Tales of the Valiant, Daggerheart y libros de terceros para 5E, con lo publicado en castellano y sus licencias abiertas."
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: SECTION_NAME }]} />
        <PageHeader
          title={SECTION_NAME}
          description="Juegos de la familia de D&D que no son de Wizards of the Coast y libros de otras editoriales para 5E, con sus ediciones en inglés y en castellano. No es contenido oficial de D&D."
        />

        <section aria-labelledby="sistemas" className="mb-12">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="sistemas" className="text-xl">
              Sistemas
            </h2>
            <Link
              to="/licencias"
              className="text-sm text-muted underline underline-offset-2 hover:text-fg"
            >
              Licencias abiertas
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...families.values()].map((members) => (
              <li key={members[0].family} className={cardClass(false, 'p-4')}>
                <ul className="space-y-2">
                  {members.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={`/rol/${s.slug}`}
                        className="font-medium text-fg underline-offset-2 hover:underline"
                      >
                        {s.name}
                      </Link>
                      <p className="text-sm text-muted">
                        {s.publisher} ·{' '}
                        {s.official_catalog
                          ? 'catálogo oficial'
                          : booksOf(s.slug) === 1
                            ? '1 libro'
                            : `${booksOf(s.slug)} libros`}
                      </p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="libros">
          <h2 id="libros" className="mb-4 text-xl">
            Libros
          </h2>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
            <SearchField
              label="Buscar libros"
              placeholder="Título o editorial"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              containerClassName="lg:col-span-2"
            />
            <Select
              label="Sistema"
              value={system}
              onChange={setSystem}
              options={[
                { value: '', label: 'Todos' },
                ...index.systems
                  .filter((s) => booksOf(s.slug) > 0)
                  .map((s) => ({ value: s.slug, label: s.name })),
              ]}
            />
            <Select
              label="Licencia"
              value={license}
              onChange={setLicense}
              options={[
                { value: '', label: 'Todas' },
                ...index.licenses
                  .filter((l) => index.books.some((b) => b.licenses.includes(l.slug)))
                  .map((l) => ({ value: l.slug, label: licenseLabel(l) })),
              ]}
            />
            <Select
              label="Orden"
              value={sort}
              onChange={(value) => setSort(value as RpgSort)}
              options={SORTS}
            />
          </div>
          <label className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-fg sm:min-h-0">
            <input
              type="checkbox"
              checked={spanishOnly}
              onChange={(e) => setSpanishOnly(e.target.checked)}
              className="size-4 rounded border-line bg-surface text-accent-solid focus:ring-0 focus:ring-offset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            />
            En castellano
          </label>

          <p className="mb-4 text-sm text-muted">
            {results.length === 1 ? '1 libro' : `${results.length} libros`}
          </p>
          {results.length > 0 ? (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {results.map((book) => (
                <li key={book.slug}>
                  <RpgBookCard
                    book={book}
                    system={index.systems.find((s) => s.slug === book.system)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-12 text-center text-muted">Ningún libro coincide con los filtros.</p>
          )}
        </section>
      </div>
    </>
  )
}
