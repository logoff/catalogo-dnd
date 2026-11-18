import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import type {
  NovelCollection,
  NovelEdition,
  NovelIndex,
  NovelLanguage,
  NovelWithMeta,
} from '@/types/novel'
import { getProductByCodeAndEdition } from '@/services/dataLoader'
import { getVideogameBySlug } from '@/services/videogameLoader'
import { getMerchandiseBySlug } from '@/services/merchandiseLoader'
import { getAllSeries, getAnthologiesFor } from '@/services/novelLoader'
import { collectionsIn, mainCover, thumbnailOf } from '@/utils/novels'
import {
  countryNames,
  formatNames,
  kindNames,
  seriesName,
  settingNames,
} from '@/utils/novelTranslations'
import { formatPartialDate } from '@/utils/videogameTranslations'
import ImageLightbox from '../common/ImageLightbox'
import LazyImage from '../common/LazyImage'
import PurchaseButton from '../common/PurchaseButton'
import MediaReviews from '../common/MediaReviews'
import NovelBestseller from './NovelBestseller'
import NovelSpanishBadge from './NovelSpanishBadge'
import { NOVEL_PLACEHOLDER } from './NovelCard'

interface NovelDetailProps {
  novel: NovelWithMeta
  // Para la lista de la serie: el listado ya sabe las novelas de cada una y su número
  index: NovelIndex
}

function byDateDesc<T extends { date?: string }>(a: T, b: T): number {
  return (b.date ?? '').localeCompare(a.date ?? '')
}

function formatIsbn(isbn: number): string {
  const digits = String(isbn)
  return `${digits.slice(0, 3)}-${digits.slice(3)}`
}

// Dónde se publicó: país en las inglesas; en las castellanas, solo si fue fuera de España
function placeOf(edition: NovelEdition | NovelCollection): string | null {
  if (edition.language === 'english') return edition.country ? countryNames[edition.country] : null
  return edition.spain ? null : 'Fuera de España'
}

