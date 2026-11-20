import { Link } from 'react-router-dom'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import PageHeader from '@/components/ui/PageHeader'
import { cardClass } from '@/components/ui/styles'
import { EDITIONS_NAME, RpgLoading } from '@/components/rpg/RpgSection'
import { useRpgIndex } from '@/hooks/useRpgData'
import { isDndEdition, systemPath } from '@/utils/rpg'
import { formatPartialDate } from '@/utils/videogameTranslations'

// Todas las ediciones oficiales de D&D por fecha: las anteriores a la 5E enlazan a su ficha y las
// de 5E, al catálogo oficial
export default function DndEditionsPage() {
  const index = useRpgIndex()
  if (!index) return <RpgLoading what="las ediciones" />

  const editions = index.systems
    .filter((s) => s.official && s.family === 'dungeons-and-dragons')
    .sort((a, b) => a.date.localeCompare(b.date))
  const booksOf = (slug: string) => index.books.filter((b) => b.system === slug).length

  return (
    <>
      <MetaTags
        title="Ediciones de D&D: todas las ediciones de Dungeons & Dragons"
        description="Todas las ediciones de Dungeons & Dragons por fecha: las anteriores a la 5E, con qué las caracteriza y todos sus libros oficiales en inglés y en castellano, y la 5E y la 5.5E."
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: EDITIONS_NAME }]} />
        <PageHeader
          title={EDITIONS_NAME}
          description="Todas las ediciones de Dungeons & Dragons, de la más antigua a la actual. Las anteriores a la 5E tienen aquí su ficha y todos sus libros oficiales, con su edición en castellano si salió; son libros descatalogados, sin enlaces de compra. La 5E y la 5.5E enlazan a su catálogo."
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {editions.map((edition) => {
            const count = booksOf(edition.slug)
            return (
              <li key={edition.slug}>
                <Link
                  to={isDndEdition(edition) ? systemPath(edition) : edition.official_catalog!}
                  className={cardClass(true, 'h-full p-4')}
                >
                  <span className="text-lg font-medium text-fg">{edition.name}</span>
                  <span className="text-sm text-muted">
                    {edition.publisher} · {formatPartialDate(edition.date)}
                  </span>
                  <span className="text-sm text-muted">
                    {isDndEdition(edition)
                      ? count === 1
                        ? '1 libro'
                        : `${count} libros`
                      : 'Catálogo oficial'}
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </>
  )
}
