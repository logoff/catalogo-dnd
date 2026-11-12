import { Link } from 'react-router-dom'
import type { Store } from '@/types'
import type { GameRelease, Platform, VideogamePurchaseLink } from '@/types/videogame'
import { STORES } from '@/utils/stores'
import { describeSpanish, platformNames } from '@/utils/videogameTranslations'
import PurchaseButton from '../common/PurchaseButton'

interface PurchaseByPlatformProps {
  slug: string
  releases: GameRelease[]
}

interface PlatformGroup {
  platform: Platform
  links: (VideogamePurchaseLink & { edition?: string })[]
  spanish: string
}

// Orden fijo de los botones: el de declaración de las tiendas, igual en todas las fichas
const STORE_ORDER = Object.keys(STORES) as Store[]

function groupByPlatform(releases: GameRelease[]): PlatformGroup[] {
  const groups = new Map<Platform, PlatformGroup>()
  for (const release of releases) {
    if (release.delisted || !release.purchase_links?.length) continue
    const group = groups.get(release.platform) ?? {
      platform: release.platform,
      links: [],
      spanish: describeSpanish(release.spanish),
    }
    group.links.push(
      ...release.purchase_links.map((link) => ({ ...link, edition: release.edition }))
    )
    groups.set(release.platform, group)
  }
  for (const group of groups.values()) {
    group.links.sort((a, b) => STORE_ORDER.indexOf(a.store) - STORE_ORDER.indexOf(b.store))
  }
  return [...groups.values()]
}

export default function PurchaseByPlatform({ slug, releases }: PurchaseByPlatformProps) {
  const groups = groupByPlatform(releases)

  if (groups.length === 0) {
    return <p className="text-gray-400">No disponible a la venta.</p>
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Algunos enlaces son de afiliado: el catálogo puede recibir una comisión sin coste para ti.{' '}
        <Link to="/aviso-legal" className="underline hover:text-dnd-gold">
          Más información
        </Link>
      </p>
      {groups.map((group) => (
        <section key={group.platform} aria-label={platformNames[group.platform]}>
          <h3 className="font-semibold text-gray-100">
            {platformNames[group.platform]}{' '}
            <span className="text-sm font-normal text-gray-400">· {group.spanish}</span>
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.links.map((link) => (
              <span key={link.url} className="inline-flex items-center gap-2">
                <PurchaseButton
                  store={link.store}
                  url={link.url}
                  tracking={{ videojuego: slug, plataforma: group.platform }}
                />
                {(link.edition || link.format === 'physical') && (
                  <span className="text-xs text-gray-400">
                    {[link.edition, link.format === 'physical' && 'edición física']
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                )}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
