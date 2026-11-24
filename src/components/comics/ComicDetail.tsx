import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import type { ComicEditionWithMeta, ComicIssue, ComicSummary, ComicWithMeta } from '@/types/comic'
import { getProductByCodeAndEdition } from '@/services/dataLoader'
import { getVideogameBySlug } from '@/services/videogameLoader'
import { getMerchandiseBySlug } from '@/services/merchandiseLoader'
import { getNovelIndex } from '@/services/novelLoader'
import { thumbnailOf } from '@/utils/comics'
import { formatNames, kindNames, settingNames, spanishNames } from '@/utils/comicTranslations'
import { formatPartialDate } from '@/utils/videogameTranslations'
import { DataList, DataRow, DetailSection } from '@/components/ui/DetailSection'
import { SpanishMark } from '@/components/ui/Badge'
import SectionNav from '@/components/ui/SectionNav'
import ImageLightbox from '../common/ImageLightbox'
import LazyImage from '../common/LazyImage'
import PurchaseButton from '../common/PurchaseButton'
import PurchaseLinks from '../common/PurchaseLinks'
import { COMIC_PLACEHOLDER } from './ComicCard'

function formatIsbn(isbn: number): string {
  const s = String(isbn)
  return `${s.slice(0, 3)}-${s.slice(3)}`
}

// Rango de números que recoge un tomo, para mostrarlo: «números 1-5»
function contentsLabel(edition: ComicEditionWithMeta, slug: string): string | null {
  const own = (edition.contents ?? []).filter((c) => c.series === slug).map((c) => c.issues)
  if (own.length === 0) return null
  return `Números ${own.join(', ')}`
}

interface Props {
  comic: ComicWithMeta
  index: ComicSummary[]
}

