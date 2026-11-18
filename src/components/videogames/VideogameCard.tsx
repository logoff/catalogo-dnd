import { Link } from 'react-router-dom'
import type { Platform, VideogameWithMeta } from '@/types/videogame'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { platformNames } from '@/utils/videogameTranslations'
import { platformKinds } from '@/utils/platformIcons'
import { logoKey, platformLogo } from '@/utils/platformLogos'
import PlatformIcon from './PlatformIcon'
import LazyImage from '../common/LazyImage'
import SpanishBadge from './SpanishBadge'
import { cardClass } from '@/components/ui/styles'
import { CardBody, CardCover } from '@/components/ui/Card'

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
    <span className="flex flex-wrap items-center gap-1.5 text-muted">
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
      <Link
        to={`/videojuego/${game.slug}`}
        className="flex items-center gap-4 px-4 py-3 transition-colors duration-150 hover:bg-well"
      >
        <LazyImage
          src={image}
          alt=""
          containerClassName="aspect-3/4 w-12 shrink-0 rounded"
          className="h-full w-full object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h3 className="truncate text-[15px] font-semibold tracking-tight">{game.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="font-mono text-xs tabular-nums">{year}</span>
              <PlatformIcons game={game} />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-4 sm:w-64 sm:justify-end">
            <SpanishBadge summary={game.spanishSummary} />
            {game.bestScore !== null && (
              <span className="font-mono text-sm tabular-nums">{game.bestScore}</span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/videojuego/${game.slug}`} className={cardClass(true, 'h-full')}>
      <CardCover>
        <LazyImage
          src={image}
          alt={game.title}
          containerClassName="h-full"
          className="h-full w-full object-cover"
        />
      </CardCover>
      <CardBody>
        <div className="flex items-center justify-between gap-2 text-muted">
          <span className="font-mono text-xs tabular-nums">{year}</span>
          {game.bestScore !== null && (
            <span className="font-mono text-xs tabular-nums" title="Mejor nota de la prensa">
              <span className="text-fg">{game.bestScore}</span>/100
            </span>
          )}
        </div>
        <h3 className="line-clamp-3 text-[15px] leading-snug font-semibold tracking-tight">
          {game.title}
        </h3>
        <PlatformIcons game={game} />
        <SpanishBadge summary={game.spanishSummary} />
      </CardBody>
    </Link>
  )
}
