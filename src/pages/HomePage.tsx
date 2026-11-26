import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import type { ReactNode } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import { useProductStore } from '@/store/productStore'
import ProductGrid from '@/components/products/ProductGrid'
import SearchBar from '@/components/filters/SearchBar'
import { GuideCards } from './GuidesPage'
import { GUIDES } from './guides/guides'
import { useVideogameStore } from '@/store/videogameStore'
import VideogameCard from '@/components/videogames/VideogameCard'
import { useMerchandiseStore } from '@/store/merchandiseStore'
import MerchandiseCard from '@/components/merchandise/MerchandiseCard'
import NovelCard from '@/components/novels/NovelCard'
import { cardClass, headingClass } from '@/components/ui/styles'
import { latestInSpanish } from '@/utils/releases'
import novelsLatest from 'virtual:novels-latest'
import rpgStats from 'virtual:rpg-stats'
import comicsStats from 'virtual:comics-stats'
import releases from 'virtual:releases'
import { ReleaseList } from '@/components/releases/ReleaseList'
import type { ReleasesIndex } from '@/types/releases'
import { getAllScreenWorks } from '@/services/screenLoader'

const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'

// Acceso a una sección con lo que contiene y cuántos elementos tiene
function SectionCard({
  to,
  title,
  description,
  count,
}: {
  to: string
  title: string
  description: string
  count: number
}) {
  return (
    <Link to={to} className={cardClass(true, 'gap-3 p-5')}>
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-base font-semibold tracking-tight">{title}</span>
        <span className="font-mono text-sm text-muted tabular-nums">{count}</span>
      </span>
      <span className="text-sm text-muted">{description}</span>
    </Link>
  )
}

function Block({
  title,
  to,
  linkLabel,
  children,
}: {
  title: string
  to: string
  linkLabel: string
  children: ReactNode
}) {
  return (
    <section className={`${container} py-10`}>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className={headingClass('section')}>{title}</h2>
        <Link
          to={to}
          className="inline-flex min-h-11 items-center gap-1 text-sm text-muted transition-colors duration-150 hover:text-fg sm:min-h-0"
        >
          {linkLabel}
          <ArrowRightIcon className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      {children}
    </section>
  )
}

// Cuántas novedades próximas y recientes muestra la portada
const RELEASES_PREVIEW = 3

// Lo más próximo y lo más reciente de /novedades; sin próximas, solo lo reciente
export function ReleasesPreview({ data = releases }: { data?: ReleasesIndex }) {
  const upcoming = data.upcoming.slice(0, RELEASES_PREVIEW)
  const recent = data.recent.slice(0, RELEASES_PREVIEW)
  if (upcoming.length === 0 && recent.length === 0) return null
  return (
    <Block title="Novedades" to="/novedades" linkLabel="Ver todas">
      <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
        {upcoming.length > 0 && (
          <div>
            <h3 className={headingClass('group', 'mb-1')}>Próximamente</h3>
            <ReleaseList releases={upcoming} />
          </div>
        )}
        {recent.length > 0 && (
          <div>
            <h3 className={headingClass('group', 'mb-1')}>Recién salido</h3>
            <ReleaseList releases={recent} />
          </div>
        )}
      </div>
    </Block>
  )
}

const cardGrid = 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4'

