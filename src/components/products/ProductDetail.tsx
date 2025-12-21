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
import { PLACEHOLDER_IMAGE, getAssetPath } from '@/utils/constants'
import LazyImage from '../common/LazyImage'

interface ProductDetailProps {
  product: ProductWithMeta
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="space-y-8">
      {product.publications.map((publication, index) => (
        <PublicationSection key={index} publication={publication} />
      ))}
    </div>
  )
}

interface PublicationSectionProps {
  publication: Publication
}

function PublicationSection({ publication }: PublicationSectionProps) {
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
      color: 'from-dnd-red to-red-700',
      hoverColor: 'hover:from-dnd-red-light hover:to-red-600',
    },
    publication.wpn_url && {
      url: publication.wpn_url,
      label: 'Wizards Play Network',
      icon: SparklesIcon,
      color: 'from-purple-600 to-purple-800',
      hoverColor: 'hover:from-purple-500 hover:to-purple-700',
    },
    publication.openlibrary_url && {
      url: publication.openlibrary_url,
      label: 'Open Library',
      icon: BookOpenIcon,
      color: 'from-emerald-600 to-emerald-800',
      hoverColor: 'hover:from-emerald-500 hover:to-emerald-700',
    },
  ].filter(Boolean) as Array<{
    url: string
    label: string
    icon: typeof GlobeAltIcon
    color: string
    hoverColor: string
  }>

  return (
    <div className="card-dnd p-6 animate-slide-up">
      {/* Title */}
      <h2 className="font-display text-2xl text-dnd-gold mb-4 text-center border-b border-dnd-gold/20 pb-4">
        {publication.title}
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Images */}
        <div className="lg:w-1/3">
          <div className="flex flex-wrap gap-2 justify-center">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="block cursor-zoom-in"
              >
                <LazyImage
                  src={image}
                  alt={`${publication.title} - Imagen ${index + 1}`}
                  containerClassName="max-h-80 w-auto rounded-lg shadow-card hover:shadow-card-hover transition-shadow"
                  className="max-h-80 w-auto rounded-lg hover:scale-[1.02] transition-transform"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Data */}
        <div className="lg:w-2/3 space-y-3">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <EditionBadge edition={publication.edition} />
            <TypeBadge type={publication.type} />
            {publication.language && <LanguageBadge language={publication.language} />}
          </div>

          <DataRow label="Tipo" value={translateSubtype(publication.type, publication.subtype)} />

          {publication.publisher && <DataRow label="Editorial" value={publication.publisher} />}

          {publication.date && (
            <DataRow label="Fecha de publicación" value={formatDate(publication.date)} />
          )}

          {publication.pages && (
            <DataRow label="Número de páginas" value={publication.pages.toString()} />
          )}

          {publication.authors && publication.authors.length > 0 && (
            <DataRow label="Autores" value={publication.authors.join(', ')} />
          )}

          {publication.isbn13 && <DataRow label="ISBN-13" value={formatISBN(publication.isbn13)} />}

          {publication.item_code && (
            <DataRow label="Código de artículo" value={publication.item_code} />
          )}

          {/* Links - styled cards */}
          {(links.length > 0 || publication.amazon_link) && (
            <div className="pt-4">
              <p className="font-semibold text-gray-100 mb-3">Enlaces externos</p>
              <div className="flex flex-wrap gap-2">
                {links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group inline-flex items-center gap-2 px-4 py-2 rounded-lg
                      bg-gradient-to-r ${link.color} ${link.hoverColor}
                      text-white text-sm font-medium
                      shadow-md hover:shadow-lg
                      transform hover:scale-105 hover:-translate-y-0.5
                      transition-all duration-200
                    `}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                    <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
                {publication.amazon_link && (
                  <a
                    href={publication.amazon_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg
                      bg-gradient-to-r from-[#131A22] to-[#232f3e]
                      hover:from-[#232f3e] hover:to-[#131A22]
                      text-white text-sm font-medium
                      shadow-md hover:shadow-lg
                      transform hover:scale-105 hover:-translate-y-0.5
                      transition-all duration-200"
                  >
                    <img
                      src={getAssetPath('images/disponible_en_amazon.png')}
                      alt="Comprar en Amazon"
                      className="h-4"
                    />
                    <span>Comprar en Amazon</span>
                    <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Sub-publications (for boxed sets) */}
          {publication.type === 'boxed_set' &&
            publication.sub_publications &&
            publication.sub_publications.length > 0 && (
              <SubPublicationsList subPublications={publication.sub_publications} />
            )}
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}

interface DataRowProps {
  label: string
  value: string
}

function DataRow({ label, value }: DataRowProps) {
  return (
    <p className="text-gray-300">
      <span className="font-semibold text-gray-100">{label}:</span> {value}
    </p>
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
    <div className="pt-4 border-t border-dnd-gold/20 mt-4">
      <h4 className="font-semibold text-gray-100 mb-2">Contenido:</h4>
      <ul className="list-disc list-inside space-y-1 text-gray-300">
        {subPublications.map((sub, index) => (
          <li key={index}>
            {sub.title}
            {sub.pages && <span className="text-gray-500"> ({sub.pages} págs.)</span>}
            {sub.images && sub.images.length > 0 && (
              <span className="ml-2">
                {sub.images.map((_, imgIndex) => (
                  <button
                    key={imgIndex}
                    onClick={() => openSubLightbox(sub.images!, imgIndex)}
                    className="text-dnd-gold hover:text-dnd-gold-light mx-1 cursor-pointer"
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