export default function NovelDetail({ novel, index }: NovelDetailProps) {
  const collections = collectionsIn(getAllSeries(), novel.slug).sort(byDateDesc)
  // Antologías: primero las traducidas y, dentro de eso, por fecha de publicación. De cada una
  // se ven las ediciones a la venta (o, si no hay, la más reciente, en castellano si la hay) y
  // el resto queda plegado
  const anthologies = getAnthologiesFor(novel)
    .map((a) => {
      const editions = [...a.editions].sort(
        (x, y) =>
          Number(y.language === 'castellano') - Number(x.language === 'castellano') ||
          byDateDesc(x, y)
      )
      const forSale = editions.filter((e) => (e.purchase_links ?? []).length > 0)
      const shown = forSale.length > 0 ? forSale : editions.slice(0, 1)
      const firstDate = a.editions.map((e) => e.date ?? '9999').sort()[0]
      return { ...a, firstDate, shown, folded: editions.filter((e) => !shown.includes(e)) }
    })
    .sort(
      (a, b) =>
        Number(!!b.title_es) - Number(!!a.title_es) || a.firstDate.localeCompare(b.firstDate)
    )

  // Portadas de todas las ediciones, la principal primero, para el visor
  const cover = mainCover(novel)
  const covers = [
    ...new Set([
      ...(cover ? [cover] : []),
      ...[...novel.editions, ...collections, ...anthologies.flatMap((a) => a.editions)]
        .map((e) => e.cover)
        .filter((c): c is string => !!c),
    ]),
  ]
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const openCover = (image: string) => setLightboxIndex(covers.indexOf(image))

  const seriesMeta = novel.series && index.series.find((s) => s.id === novel.series!.id)
  const seriesNovels = novel.series
    ? index.novels
        .filter((n) => n.series?.id === novel.series!.id)
        .sort((a, b) => a.series!.number - b.series!.number)
    : []
  const position = seriesNovels.findIndex((n) => n.slug === novel.slug)
  const previous = position > 0 ? seriesNovels[position - 1] : undefined
  const next = position >= 0 ? seriesNovels[position + 1] : undefined

  const editionsIn = (language: NovelLanguage) =>
    novel.editions.filter((e) => e.language === language).sort(byDateDesc)
  const spanishEditions = editionsIn('castellano')
  const englishEditions = editionsIn('english')
  const spanishCollections = collections.filter((c) => c.language === 'castellano')

  const relatedProducts = (novel.related_products ?? [])
    .map((rel) => getProductByCodeAndEdition(rel.code, rel.edition))
    .filter((product) => product !== undefined)
  const relatedGames = (novel.related_videogames ?? [])
    .map((slug) => getVideogameBySlug(slug))
    .filter((game) => game !== undefined)
  const relatedMerchandise = (novel.related_merchandise ?? [])
    .map((slug) => getMerchandiseBySlug(slug))
    .filter((item) => item !== undefined)
  const hasRelated =
    relatedProducts.length > 0 || relatedGames.length > 0 || relatedMerchandise.length > 0

  const renderEdition = (edition: NovelEdition | NovelCollection, key: string) => (
    <EditionRow
      key={key}
      edition={edition}
      fallbackTitle={novel.title}
      slug={novel.slug}
      onOpenCover={openCover}
    />
  )

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex justify-center md:justify-start">
          {cover ? (
            <button onClick={() => openCover(cover)} className="block cursor-zoom-in">
              <LazyImage
                src={cover}
                alt={novel.titleEs ?? novel.title}
                containerClassName="max-h-[28rem] w-auto rounded-lg shadow-card"
                className="max-h-[28rem] w-auto rounded-lg object-contain"
              />
            </button>
          ) : (
            <img
              src={NOVEL_PLACEHOLDER}
              alt=""
              className="max-h-[28rem] w-auto rounded-lg shadow-card"
            />
          )}
        </div>

        <div className="md:w-2/3 space-y-4">
          <div>
            <h1 className="font-display text-4xl text-dnd-gold">{novel.title}</h1>
            {novel.titleEs && novel.titleEs !== novel.title && (
              <p className="text-lg text-gray-300 mt-1">{novel.titleEs}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <NovelSpanishBadge spanish={novel.spanish} />
            <span className="badge bg-dnd-stone text-gray-300 border border-dnd-gold/20">
              {kindNames[novel.kind]}
            </span>
          </div>

          {novel.bestseller && <NovelBestseller bestseller={novel.bestseller} />}

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-300">
            <DataRow
              label={novel.authors.length > 1 ? 'Autores' : 'Autor'}
              value={novel.authors.join(', ')}
            />
            <DataRow label="Mundo" value={settingNames[novel.setting]} />
            {seriesMeta && (
              <DataRow label="Serie" value={`${seriesName(seriesMeta)}, ${novel.series!.number}`} />
            )}
            {novel.date && (
              <DataRow label="Primera edición" value={formatPartialDate(novel.date)} />
            )}
          </dl>

          <div className="max-w-3xl space-y-3 text-gray-300 leading-relaxed">
            {novel.description.split(/\n\s*\n/).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <a
            href={novel.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-dnd-gold hover:text-dnd-gold-light"
          >
            <GlobeAltIcon className="h-4 w-4" />
            Fuente
          </a>

          {!novel.availableToBuy && (
            <p className="text-sm text-gray-400">No está a la venta en las tiendas del sitio.</p>
          )}
        </div>
      </div>

      {novel.reviews?.length ? <MediaReviews reviews={novel.reviews} /> : null}

      <Section title="Ediciones en castellano">
        {spanishEditions.length > 0 ? (
          <ul className="space-y-5">
            {spanishEditions.map((e, i) => renderEdition(e, `es-${i}`))}
          </ul>
        ) : (
          <p className="text-gray-300">
            {spanishCollections.length > 0
              ? 'Solo se ha publicado en castellano dentro de un recopilatorio (ver más abajo).'
              : 'No se ha publicado en castellano.'}
          </p>
        )}
      </Section>

      <Section title="Ediciones en inglés">
        <ul className="space-y-5">{englishEditions.map((e, i) => renderEdition(e, `en-${i}`))}</ul>
      </Section>

      {collections.length > 0 && (
        <Section title="Recopilatorios">
          <ul className="space-y-5">
            {collections.map((c, i) => (
              <EditionRow
                key={i}
                edition={c}
                fallbackTitle={c.title}
                slug={novel.slug}
                onOpenCover={openCover}
                note={`Incluye ${c.novels.length} novelas`}
              />
            ))}
          </ul>
        </Section>
      )}

      {anthologies.length > 0 && (
        <Section title="Antologías">
          <p className="mb-5 text-sm text-gray-400">
            Libros de relatos de varios autores relacionados con esta novela o su serie.
          </p>
          <ul className="space-y-8">
            {anthologies.map((anthology) => (
              <li key={anthology.id} className="space-y-3">
                <div>
                  <h3 className="font-display text-xl text-gray-100">
                    {anthology.title_es ?? anthology.title}
                  </h3>
                  {anthology.title_es && anthology.title_es !== anthology.title && (
                    <p className="text-sm text-gray-400">{anthology.title}</p>
                  )}
                </div>
                <p className="max-w-3xl text-gray-300">
                  {anthology.description.split(/\n\s*\n/)[0]}
                </p>
                <ul className="space-y-5">
                  {anthology.shown.map((e, i) => (
                    <EditionRow
                      key={i}
                      edition={e}
                      fallbackTitle={anthology.title}
                      slug={novel.slug}
                      onOpenCover={openCover}
                    />
                  ))}
                </ul>
                {anthology.folded.length > 0 && (
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-gray-400 hover:text-dnd-gold">
                      {anthology.folded.length === 1
                        ? 'Otra edición'
                        : `Otras ${anthology.folded.length} ediciones`}
                    </summary>
                    <ul className="mt-4 space-y-5">
                      {anthology.folded.map((e, i) => (
                        <EditionRow
                          key={i}
                          edition={e}
                          fallbackTitle={anthology.title}
                          slug={novel.slug}
                          onOpenCover={openCover}
                        />
                      ))}
                    </ul>
                  </details>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {seriesMeta && seriesNovels.length > 1 && (
        <Section title={seriesName(seriesMeta)}>
          <ol className="space-y-1">
            {seriesNovels.map((n) => (
              <li key={n.slug} className="flex gap-2">
                <span className="w-6 text-right text-gray-400">{n.series!.number}.</span>
                {n.slug === novel.slug ? (
                  <span aria-current="page" className="font-semibold text-gray-100">
                    {n.titleEs ?? n.title}
                  </span>
                ) : (
                  <Link
                    to={`/novela/${n.slug}`}
                    className="text-dnd-gold hover:text-dnd-gold-light underline underline-offset-2"
                  >
                    {n.titleEs ?? n.title}
                  </Link>
                )}
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap justify-between gap-4 text-sm">
            {previous ? (
              <Link
                to={`/novela/${previous.slug}`}
                className="inline-flex items-center gap-1 text-dnd-gold hover:text-dnd-gold-light"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Anterior: {previous.titleEs ?? previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/novela/${next.slug}`}
                className="inline-flex items-center gap-1 text-dnd-gold hover:text-dnd-gold-light"
              >
                Siguiente: {next.titleEs ?? next.title}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
          <Link
            to={`/novelas?serie=${seriesMeta.id}`}
            className="mt-4 inline-block text-sm text-gray-400 hover:text-dnd-gold"
          >
            Ver la serie en el listado
          </Link>
        </Section>
      )}

      {hasRelated && (
        <Section title="Relacionado">
          <ul className="space-y-1">
            {relatedProducts.map((product) => (
              <RelatedLink
                key={product.code}
                to={`/producto/${product.primaryEdition === '5e' ? '2014' : '2024'}/${product.slug}`}
                label={product.primaryTitle}
              />
            ))}
            {relatedGames.map((game) => (
              <RelatedLink
                key={game.slug}
                to={`/videojuego/${game.slug}`}
                label={game.title}
                kind="videojuego"
              />
            ))}
            {relatedMerchandise.map((item) => (
              <RelatedLink
                key={item.slug}
                to={`/merchandising/${item.slug}`}
                label={item.title_es ?? item.title}
                kind="merchandising"
              />
            ))}
          </ul>
        </Section>
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

interface EditionRowProps {
  edition: NovelEdition | NovelCollection
  fallbackTitle: string
  slug: string
  onOpenCover: (cover: string) => void
  note?: string
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  return hours > 0 ? `${hours} h ${minutes % 60} min` : `${minutes} min`
}

function EditionRow({ edition, fallbackTitle, slug, onOpenCover, note }: EditionRowProps) {
  const audiobook = edition.format === 'audiobook'
  const narrators = 'narrators' in edition ? edition.narrators : undefined
  const duration = 'duration' in edition ? edition.duration : undefined
  const details = [
    edition.publisher,
    edition.date && formatPartialDate(edition.date),
    edition.format && formatNames[edition.format],
    narrators && `Narrado por ${narrators.join(', ')}`,
    duration && formatDuration(duration),
    placeOf(edition),
    edition.isbn13 && `ISBN ${formatIsbn(edition.isbn13)}`,
    note,
  ].filter(Boolean)
  const links = edition.purchase_links ?? []
  const webUrl = 'url' in edition ? edition.url : undefined

  return (
    <li className="flex gap-4">
      {edition.cover ? (
        <button
          onClick={() => onOpenCover(edition.cover!)}
          className="shrink-0 cursor-zoom-in"
          aria-label={`Ver portada de ${edition.title ?? fallbackTitle}`}
        >
          <LazyImage
            src={thumbnailOf(edition.cover)}
            alt=""
            containerClassName={`w-16 rounded ${audiobook ? 'aspect-square' : 'aspect-[2/3]'}`}
            className="w-full h-full object-cover rounded"
          />
        </button>
      ) : (
        <div className="w-16 shrink-0" aria-hidden="true" />
      )}
      <div className="min-w-0">
        <p className="text-gray-100">{edition.title ?? fallbackTitle}</p>
        <p className="text-sm text-gray-400">{details.join(' · ')}</p>
        {links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {links.map((link) => (
              <PurchaseButton
                key={link.url}
                store={link.store}
                url={link.url}
                tracking={{ novela: slug, idioma: edition.language, formato: edition.format }}
                variant={
                  link.store !== 'amazon'
                    ? undefined
                    : edition.format === 'ebook'
                      ? 'Kindle'
                      : audiobook
                        ? 'Audible'
                        : undefined
                }
              />
            ))}
          </div>
        )}
        {webUrl && (
          <a
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-sm text-dnd-gold"
          >
            <GlobeAltIcon className="h-4 w-4" />
            Leer la copia archivada
          </a>
        )}
      </div>
    </li>
  )
}

function RelatedLink({ to, label, kind }: { to: string; label: string; kind?: string }) {
  return (
    <li>
      <Link
        to={to}
        className="text-dnd-gold hover:text-dnd-gold-light underline underline-offset-2"
      >
        {label}
      </Link>
      {kind && <span className="text-sm text-gray-400"> ({kind})</span>}
    </li>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="inline font-semibold text-gray-100">{label}:</dt>{' '}
      <dd className="inline">{value}</dd>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card-dnd p-6">
      <h2 className="font-display text-2xl text-dnd-gold mb-4">{title}</h2>
      {children}
    </section>
  )
}
