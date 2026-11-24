import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import type { MerchandiseEdition, MerchandiseWithMeta } from '@/types/merchandise'
import { getProductByCodeAndEdition } from '@/services/dataLoader'
import { getVideogameBySlug } from '@/services/videogameLoader'
import { groupNames, kindNames } from '@/utils/merchandiseTranslations'
import { formatPartialDate } from '@/utils/videogameTranslations'
import { DataList, DataRow, DetailSection } from '@/components/ui/DetailSection'
import SectionNav from '@/components/ui/SectionNav'
import ImageLightbox from '../common/ImageLightbox'
import LazyImage from '../common/LazyImage'
import PurchaseButton from '../common/PurchaseButton'
import PurchaseLinks from '../common/PurchaseLinks'
import MerchandiseSpanishBadge from './MerchandiseSpanishBadge'
import RelatedComics from '@/components/comics/RelatedComics'

interface MerchandiseDetailProps {
  item: MerchandiseWithMeta
}

// Idioma de una edición y, si es en castellano, si salió en España
function editionLanguage(edition: MerchandiseEdition): string | null {
  if (edition.language === 'english') return 'Inglés'
  if (edition.language === 'castellano') {
    return edition.spain ? 'Castellano, publicado en España' : 'Español, no publicado en España'
  }
  return null
}

export default function MerchandiseDetail({ item }: MerchandiseDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const relatedProducts = (item.related_products ?? [])
    .map((rel) => getProductByCodeAndEdition(rel.code, rel.edition))
    .filter((product) => product !== undefined)
  const relatedGames = (item.related_videogames ?? [])
    .map((slug) => getVideogameBySlug(slug))
    .filter((game) => game !== undefined)

  const sections = [
    { id: 'donde-comprar', label: 'Comprar' },
    ...(item.expansions?.length ? [{ id: 'expansiones', label: 'Expansiones' }] : []),
    ...(relatedProducts.length > 0 || relatedGames.length > 0
      ? [{ id: 'relacionado', label: 'Relacionado' }]
      : []),
  ]

  return (
    <div className="space-y-10">
      {/* Cabecera */}
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <div className="flex w-full max-w-xs shrink-0 flex-wrap content-start gap-2 self-start rounded-xl bg-well p-4 md:w-72">
          {item.images.map((image, index) => (
            <button
              key={image}
              onClick={() => {
                setLightboxIndex(index)
                setLightboxOpen(true)
              }}
              aria-label={`Ampliar imagen ${index + 1}`}
              className="block cursor-zoom-in"
            >
              <LazyImage
                src={image}
                alt={`${item.title} - Imagen ${index + 1}`}
                containerClassName="max-h-96 w-auto rounded-lg  bg-white"
                className="max-h-96 w-auto rounded-lg object-contain"
              />
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{item.title}</h1>
            {item.title_es && <p className="mt-1 text-lg text-muted">{item.title_es}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <MerchandiseSpanishBadge item={item} />
            <span className="inline-flex items-center rounded-md border border-line px-1.5 py-0.5 text-xs font-medium text-muted">
              {kindNames[item.kind]}
            </span>
          </div>

          <DataList>
            <DataRow label="Grupo" value={groupNames[item.group]} />
            <DataRow label="Fabricante" value={item.manufacturer} />
            {item.date && <DataRow label="Salida" value={formatPartialDate(item.date)} />}
          </DataList>

          <div className="max-w-3xl space-y-3 leading-relaxed">
            {item.description.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <a
            href={item.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-fg sm:min-h-0"
          >
            <GlobeAltIcon className="size-4" aria-hidden="true" />
            Página oficial
          </a>
        </div>
      </div>

      <SectionNav sections={sections} />

      <DetailSection title="Dónde comprar">
        {item.availableToBuy ? (
          <PurchaseLinks>
            <ul className="space-y-4">
              {item.editions.map((edition, index) => {
                const language = editionLanguage(edition)
                const details = [
                  edition.publisher,
                  edition.date && formatPartialDate(edition.date),
                ].filter(Boolean)
                return (
                  <li key={index}>
                    {(language || edition.title) && (
                      <p className="text-fg">
                        {language && <span className="font-semibold">{language}</span>}
                        {language && edition.title && ': '}
                        {edition.title && <span>{edition.title}</span>}
                      </p>
                    )}
                    {details.length > 0 && (
                      <p className="text-sm text-muted">{details.join(' · ')}</p>
                    )}
                    {(edition.purchase_links ?? []).length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {edition.purchase_links!.map((link, linkIndex) => (
                          <PurchaseButton
                            key={link.url}
                            primary={index === 0 && linkIndex === 0}
                            store={link.store}
                            url={link.url}
                            tracking={{
                              merchandising: item.slug,
                              idioma: edition.language,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-muted">
                        Esta edición no está a la venta en las tiendas del sitio.
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          </PurchaseLinks>
        ) : (
          <p className="text-fg">No está a la venta en las tiendas del sitio.</p>
        )}
      </DetailSection>

      {item.expansions && item.expansions.length > 0 && (
        <DetailSection title="Expansiones">
          <ul className="space-y-1 text-fg">
            {item.expansions.map((expansion) => (
              <li key={expansion.title}>
                {expansion.title}
                {expansion.date && (
                  <span className="text-sm text-muted"> ({formatPartialDate(expansion.date)})</span>
                )}
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {(relatedProducts.length > 0 || relatedGames.length > 0) && (
        <DetailSection title="Relacionado">
          <ul className="space-y-1">
            {relatedProducts.map((product) => (
              <li key={product.code}>
                <Link
                  to={`/producto/${product.primaryEdition === '5e' ? '2014' : '2024'}/${product.slug}`}
                  className="underline decoration-muted underline-offset-2 transition-colors duration-150 hover:decoration-fg"
                >
                  {product.primaryTitle}
                </Link>
              </li>
            ))}
            {relatedGames.map((game) => (
              <li key={game.slug}>
                <Link
                  to={`/videojuego/${game.slug}`}
                  className="underline decoration-muted underline-offset-2 transition-colors duration-150 hover:decoration-fg"
                >
                  {game.title}
                </Link>{' '}
                <span className="text-sm text-muted">(videojuego)</span>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      <RelatedComics group="merchandise" id={item.slug} />

      <ImageLightbox
        images={item.images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
