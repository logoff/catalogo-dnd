import { useState } from 'react'
import type { ScreenshotWithMeta } from '@/types/videogame'
import { resolveImageSrc } from '@/utils/imageResolver'
import ImageLightbox from '../common/ImageLightbox'

interface ScreenshotGalleryProps {
  title: string
  screenshots: ScreenshotWithMeta[]
}

// Cuadrícula de miniaturas locales; cada una abre la captura ampliada en el visor
export default function ScreenshotGallery({ title, screenshots }: ScreenshotGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const alts = screenshots.map((_, i) => `${title}: captura ${i + 1} de ${screenshots.length}`)

  return (
    <>
      <ul className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {screenshots.map((screenshot, index) => (
          <li key={screenshot.image}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="block w-full cursor-zoom-in overflow-hidden rounded-lg bg-black shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-dnd-gold"
            >
              <img
                src={resolveImageSrc(screenshot.thumbnail)}
                alt={alts[index]}
                loading="lazy"
                className="aspect-video w-full object-contain transition-opacity hover:opacity-80"
              />
            </button>
          </li>
        ))}
      </ul>

      <ImageLightbox
        images={screenshots.map((screenshot) => screenshot.image)}
        alts={alts}
        initialIndex={openIndex ?? 0}
        isOpen={openIndex !== null}
        onClose={() => setOpenIndex(null)}
      />
    </>
  )
}
