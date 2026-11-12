import { Link } from 'react-router-dom'
import type { Store } from '@/types'
import type { GameRelease, Platform, VideogamePurchaseLink } from '@/types/videogame'
import { getBundle, getBundleRelease, getVideogameBySlug } from '@/services/videogameLoader'
import { STORES } from '@/utils/stores'
import { describeSpanish, platformNames } from '@/utils/videogameTranslations'
import PurchaseButton from '../common/PurchaseButton'
import PlatformIcon from './PlatformIcon'

interface PurchaseByPlatformProps {
  slug: string
  releases: GameRelease[]
}

// Una forma de comprar el juego en una plataforma: una versión suelta o una recopilación
interface Offer {
  release: GameRelease
  links: VideogamePurchaseLink[]
  physical: boolean
  bundleId?: string
}

// Orden fijo de los botones: el de declaración de las tiendas, igual en todas las fichas
const STORE_ORDER = Object.keys(STORES) as Store[]
const byStore = (a: VideogamePurchaseLink, b: VideogamePurchaseLink) =>
  STORE_ORDER.indexOf(a.store) - STORE_ORDER.indexOf(b.store)

function offersByPlatform(releases: GameRelease[]): Map<Platform, Offer[]> {
  const groups = new Map<Platform, Offer[]>()
  const add = (offer: Offer) => {
    const list = groups.get(offer.release.platform) ?? []
    list.push(offer)
    groups.set(offer.release.platform, list)
  }

  for (const release of releases) {
    if (release.delisted) continue
    if (release.bundle) {
      const bundleRelease = getBundleRelease(release)
      if (bundleRelease && !bundleRelease.delisted && bundleRelease.purchase_links?.length) {
        add({
          release,
          links: [...bundleRelease.purchase_links].sort(byStore),
          physical: false,
          bundleId: release.bundle,
        })
      }
      continue
    }
    const links = release.purchase_links ?? []
    const digital = links.filter((l) => l.format !== 'physical').sort(byStore)
    const physical = links.filter((l) => l.format === 'physical').sort(byStore)
    if (digital.length) add({ release, links: digital, physical: false })
    if (physical.length) add({ release, links: physical, physical: true })
  }

  // Primero lo que se vende suelto y después las recopilaciones
  for (const offers of groups.values()) {
    offers.sort((a, b) => Number(!!a.bundleId) - Number(!!b.bundleId))
  }
  return groups
}

const year = (date?: string) => date?.slice(0, 4)

function Buttons({ offer, slug }: { offer: Offer; slug: string }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {offer.links.map((link) => (
        <PurchaseButton
          key={link.url}
          store={link.store}
          url={link.url}
          tracking={{ videojuego: slug, plataforma: offer.release.platform }}
        />
      ))}
    </div>
  )
}

function ReleaseOffer({ offer, slug }: { offer: Offer; slug: string }) {
  const { release } = offer
  const details = [
    offer.physical ? 'Edición física' : undefined,
    release.edition,
    year(release.date),
    describeSpanish(release.spanish),
  ].filter(Boolean)

  return (
    <div>
      <p className="text-sm text-gray-400">{details.join(' · ')}</p>
      <Buttons offer={offer} slug={slug} />
    </div>
  )
}

function BundleOffer({ offer, slug }: { offer: Offer; slug: string }) {
  const bundle = getBundle(offer.bundleId!)!
  const bundleYear = year(getBundleRelease(offer.release)?.date ?? offer.release.date)
  const others = bundle.games
    .filter((other) => other !== slug)
    .map((other) => getVideogameBySlug(other))
    .filter((game) => game !== undefined)

  return (
    <div className="rounded-lg border border-dnd-gold/20 bg-dnd-stone/40 p-4">
      <p className="text-gray-200">
        Se vende en la recopilación <strong className="text-gray-100">{bundle.title}</strong>
        {bundleYear && <span className="text-gray-400"> ({bundleYear})</span>}
      </p>
      {others.length > 0 && (
        <p className="mt-1 text-sm text-gray-400">
          Incluye también:{' '}
          {others.map((game, index) => (
            <span key={game.slug}>
              {index > 0 && ' · '}
              <Link
                to={`/videojuego/${game.slug}`}
                className="text-dnd-gold hover:text-dnd-gold-light underline underline-offset-2"
              >
                {game.title}
              </Link>
            </span>
          ))}
        </p>
      )}
      <p className="mt-1 text-sm text-gray-400">{describeSpanish(offer.release.spanish)}</p>
      <Buttons offer={offer} slug={slug} />
    </div>
  )
}

export default function PurchaseByPlatform({ slug, releases }: PurchaseByPlatformProps) {
  const groups = offersByPlatform(releases)

  if (groups.size === 0) {
    return <p className="text-gray-400">No disponible a la venta.</p>
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-gray-500">
        Algunos enlaces son de afiliado: el catálogo puede recibir una comisión sin coste para ti.{' '}
        <Link to="/aviso-legal" className="underline hover:text-dnd-gold">
          Más información
        </Link>
      </p>
      {[...groups.entries()].map(([platform, offers]) => (
        <section key={platform} aria-label={platformNames[platform]} className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-100">
            <PlatformIcon platform={platform} className="h-5 w-5 text-gray-300" />
            {platformNames[platform]}
          </h3>
          {offers.map((offer, index) =>
            offer.bundleId ? (
              <BundleOffer key={index} offer={offer} slug={slug} />
            ) : (
              <ReleaseOffer key={index} offer={offer} slug={slug} />
            )
          )}
        </section>
      ))}
    </div>
  )
}
