import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Platform, VideogameWithMeta } from '@/types/videogame'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { platformNames } from '@/utils/videogameTranslations'
import { platformKinds } from '@/utils/platformIcons'
import { logoKey, platformLogo } from '@/utils/platformLogos'
import PlatformIcon from './PlatformIcon'
import LazyImage from '../common/LazyImage'
import SpanishBadge from './SpanishBadge'

interface VideogameCardProps {
  game: VideogameWithMeta
  view?: 'grid' | 'list'
}

// Iconos de las plataformas: las que comparten icono se agrupan en uno con todos los nombres
// Caben tres pastillas por fila: si hay más plataformas, dos y «+N» con los nombres en el tooltip
const MAX_ICONS = 3

function PlatformIcons({ game }: { game: VideogameWithMeta }) {
  const groups = new Map<string, Platform[]>()
  for (const platform of game.platforms) {
    // Mismo logotipo (p. ej. NEC para PC-88 y PC-98) o, sin logotipo, mismo tipo de aparato
    const key = platformLogo(platform) ? logoKey(platform) : platformKinds[platform]
    groups.set(key, [...(groups.get(key) ?? []), platform])
  }
  const all = [...groups.values()]
  const shown = all.length > MAX_ICONS ? all.slice(0, MAX_ICONS - 1) : all
  const rest = all.slice(shown.length).flat()

  return (
    <span className="flex flex-wrap items-center gap-1.5 text-gray-400">
      {shown.map((platforms) => (
        <PlatformIcon
          key={platforms[0]}
          platform={platforms[0]}
          label={platforms.map((p) => platformNames[p]).join(', ')}
        />
      ))}
      {rest.length > 0 && (
        <span className="text-xs" title={rest.map((p) => platformNames[p]).join(', ')}>
          +{rest.length}
        </span>
      )}
    </span>
  )
}

export default function VideogameCard({ game, view = 'grid' }: VideogameCardProps) {
  const image = game.images?.[0] ?? PLACEHOLDER_IMAGE
  const year = game.firstReleaseDate?.slice(0, 4) ?? 'Anunciado'

  if (view === 'list') {
    return (
      <Link to={`/videojuego/${game.slug}`} className="card-dnd group flex gap-4 p-3">
        <LazyImage
          src={image}
          alt={game.title}
          containerClassName="w-16 aspect-3/4 shrink-0 bg-dnd-stone-light rounded"
          className="w-full h-full object-cover rounded"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg text-dnd-gold group-hover:text-dnd-gold-light truncate">
            {game.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {year} <PlatformIcons game={game} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <SpanishBadge summary={game.spanishSummary} />
            {game.bestScore !== null && (
              <span className="text-sm text-gray-300">Nota: {game.bestScore}</span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className="h-full">
      <Link to={`/videojuego/${game.slug}`} className="card-dnd group flex flex-col h-full">
        <LazyImage
          src={image}
          alt={game.title}
          containerClassName="aspect-3/4 bg-dnd-stone-light"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <SpanishBadge summary={game.spanishSummary} />
          </div>
          <h3 className="font-display text-lg text-dnd-gold group-hover:text-dnd-gold-light transition-colors line-clamp-3">
            {game.title}
          </h3>
          <div className="mt-auto pt-2 text-sm">
            <p className="text-gray-400">{year}</p>
            <div className="mt-1">
              <PlatformIcons game={game} />
            </div>
            {game.bestScore !== null && (
              <p className="text-xs text-gray-300 mt-1">
                Nota: <span className="text-dnd-gold">{game.bestScore}</span>/100
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
