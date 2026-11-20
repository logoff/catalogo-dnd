import { useState } from 'react'
import {
  GlobeAltIcon,
  BookOpenIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import type { ProductWithMeta, Publication, SubPublication } from '@/types'
import { LanguageBadge, TypeBadge, EditionBadge } from '../common/Badge'
import ImageLightbox from '../common/ImageLightbox'
import { translateSubtype } from '@/utils/translations'
import { formatDate, formatISBN } from '@/utils/formatters'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import LazyImage from '../common/LazyImage'
import PurchaseButton from '../common/PurchaseButton'
import PurchaseLinks from '../common/PurchaseLinks'
import { buttonClass, headingClass } from '@/components/ui/styles'

interface ProductDetailProps {
  product: ProductWithMeta
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="space-y-4">
      {product.publications.map((publication, index) => (
        <PublicationSection key={index} product={product} publication={publication} />
      ))}
    </div>
  )
}

interface PublicationSectionProps {
  product: ProductWithMeta
  publication: Publication
}

function PublicationSection({ product, publication }: PublicationSectionProps) {
  const images = publication.images?.length ? publication.images : [PLACEHOLDER_IMAGE]
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  // Collect all available links
  const links = [
    publication.official_url && {
      url: publication.official_url,
      label: 'Web Oficial',
      icon: GlobeAltIcon,
    },
    publication.wpn_url && {
      url: publication.wpn_url,
      label: 'Wizards Play Network',
      icon: SparklesIcon,
    },
    publication.openlibrary_url && {
      url: publication.openlibrary_url,
      label: 'Open Library',
      icon: BookOpenIcon,
    },
  ].filter(Boolean) as Array<{
    url: string
    label: string
    icon: typeof GlobeAltIcon
  }>

  const purchaseLinks = publication.purchase_links ?? []

  return (
    <article className="rounded-xl border border-line bg-surface p-4 sm:p-6">
      <header className="mb-5 flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className={headingClass('title')}>{publication.title}</h3>
        <div className="flex flex-wrap gap-1.5">
          <EditionBadge edition={publication.edition} />
          <TypeBadge type={publication.type} />
          {publication.language && <LanguageBadge language={publication.language} />}
        </div>
      </header>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex shrink-0 flex-wrap gap-2 md:w-48 md:flex-col">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`Ampliar imagen ${index + 1} de ${publication.title}`}
              className="block cursor-zoom-in overflow-hidden rounded-lg bg-well"
            >
              <LazyImage
                src={image}
                alt={`${publication.title} - Imagen ${index + 1}`}
                containerClassName="rounded-lg"
                className="max-h-64 w-auto md:w-full"
              />
            </button>
          ))}
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-[10rem_1fr]">
            <DataRow label="Tipo" value={translateSubtype(publication.type, publication.subtype)} />
            {publication.publisher && <DataRow label="Editorial" value={publication.publisher} />}
            {publication.date && (
              <DataRow label="Fecha de publicación" value={formatDate(publication.date)} />
            )}
            {publication.pages && (
              <DataRow label="Número de páginas" value={publication.pages.toString()} mono />
            )}
            {publication.authors && publication.authors.length > 0 && (
              <DataRow label="Autores" value={publication.authors.join(', ')} />
            )}
            {publication.isbn13 && (
              <DataRow label="ISBN-13" value={formatISBN(publication.isbn13)} mono />
            )}
            {publication.item_code && (
              <DataRow label="Código de artículo" value={publication.item_code} mono />
            )}
          </dl>

          {purchaseLinks.length > 0 && (
            <div>
              <p className="mb-1 text-sm font-semibold">Dónde comprar</p>
              <PurchaseLinks>
                <div className="flex flex-wrap gap-2">
                  {purchaseLinks.map((link, index) => (
                    <PurchaseButton
                      key={link.url}
                      store={link.store}
                      url={link.url}
                      primary={index === 0}
                      tracking={{
                        producto: `${product.primaryEdition === '5e' ? '2014' : '2024'}/${product.code}`,
                        publicacion: publication.title,
                        idioma: publication.language,
                      }}
                    />
                  ))}
                </div>
              </PurchaseLinks>
            </div>
          )}

          {links.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-semibold">Enlaces externos</p>
              <div className="flex flex-wrap gap-2">
                {links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass('ghost', 'sm', 'border border-line')}
                  >
                    <link.icon className="size-4" aria-hidden="true" />
                    <span>{link.label}</span>
                    <ArrowTopRightOnSquareIcon className="size-3 opacity-70" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {publication.type === 'boxed_set' &&
            publication.sub_publications &&
            publication.sub_publications.length > 0 && (
              <SubPublicationsList subPublications={publication.sub_publications} />
            )}
        </div>
      </div>

      <ImageLightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </article>
  )
}

interface DataRowProps {
  label: string
  value: string
  mono?: boolean
}

function DataRow({ label, value, mono = false }: DataRowProps) {
  return (
    <>
      <dt className="text-muted">{label}</dt>
      <dd className={mono ? 'font-mono text-[13px] tabular-nums' : undefined}>{value}</dd>
    </>
  )
}

interface SubPublicationsListProps {
  subPublications: SubPublication[]
}

function SubPublicationsList({ subPublications }: SubPublicationsListProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openSubLightbox = (images: string[], index: number) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className="border-t border-line pt-4">
      <h4 className={headingClass('group', 'mb-2')}>Contenido</h4>
      <ul className="list-inside list-disc space-y-1 text-sm">
        {subPublications.map((sub, index) => (
          <li key={index}>
            {sub.title}
            {sub.pages && <span className="text-muted"> ({sub.pages} págs.)</span>}
            {sub.images && sub.images.length > 0 && (
              <span className="ml-2">
                {sub.images.map((_, imgIndex) => (
                  <button
                    key={imgIndex}
                    type="button"
                    onClick={() => openSubLightbox(sub.images!, imgIndex)}
                    aria-label={`Imagen ${imgIndex + 1} de ${sub.title}`}
                    className="mx-1 cursor-pointer text-muted underline underline-offset-2 hover:text-fg"
                  >
                    [{imgIndex + 1}]
                  </button>
                ))}
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Lightbox for sub-publications */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
