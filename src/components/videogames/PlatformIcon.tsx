import type { ReactNode } from 'react'
import type { Platform } from '@/types/videogame'
import { platformKinds, type PlatformKind } from '@/utils/platformIcons'
import { platformNames } from '@/utils/videogameTranslations'
import { platformLogo } from '@/utils/platformLogos'
import { getAssetPath } from '@/utils/constants'

interface PlatformIconProps {
  platform: Platform
  // sm para tablas, filtros y tarjetas; md para las cabeceras de «Dónde comprar»
  size?: 'sm' | 'md'
  // Color del pictograma cuando no hay logotipo
  className?: string
  // Texto accesible; por defecto, el nombre de la plataforma
  label?: string
  // Solo decorativo, cuando el nombre ya aparece al lado como texto
  decorative?: boolean
}

// Pictogramas propios de cada tipo de aparato, con el mismo trazo que los iconos de Heroicons
const shapes: Record<PlatformKind, ReactNode> = {
  computer: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  retro_computer: (
    <>
      <rect x="5" y="3" width="14" height="10" rx="1" />
      <rect x="8" y="5.5" width="8" height="5" rx=".5" />
      <path d="M3 16h18l-1.5 4.5h-15Z" />
      <path d="M6.5 18.25h11" />
    </>
  ),
  console: (
    <>
      <rect x="3" y="5" width="18" height="7" rx="1.5" />
      <path d="M6.5 8.5h4" />
      <circle cx="17" cy="8.5" r=".75" fill="currentColor" />
      <path d="M12 12v2.5" />
      <path d="M8.5 14.5h7a2.25 2.25 0 0 1 0 4.5h-7a2.25 2.25 0 0 1 0-4.5Z" />
      <path d="M9 16.75h2M10 15.75v2" />
    </>
  ),
  handheld: (
    <>
      <rect x="2.5" y="6.5" width="19" height="11" rx="3" />
      <rect x="8" y="8.5" width="8" height="7" rx=".5" />
      <path d="M4 12h2.5M5.25 10.75v2.5" />
      <circle cx="18.5" cy="11" r=".75" fill="currentColor" />
      <circle cx="19" cy="13.5" r=".75" fill="currentColor" />
    </>
  ),
  arcade: (
    <>
      <path d="M7 2.5h10v6l1.5 3v10h-13v-10L7 8.5Z" />
      <rect x="8.5" y="4" width="7" height="3.5" rx=".5" />
      <path d="M5.5 14h13M10 14v-2" />
      <circle cx="10" cy="11.5" r=".75" fill="currentColor" />
      <circle cx="13.5" cy="12.5" r=".6" fill="currentColor" />
      <circle cx="15.5" cy="12.5" r=".6" fill="currentColor" />
    </>
  ),
  mobile: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  browser: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z" />
    </>
  ),
}

// Todas las pastillas miden lo mismo: el logotipo se encaja y se centra dentro, sea cuadrado o
// alargado, para que las filas queden alineadas
const SIZES = {
  sm: { pictogram: 'h-4 w-4', chip: 'h-5 w-14 px-1', logo: 'h-3.5', slot: 'h-5 w-14' },
  md: { pictogram: 'h-5 w-5', chip: 'h-6 w-16 px-1.5', logo: 'h-4', slot: 'h-6 w-16' },
}

// Logotipo de la plataforma sobre una pastilla clara (muchos son negros y no se verían sobre el
// fondo oscuro) o, si no hay logotipo, el pictograma de su tipo de aparato
export default function PlatformIcon({
  platform,
  size = 'sm',
  className = 'text-gray-400',
  label,
  decorative = false,
}: PlatformIconProps) {
  const name = label ?? platformNames[platform]
  const a11y = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': name, title: name }
  const logo = platformLogo(platform)
  const sizes = SIZES[size]

  if (logo) {
    return (
      <span
        {...a11y}
        className={`inline-flex shrink-0 items-center justify-center rounded bg-white ${sizes.chip}`}
      >
        <img src={getAssetPath(logo)} alt="" className={`w-full object-contain ${sizes.logo}`} />
      </span>
    )
  }

  // Mismo hueco que las pastillas, para que el nombre quede alineado en tablas y filtros
  return (
    <span {...a11y} className={`inline-flex shrink-0 items-center justify-center ${sizes.slot}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`${sizes.pictogram} ${className}`}
      >
        {shapes[platformKinds[platform]]}
      </svg>
    </span>
  )
}
