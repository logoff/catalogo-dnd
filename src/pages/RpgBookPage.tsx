import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowDownTrayIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import MetaTags from '@/components/seo/MetaTags'
import { SpanishMark } from '@/components/ui/Badge'
import Badge from '@/components/ui/Badge'
import { DataList, DataRow, DetailSection } from '@/components/ui/DetailSection'
import LazyImage from '@/components/common/LazyImage'
import ImageLightbox from '@/components/common/ImageLightbox'
import PurchaseButton from '@/components/common/PurchaseButton'
import PurchaseLinks from '@/components/common/PurchaseLinks'
import { buttonClass } from '@/components/ui/styles'
import {
  RpgLoading,
  RpgPage,
  UnofficialNotice,
  type RpgSectionId,
} from '@/components/rpg/RpgSection'
import { useRpgBook, useRpgIndex } from '@/hooks/useRpgData'
import type { RpgBookWithMeta, RpgEdition } from '@/types/rpg'
import { PLACEHOLDER_IMAGE, SITE_URL } from '@/utils/constants'
import { formatISBN } from '@/utils/formatters'
import { isDndEdition, mainCover, systemPath } from '@/utils/rpg'
import { bookKindNames, licenseLabel, rpgFormatNames } from '@/utils/rpgTranslations'
import { formatPartialDate } from '@/utils/videogameTranslations'
import NotFoundPage from './NotFoundPage'

// Ediciones en castellano primero y, dentro de cada idioma, de la más reciente a la más antigua
function sortEditions(editions: RpgEdition[]): RpgEdition[] {
  return [...editions].sort(
    (a, b) =>
      Number(b.language === 'castellano') - Number(a.language === 'castellano') ||
      (b.date ?? '').localeCompare(a.date ?? '')
  )
}

