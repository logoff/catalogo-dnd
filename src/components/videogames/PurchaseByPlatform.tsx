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

// La primera oferta de la ficha lleva el botón principal; el resto, secundarios
interface OfferProps {
  offer: Offer
  slug: string
  primary?: boolean
}

function Buttons({ offer, slug, primary = false }: OfferProps) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {offer.links.map((link, index) => (
        <PurchaseButton
          key={link.url}
          primary={primary && index === 0}
          store={link.store}
          url={link.url}
          tracking={{ videojuego: slug, plataforma: offer.release.platform }}
        />
      ))}
    </div>
  )
}

function ReleaseOffer({ offer, slug, primary }: OfferProps) {
  const { release } = offer
  const details = [
    offer.physical ? 'Edición física' : undefined,
    release.edition,
    year(release.date),
    describeSpanish(release.spanish),
  ].filter(Boolean)

  return (
    <div>
      <p className="text-sm text-muted">{details.join(' · ')}</p>
      <Buttons offer={offer} slug={slug} primary={primary} />
    </div>
  )
}

function BundleOffer({ offer, slug, primary }: OfferProps) {
  const bundle = getBundle(offer.bundleId!)!
  const bundleYear = year(getBundleRelease(offer.release)?.date ?? offer.release.date)
  const others = bundle.games
    .filter((other) => other !== slug)
    .map((other) => getVideogameBySlug(other))
    .filter((game) => game !== undefined)

  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-fg">
        Se vende en la recopilación <strong className="text-fg">{bundle.title}</strong>
        {bundleYear && <span className="text-muted"> ({bundleYear})</span>}
      </p>
      {others.length > 0 && (
        <p className="mt-1 text-sm text-muted">
          Incluye también:{' '}
          {others.map((game, index) => (
            <span key={game.slug}>
              {index > 0 && ' · '}
              <Link
                to={`/videojuego/${game.slug}`}
                className="underline decoration-muted underline-offset-2 transition-colors duration-150 hover:decoration-fg"
              >
                {game.title}
              </Link>
            </span>
          ))}
        </p>
      )}
      <p className="mt-1 text-sm text-muted">{describeSpanish(offer.release.spanish)}</p>
      <Buttons offer={offer} slug={slug} primary={primary} />
    </div>
  )
}

export default function PurchaseByPlatform({ slug, releases }: PurchaseByPlatformProps) {
  const groups = offersByPlatform(releases)

  if (groups.size === 0) {
    return <p className="text-muted">No disponible a la venta.</p>
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted">
        Algunos enlaces son de afiliado: el catálogo puede recibir una comisión sin coste para ti.{' '}
        <Link to="/aviso-legal" className="underline underline-offset-2 hover:text-fg">
          Más información
        </Link>
      </p>
      {[...groups.entries()].map(([platform, offers], groupIndex) => (
        <section key={platform} aria-label={platformNames[platform]} className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <PlatformIcon platform={platform} size="md" className="text-fg" />
            {platformNames[platform]}
          </h3>
          {offers.map((offer, index) =>
            offer.bundleId ? (
              <BundleOffer
                key={index}
                offer={offer}
                slug={slug}
                primary={groupIndex === 0 && index === 0}
              />
            ) : (
              <ReleaseOffer
                key={index}
                offer={offer}
                slug={slug}
                primary={groupIndex === 0 && index === 0}
              />
            )
          )}
        </section>
      ))}
    </div>
  )
}
