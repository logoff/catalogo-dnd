import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import type { MerchandiseEdition, MerchandiseWithMeta } from '@/types/merchandise'
import { getProductByCodeAndEdition } from '@/services/dataLoader'
import { getVideogameBySlug } from '@/services/videogameLoader'
import { groupNames, kindNames } from '@/utils/merchandiseTranslations'
import { formatPartialDate } from '@/utils/videogameTranslations'
import ImageLightbox from '../common/ImageLightbox'
import LazyImage from '../common/LazyImage'
import PurchaseButton from '../common/PurchaseButton'
import MerchandiseSpanishBadge from './MerchandiseSpanishBadge'

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

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex flex-wrap gap-2 justify-center md:justify-start">
          {item.images.map((image, index) => (
            <button
              key={image}
              onClick={() => {
                setLightboxIndex(index)
                setLightboxOpen(true)
              }}
              className="block cursor-zoom-in"
            >
              <LazyImage
                src={image}
                alt={`${item.title} - Imagen ${index + 1}`}
                containerClassName="max-h-96 w-auto rounded-lg shadow-card bg-white"
                className="max-h-96 w-auto rounded-lg object-contain"
              />
            </button>
          ))}
        </div>

        <div className="md:w-2/3 space-y-4">
          <div>
            <h1 className="font-display text-4xl text-dnd-gold">{item.title}</h1>
            {item.title_es && <p className="text-lg text-gray-300 mt-1">{item.title_es}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <MerchandiseSpanishBadge item={item} />
            <span className="badge bg-dnd-stone text-gray-300 border border-dnd-gold/20">
              {kindNames[item.kind]}
            </span>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-300">
            <DataRow label="Grupo" value={groupNames[item.group]} />
            <DataRow label="Fabricante" value={item.manufacturer} />
            {item.date && <DataRow label="Salida" value={formatPartialDate(item.date)} />}
          </dl>

          <div className="max-w-3xl space-y-3 text-gray-300 leading-relaxed">
            {item.description.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <a
            href={item.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-dnd-gold hover:text-dnd-gold-light"
          >
            <GlobeAltIcon className="h-4 w-4" />
            Página oficial
          </a>
        </div>
      </div>

      <Section title="Dónde comprar">
        {item.availableToBuy ? (
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
                    <p className="text-gray-100">
                      {language && <span className="font-semibold">{language}</span>}
                      {language && edition.title && ': '}
                      {edition.title && <span>{edition.title}</span>}
                    </p>
                  )}
                  {details.length > 0 && (
                    <p className="text-sm text-gray-400">{details.join(' · ')}</p>
                  )}
                  {(edition.purchase_links ?? []).length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {edition.purchase_links!.map((link) => (
                        <PurchaseButton
                          key={link.url}
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
                    <p className="mt-1 text-sm text-gray-400">
                      Esta edición no está a la venta en las tiendas del sitio.
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-gray-300">No está a la venta en las tiendas del sitio.</p>
        )}
      </Section>

      {item.expansions && item.expansions.length > 0 && (
        <Section title="Expansiones">
          <ul className="space-y-1 text-gray-300">
            {item.expansions.map((expansion) => (
              <li key={expansion.title}>
                {expansion.title}
                {expansion.date && (
                  <span className="text-sm text-gray-400">
                    {' '}
                    ({formatPartialDate(expansion.date)})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(relatedProducts.length > 0 || relatedGames.length > 0) && (
        <Section title="Relacionado">
          <ul className="space-y-1">
            {relatedProducts.map((product) => (
              <li key={product.code}>
                <Link
                  to={`/producto/${product.primaryEdition === '5e' ? '2014' : '2024'}/${product.slug}`}
                  className="text-dnd-gold hover:text-dnd-gold-light underline underline-offset-2"
                >
                  {product.primaryTitle}
                </Link>
              </li>
            ))}
            {relatedGames.map((game) => (
              <li key={game.slug}>
                <Link
                  to={`/videojuego/${game.slug}`}
                  className="text-dnd-gold hover:text-dnd-gold-light underline underline-offset-2"
                >
                  {game.title}
                </Link>{' '}
                <span className="text-sm text-gray-400">(videojuego)</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <ImageLightbox
        images={item.images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
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
