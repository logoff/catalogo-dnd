import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { VideogameWithMeta } from '@/types/videogame'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { platformNames } from '@/utils/videogameTranslations'
import LazyImage from '../common/LazyImage'
import SpanishBadge from './SpanishBadge'

interface VideogameCardProps {
  game: VideogameWithMeta
  view?: 'grid' | 'list'
}

// Las tres primeras plataformas y cuántas más hay, para que la tarjeta no crezca
function platformSummary(game: VideogameWithMeta): string {
  const names = game.platforms.map((p) => platformNames[p])
  return names.length > 3
    ? `${names.slice(0, 3).join(', ')} y ${names.length - 3} más`
    : names.join(', ')
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
          <p className="text-sm text-gray-400">
            {year} · {platformSummary(game)}
          </p>
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
            <p className="text-xs text-gray-500 mt-1">{platformSummary(game)}</p>
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
