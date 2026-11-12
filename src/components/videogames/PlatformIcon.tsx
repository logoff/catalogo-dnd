import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import type { Platform } from '@/types/videogame'
import { platformIcons } from '@/utils/platformIcons'
import { platformNames } from '@/utils/videogameTranslations'
import { BRAND_PATHS } from './brandIcons'

interface PlatformIconProps {
  platform: Platform
  className?: string
  // Texto accesible; por defecto, el nombre de la plataforma
  label?: string
}

// Mando genérico para las consolas sin logotipo disponible (Nintendo, Xbox, 3DO…)
function GamepadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 7.5h10a4.5 4.5 0 0 1 4.4 5.5l-.9 4a2 2 0 0 1-3.4.9L15 15.5H9l-2.1 2.4a2 2 0 0 1-3.4-.9l-.9-4A4.5 4.5 0 0 1 7 7.5Z" />
      <path d="M8 10.5v3M6.5 12h3" />
      <circle cx="15.5" cy="11" r=".75" fill="currentColor" />
      <circle cx="17" cy="13" r=".75" fill="currentColor" />
    </svg>
  )
}

// Icono de una plataforma; el nombre va como texto accesible
export default function PlatformIcon({
  platform,
  className = 'h-4 w-4',
  label,
}: PlatformIconProps) {
  const icon = platformIcons[platform]
  const name = label ?? platformNames[platform]

  return (
    <span role="img" aria-label={name} title={name} className="inline-flex shrink-0">
      {icon.kind === 'brand' ? (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d={BRAND_PATHS[icon.name]} />
        </svg>
      ) : icon.kind === 'computer' ? (
        <ComputerDesktopIcon aria-hidden="true" className={className} />
      ) : icon.kind === 'mobile' ? (
        <DevicePhoneMobileIcon aria-hidden="true" className={className} />
      ) : icon.kind === 'browser' ? (
        <GlobeAltIcon aria-hidden="true" className={className} />
      ) : (
        <GamepadIcon className={className} />
      )}
    </span>
  )
}