function EditionRow({
  book,
  edition,
  first,
}: {
  book: RpgBookWithMeta
  edition: RpgEdition
  first: boolean
}) {
  const links = edition.purchase_links ?? []
  const details = [
    edition.publisher,
    edition.date && formatPartialDate(edition.date),
    edition.format && rpgFormatNames[edition.format],
    edition.isbn13 && `ISBN ${formatISBN(edition.isbn13)}`,
  ].filter(Boolean)
  return (
    <li>
      <p className="text-fg">
        <span className="font-semibold">
          {edition.language === 'castellano' ? 'Castellano' : 'Inglés'}
        </span>
        : {edition.title ?? book.title}
      </p>
      <p className="text-sm text-muted">{details.join(' · ')}</p>
      {(links.length > 0 || edition.free_download) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {links.map((link, index) => (
            <PurchaseButton
              key={link.url}
              primary={first && index === 0}
              store={link.store}
              url={link.url}
              variant={link.variant}
              tracking={{ rol: `${book.system}/${book.slug}`, idioma: edition.language }}
            />
          ))}
          {edition.free_download && (
            // Copia liberada por la editorial: no es una tienda ni lleva afiliado
            <a
              href={edition.free_download}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('secondary')}
              data-umami-event="descargar"
              data-umami-event-rol={`${book.system}/${book.slug}`}
              data-umami-event-url={edition.free_download}
            >
              <span>Descarga gratuita en Codex de la Marca</span>
              <ArrowDownTrayIcon className="size-3.5 opacity-70" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </li>
  )
}

// También es la ficha de los libros de las ediciones anteriores de D&D, en /ediciones
export default function RpgBookPage({ section = 'rol' }: { section?: RpgSectionId }) {
  const { system: systemSlug = '', book: slug = '' } = useParams<{ system: string; book: string }>()
  const state = useRpgBook(systemSlug, slug)
  const index = useRpgIndex()
  const [lightbox, setLightbox] = useState<number | null>(null)

  if (state.status === 'missing') return <NotFoundPage />
  if (state.status === 'loading' || !index) return <RpgLoading what="el libro" />

  const { book } = state
  const system = index.systems.find((s) => s.slug === book.system)!
  const edition = isDndEdition(system)
  if (edition !== (section === 'ediciones')) return <NotFoundPage />
  const cover = mainCover(book)
  const covers = [
    ...new Set([...(cover ? [cover] : []), ...book.editions.flatMap((e) => e.cover ?? [])]),
  ]
  const editions = sortEditions(book.editions)
  const forSale = editions.some((e) => (e.purchase_links ?? []).length > 0)
  const title = book.titleEs ?? book.title
  const licenses = book.licenses
    .map((slug) => index.licenses.find((l) => l.slug === slug))
    .filter((l) => l !== undefined)

  return (
    <>
      <MetaTags
        title={`${title} (${system.name})`}
        description={book.description.split('\n\n')[0]}
        image={cover ? `${SITE_URL}${cover}` : undefined}
      />
      <RpgPage
        section={section}
        crumbs={[{ label: system.name, to: systemPath(system) }, { label: title }]}
      >
        {!system.official && <UnofficialNotice />}

        <div className="space-y-10">
          <div className="flex flex-col gap-6 md:flex-row md:gap-10">
            <div className="w-40 shrink-0 self-start rounded-xl bg-well p-4 sm:w-52 md:w-64">
              {cover ? (
                <button onClick={() => setLightbox(0)} className="block cursor-zoom-in">
                  <LazyImage
                    src={cover}
                    alt={title}
                    containerClassName="max-h-[28rem] w-auto rounded-lg"
                    className="max-h-[28rem] w-auto rounded-lg object-contain"
                  />
                </button>
              ) : (
                <img src={PLACEHOLDER_IMAGE} alt="" className="max-h-[28rem] w-auto rounded-lg" />
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{book.title}</h1>
                {book.titleEs && book.titleEs !== book.title && (
                  <p className="mt-1 text-lg text-fg">{book.titleEs}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <SpanishMark active={book.spanish}>
                  {book.spanish ? 'En castellano' : 'Solo en inglés'}
                </SpanishMark>
                <Badge variant="outline">{bookKindNames[book.kind]}</Badge>
              </div>

              <DataList>
                <DataRow
                  label={edition ? 'Edición' : 'Sistema'}
                  value={
                    <Link
                      to={systemPath(system)}
                      className="text-fg underline underline-offset-2 hover:text-accent"
                    >
                      {system.name}
                    </Link>
                  }
                />
                <DataRow
                  label="Licencia"
                  value={
                    licenses.length > 0
                      ? licenses.map((license, i) => (
                          <span key={license.slug}>
                            {i > 0 && ', '}
                            <Link
                              to={`/licencia/${license.slug}`}
                              className="text-fg underline underline-offset-2 hover:text-accent"
                            >
                              {licenseLabel(license)}
                            </Link>
                          </span>
                        ))
                      : book.license === 'none'
                        ? 'Sin licencia abierta: se declara compatible'
                        : 'Sin licencia abierta'
                  }
                />
              </DataList>

              <div className="max-w-3xl space-y-3 leading-relaxed">
                {book.description.split(/\n\s*\n/).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <a
                href={book.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-fg sm:min-h-0"
              >
                <GlobeAltIcon className="size-4" aria-hidden="true" />
                Fuente
              </a>
            </div>
          </div>

          <DetailSection title="Ediciones">
            {forSale ? (
              <PurchaseLinks>
                <ul className="space-y-5">
                  {editions.map((edition, i) => (
                    <EditionRow key={i} book={book} edition={edition} first={i === 0} />
                  ))}
                </ul>
              </PurchaseLinks>
            ) : (
              <>
                <ul className="space-y-5">
                  {editions.map((edition, i) => (
                    <EditionRow key={i} book={book} edition={edition} first={i === 0} />
                  ))}
                </ul>
                <p className="mt-4 text-sm text-muted">
                  {edition ? 'Descatalogado.' : 'No está a la venta en las tiendas del sitio.'}
                </p>
              </>
            )}
          </DetailSection>
        </div>

        <ImageLightbox
          images={covers}
          initialIndex={lightbox ?? 0}
          isOpen={lightbox !== null}
          onClose={() => setLightbox(null)}
        />
      </RpgPage>
    </>
  )
}