export default function ComicDetail({ comic, index }: Props) {
  const titleOf = (slug: string) => index.find((c) => c.slug === slug)?.title ?? slug
  const tomos = comic.editions.filter((e) => e.format !== 'issue')
  const grapas = comic.editions.filter((e) => e.format === 'issue')
  const forSaleFirst = (list: ComicEditionWithMeta[]) =>
    [...list].sort(
      (a, b) =>
        Number((b.purchase_links ?? []).length > 0) - Number((a.purchase_links ?? []).length > 0)
    )
  const spanishTomos = forSaleFirst(tomos.filter((e) => e.language === 'castellano'))
  const englishTomos = forSaleFirst(tomos.filter((e) => e.language === 'english'))

  // Portadas para el visor: la principal, las de los números y las de las ediciones
  const issueCovers = comic.issues.map((i) => i.cover).filter((c): c is string => !!c)
  const covers = [
    ...new Set([
      ...(comic.cover ? [comic.cover] : []),
      ...issueCovers,
      ...comic.editions.flatMap((e) => [
        ...(e.cover ? [e.cover] : []),
        ...(e.issues ?? []).flatMap((i) => (i.cover ? [i.cover] : [])),
      ]),
    ]),
  ]
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const openCover = (image: string) => setLightboxIndex(covers.indexOf(image))

  const novels = getNovelIndex()?.novels ?? []
  const relatedNovels = (comic.related_novels ?? []).map((slug) => ({
    slug,
    title: novels.find((n) => n.slug === slug)?.title ?? slug,
  }))
  const relatedProducts = (comic.related_products ?? [])
    .map((rel) => getProductByCodeAndEdition(rel.code, rel.edition))
    .filter((product) => product !== undefined)
  const relatedGames = (comic.related_videogames ?? [])
    .map((slug) => getVideogameBySlug(slug))
    .filter((game) => game !== undefined)
  const relatedMerchandise = (comic.related_merchandise ?? [])
    .map((slug) => getMerchandiseBySlug(slug))
    .filter((item) => item !== undefined)
  const hasRelated =
    relatedNovels.length +
      relatedProducts.length +
      relatedGames.length +
      relatedMerchandise.length >
    0

  const people = (label: string, list?: string[]) =>
    list && list.length > 0 ? <DataRow label={label} value={list.join(', ')} /> : null

  const sections = [
    { id: 'donde-leerla', label: 'Dónde leerla' },
    { id: 'numeros', label: 'Números' },
    ...(grapas.length > 0 ? [{ id: 'grapas-en-castellano', label: 'Grapas en castellano' }] : []),
    ...(hasRelated ? [{ id: 'relacionado', label: 'Relacionado' }] : []),
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <div className="w-40 shrink-0 self-start rounded-xl bg-well p-4 sm:w-52 md:w-64">
          {comic.cover ? (
            <button onClick={() => openCover(comic.cover!)} className="block cursor-zoom-in">
              <LazyImage
                src={comic.cover}
                alt={comic.title}
                containerClassName="max-h-[28rem] w-auto rounded-lg"
                className="max-h-[28rem] w-auto rounded-lg object-contain"
              />
            </button>
          ) : (
            <img src={COMIC_PLACEHOLDER} alt="" className="max-h-[28rem] w-auto rounded-lg" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{comic.title}</h1>
            {comic.spanishTitle && comic.spanishTitle !== comic.title && (
              <p className="mt-1 text-lg">
                <SpanishMark active={comic.spanish === 'spain'}>{comic.spanishTitle}</SpanishMark>
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <SpanishMark active={comic.spanish === 'spain'}>
              {spanishNames[comic.spanish]}
            </SpanishMark>
            <span className="inline-flex items-center rounded-md border border-line px-1.5 py-0.5 text-xs font-medium text-muted">
              {kindNames[comic.kind]}
            </span>
          </div>

          <DataList>
            <DataRow label="Editorial" value={comic.publisher} />
            <DataRow label="Mundo" value={settingNames[comic.setting]} />
            <DataRow label="Publicación" value={comic.years} />
            <DataRow
              label="Números"
              value={
                comic.announced ? `${comic.issue_count} (anunciados)` : String(comic.issue_count)
              }
            />
            {people('Guion', comic.writers)}
            {people('Dibujo', comic.artists)}
          </DataList>

          {(comic.continues || comic.continuedBy) && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {comic.continues && (
                <Link to={`/comic/${comic.continues}`} className="inline-flex items-center gap-1.5">
                  <ArrowLeftIcon className="size-4" aria-hidden="true" />
                  Continúa {titleOf(comic.continues)}
                </Link>
              )}
              {comic.continuedBy && (
                <Link
                  to={`/comic/${comic.continuedBy}`}
                  className="inline-flex items-center gap-1.5"
                >
                  Sigue en {titleOf(comic.continuedBy)}
                  <ArrowRightIcon className="size-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          )}

          <div className="max-w-3xl space-y-3 leading-relaxed">
            {comic.description.split(/\n\s*\n/).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <a
            href={comic.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-fg sm:min-h-0"
          >
            <GlobeAltIcon className="size-4" aria-hidden="true" />
            Fuente
          </a>
        </div>
      </div>

      <SectionNav sections={sections} />

      <DetailSection title="Dónde leerla">
        {!comic.availableToBuy && (
          <p className="mb-5 text-fg">
            {tomos.length === 0
              ? 'No se ha recopilado en tomo y está descatalogada.'
              : 'Ninguna edición está a la venta en las tiendas del sitio: está descatalogada.'}
          </p>
        )}
        <h3 className="mb-3 text-xs font-medium text-muted uppercase">En castellano</h3>
        {spanishTomos.length > 0 ? (
          <EditionList
            editions={spanishTomos}
            comic={comic}
            onOpenCover={openCover}
            titleOf={titleOf}
          />
        ) : (
          <p className="mb-6 text-fg">
            {grapas.some((g) => g.language === 'castellano')
              ? 'Solo se publicó en castellano en grapa (ver más abajo).'
              : 'No se ha publicado en castellano.'}
          </p>
        )}
        {englishTomos.length > 0 && (
          <>
            <h3 className="mt-8 mb-3 text-xs font-medium text-muted uppercase">En inglés</h3>
            <EditionList
              editions={englishTomos}
              comic={comic}
              onOpenCover={openCover}
              titleOf={titleOf}
            />
          </>
        )}
      </DetailSection>

      <DetailSection title="Números">
        <IssueGrid issues={comic.issues} collectedIn={comic.collectedIn} onOpenCover={openCover} />
      </DetailSection>

      {grapas.length > 0 && (
        <DetailSection title="Grapas en castellano">
          {grapas.map((grapa, i) => (
            <div key={i} className="mb-8">
              <p className="mb-4 text-fg">
                {[
                  grapa.title ?? comic.title,
                  grapa.publisher,
                  grapa.date && formatPartialDate(grapa.date),
                ]
                  .filter(Boolean)
                  .join(' · ')}
                {grapa.spain === false && ' · publicada fuera de España'}
              </p>
              <IssueGrid issues={grapa.issues ?? []} onOpenCover={openCover} />
            </div>
          ))}
        </DetailSection>
      )}

      {hasRelated && (
        <DetailSection title="Relacionado">
          <ul className="space-y-2">
            {relatedNovels.map((n) => (
              <RelatedLink key={n.slug} to={`/novela/${n.slug}`} label={n.title} kind="novela" />
            ))}
            {relatedProducts.map((p) => (
              <RelatedLink
                key={p.code}
                to={`/producto/${p.primaryEdition === '5e' ? '2014' : '2024'}/${p.slug}`}
                label={p.primaryTitle}
                kind="libro de rol"
              />
            ))}
            {relatedGames.map((g) => (
              <RelatedLink
                key={g.slug}
                to={`/videojuego/${g.slug}`}
                label={g.title}
                kind="videojuego"
              />
            ))}
            {relatedMerchandise.map((m) => (
              <RelatedLink
                key={m.slug}
                to={`/merchandising/${m.slug}`}
                label={m.title}
                kind="merchandising"
              />
            ))}
          </ul>
        </DetailSection>
      )}

      <ImageLightbox
        images={covers}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  )
}

function EditionList({
  editions,
  comic,
  onOpenCover,
  titleOf,
}: {
  editions: ComicEditionWithMeta[]
  comic: ComicWithMeta
  onOpenCover: (cover: string) => void
  titleOf: (slug: string) => string
}) {
  return (
    <ForSale editions={editions}>
      <ul className="mb-6 space-y-5">
        {editions.map((edition, i) => {
          const details = [
            edition.publisher,
            edition.date && formatPartialDate(edition.date),
            formatNames[edition.format],
            contentsLabel(edition, comic.slug),
            edition.isbn13 && `ISBN ${formatIsbn(edition.isbn13)}`,
            edition.spain === false && 'publicada fuera de España',
          ].filter(Boolean)
          const links = edition.purchase_links ?? []
          return (
            <li key={i} className="flex gap-4">
              {edition.cover ? (
                <button
                  onClick={() => onOpenCover(edition.cover!)}
                  className="shrink-0 cursor-zoom-in"
                  aria-label={`Ver portada de ${edition.title ?? comic.title}`}
                >
                  <LazyImage
                    src={thumbnailOf(edition.cover)}
                    alt=""
                    containerClassName="aspect-[2/3] w-16 rounded"
                    className="h-full w-full rounded object-cover"
                  />
                </button>
              ) : (
                <div className="w-16 shrink-0" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <p className="font-medium">{edition.title ?? comic.title}</p>
                <p className="text-sm text-muted">{details.join(' · ')}</p>
                {edition.otherSeries.length > 0 && (
                  <p className="text-sm text-muted">
                    También recoge{' '}
                    {edition.otherSeries.map((slug, j) => (
                      <span key={slug}>
                        {j > 0 && ', '}
                        <Link to={`/comic/${slug}`}>{titleOf(slug)}</Link>
                      </span>
                    ))}
                  </p>
                )}
                {links.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {links.map((link, index) => (
                      <PurchaseButton
                        key={link.url}
                        primary={i === 0 && index === 0}
                        store={link.store}
                        url={link.url}
                        tracking={{
                          comic: comic.slug,
                          idioma: edition.language,
                          formato: edition.format,
                        }}
                        variant={
                          link.store === 'amazon' && edition.format === 'digital'
                            ? 'Kindle'
                            : undefined
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </ForSale>
  )
}

function IssueGrid({
  issues,
  collectedIn,
  onOpenCover,
}: {
  issues: ComicIssue[]
  collectedIn?: Record<string, string[]>
  onOpenCover: (cover: string) => void
}) {
  return (
    <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {issues.map((issue) => (
        <li key={issue.number} className="flex flex-col gap-1.5">
          {issue.cover ? (
            <button
              onClick={() => onOpenCover(issue.cover!)}
              className="cursor-zoom-in"
              aria-label={`Ver portada del número ${issue.number}`}
            >
              <LazyImage
                src={thumbnailOf(issue.cover)}
                alt=""
                containerClassName="aspect-[2/3] w-full rounded"
                className="h-full w-full rounded object-cover"
              />
            </button>
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded bg-well font-mono text-lg text-muted">
              {issue.number}
            </div>
          )}
          <p className="text-sm font-medium">
            <span className="font-mono">#{issue.number}</span>
            {issue.title && <span className="font-normal"> {issue.title}</span>}
          </p>
          {issue.date && (
            <p className="font-mono text-xs text-muted">{formatPartialDate(issue.date)}</p>
          )}
          {collectedIn?.[issue.number] && (
            <p className="text-xs text-muted">En {collectedIn[issue.number][0]}</p>
          )}
        </li>
      ))}
    </ul>
  )
}

function ForSale({
  editions,
  children,
}: {
  editions: { purchase_links?: unknown[] }[]
  children: ReactNode
}) {
  return editions.some((e) => (e.purchase_links ?? []).length > 0) ? (
    <PurchaseLinks>{children}</PurchaseLinks>
  ) : (
    <>{children}</>
  )
}

function RelatedLink({ to, label, kind }: { to: string; label: string; kind: string }) {
  return (
    <li>
      <Link
        to={to}
        className="underline decoration-muted underline-offset-2 transition-colors duration-150 hover:decoration-fg"
      >
        {label}
      </Link>
      <span className="text-sm text-muted"> ({kind})</span>
    </li>
  )
}