export default function HomePage() {
  const products = useProductStore((state) => state.products)
  const count2014 = products.filter((p) => p.primaryEdition === '5e').length
  const count2024 = products.filter((p) => p.primaryEdition === '2024').length
  const latestSpanish = latestInSpanish(products, 5)

  // Los videojuegos publicados más recientes
  const videogames = useVideogameStore((state) => state.videogames)
  const latestVideogames = videogames
    .filter((game) => game.firstReleaseDate && game.status !== 'announced')
    .slice(-4)
    .reverse()

  // Los artículos de merchandising más recientes (ya vienen del más nuevo al más antiguo)
  const merchandise = useMerchandiseStore((state) => state.items)
  const latestMerchandise = merchandise.slice(0, 4)

  return (
    <>
      <MetaTags />

      <section className={`${container} pt-12 pb-8 sm:pt-16`}>
        <div className="flex max-w-2xl flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Catálogo de Dungeons &amp; Dragons
          </h1>
          <p className="text-lg text-muted">
            Libros de 5E (2014) y 5.5E (2024), videojuegos, cine y series, merchandising, novelas y
            cómics: qué hay en castellano, cuándo salió y dónde comprarlo.
          </p>
          <div className="mt-2 max-w-xl">
            <SearchBar size="lg" />
          </div>
        </div>
      </section>

      <section className={`${container} pb-6`} aria-label="Secciones del catálogo">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SectionCard
            to="/2024"
            title="Libros de 5.5E (2024)"
            description="Las reglas revisadas: básicos, suplementos y aventuras."
            count={count2024}
          />
          <SectionCard
            to="/2014"
            title="Libros de 5E (2014)"
            description="La quinta edición original, con sus ediciones de Edge y Wizards."
            count={count2014}
          />
          <SectionCard
            to="/videojuegos"
            title="Videojuegos"
            description="Todos los juegos oficiales, con su castellano y dónde comprarlos."
            count={videogames.length}
          />
          <SectionCard
            to="/merchandising"
            title="Merchandising"
            description="Libros licenciados, figuras, juegos de mesa y de cartas."
            count={merchandise.length}
          />
          <SectionCard
            to="/novelas"
            title="Novelas"
            description="Las novelas oficiales desde 1978, en inglés y en castellano."
            count={novelsLatest.total}
          />
          <SectionCard
            to="/comics"
            title="Cómics"
            description="Los cómics oficiales desde 1987, con sus tomos en inglés y en castellano."
            count={comicsStats.total}
          />
          <SectionCard
            to="/cine-y-series"
            title="Cine y series"
            description="Películas, series y documentales de D&D, con sus estrenos en España y aparte las obras no oficiales."
            count={getAllScreenWorks().length}
          />
          <SectionCard
            to="/rol"
            title="Otros juegos de rol"
            description={`Pathfinder, Tales of the Valiant y otros ${rpgStats.systems} sistemas de la familia de D&D, con sus libros y sus licencias abiertas.`}
            count={rpgStats.books}
          />
          <SectionCard
            to="/guias"
            title="Guías"
            description="Por dónde empezar, 2014 o 2024, fechas en castellano y órdenes de lectura."
            count={GUIDES.length}
          />
        </div>
      </section>

      <ReleasesPreview />

      {latestSpanish.length > 0 && (
        <Block
          title="Últimos en castellano"
          to="/guias/cuando-sale-en-castellano"
          linkLabel="Calendario"
        >
          <ProductGrid products={latestSpanish} />
        </Block>
      )}

      {latestVideogames.length > 0 && (
        <Block title="Videojuegos" to="/videojuegos" linkLabel="Ver todos">
          <div className={cardGrid}>
            {latestVideogames.map((game) => (
              <VideogameCard key={game.slug} game={game} />
            ))}
          </div>
        </Block>
      )}

      {latestMerchandise.length > 0 && (
        <Block title="Merchandising" to="/merchandising" linkLabel="Ver todo">
          <div className={cardGrid}>
            {latestMerchandise.map((item) => (
              <MerchandiseCard key={item.slug} item={item} />
            ))}
          </div>
        </Block>
      )}

      {novelsLatest.latest.length > 0 && (
        <Block title="Novelas" to="/novelas" linkLabel="Ver todas">
          <div className={cardGrid}>
            {novelsLatest.latest.map((novel) => (
              <NovelCard key={novel.slug} novel={novel} series={novelsLatest.series} />
            ))}
          </div>
        </Block>
      )}

      <Block title="Guías" to="/guias" linkLabel="Ver todas">
        <GuideCards />
      </Block>
    </>
  )
}
