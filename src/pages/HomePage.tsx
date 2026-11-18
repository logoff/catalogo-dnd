import { Link } from 'react-router-dom'
import MetaTags from '@/components/seo/MetaTags'
import { useProductStore } from '@/store/productStore'
import ProductGrid from '@/components/products/ProductGrid'
import { getAssetPath } from '@/utils/constants'
import { GuideCards } from './GuidesPage'
import { useVideogameStore } from '@/store/videogameStore'
import VideogameCard from '@/components/videogames/VideogameCard'
import { useMerchandiseStore } from '@/store/merchandiseStore'
import MerchandiseCard from '@/components/merchandise/MerchandiseCard'
import NovelCard from '@/components/novels/NovelCard'
import novelsLatest from 'virtual:novels-latest'

export default function HomePage() {
  const products = useProductStore((state) => state.products)

  const products2014 = products.filter((p) => p.primaryEdition === '5e')
  const products2024 = products.filter((p) => p.primaryEdition === '2024')

  // Get featured products (first 5 from each edition)
  const featured2024 = products2024.slice(0, 5)
  const featured2014 = products2014.slice(0, 5)

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

      {/* Hero section */}
      <section className="relative bg-linear-to-b from-dnd-stone to-dnd-stone-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src={getAssetPath('images/logo.svg')} alt="" className="h-24 md:h-32 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl text-fg mb-4">Catálogo D&D 5E</h1>
          <p className="text-xl text-fg max-w-2xl mx-auto mb-8">
            Explora todos los productos oficiales de Dungeons & Dragons 5ª edición (2014) y la nueva
            edición 5.5 (2024), los videojuegos oficiales, el merchandising con licencia y las
            novelas de D&D.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/2014" className="btn-secondary">
              Explorar 5E (2014)
            </Link>
            <Link to="/2024" className="btn-secondary">
              Explorar 5.5E (2024)
            </Link>
            <Link to="/videojuegos" className="btn-secondary">
              Videojuegos
            </Link>
            <Link to="/merchandising" className="btn-secondary">
              Merchandising
            </Link>
            <Link to="/novelas" className="btn-secondary">
              Novelas
            </Link>
          </div>
        </div>
      </section>

      {/* Stats section - compact */}
      <section className="py-4 border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl text-fg">{products.length}</span>
              <span className="text-muted">productos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl text-fg">{products2014.length}</span>
              <span className="text-muted">de 5E (2014)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl text-fg">{products2024.length}</span>
              <span className="text-muted">de 5.5E (2024)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl text-fg">{videogames.length}</span>
              <span className="text-muted">videojuegos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl text-fg">{merchandise.length}</span>
              <span className="text-muted">de merchandising</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl text-fg">{novelsLatest.total}</span>
              <span className="text-muted">novelas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-fg">Guías</h2>
            <Link to="/guias" className="text-fg hover:text-fg">
              Ver todas &rarr;
            </Link>
          </div>
          <GuideCards />
        </div>
      </section>

      {/* Featured 2024 */}
      {featured2024.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-fg">D&D 5.5E (2024)</h2>
              <Link to="/2024" className="text-fg hover:text-fg">
                Ver todos &rarr;
              </Link>
            </div>
            <ProductGrid products={featured2024} />
          </div>
        </section>
      )}

      {/* Featured 2014 */}
      {featured2014.length > 0 && (
        <section className="py-12 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-fg">D&D 5E (2014)</h2>
              <Link to="/2014" className="text-fg hover:text-fg">
                Ver todos &rarr;
              </Link>
            </div>
            <ProductGrid products={featured2014} />
          </div>
        </section>
      )}

      {/* Videojuegos */}
      {latestVideogames.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-fg">Videojuegos</h2>
              <Link to="/videojuegos" className="text-fg hover:text-fg">
                Ver todos &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {latestVideogames.map((game) => (
                <VideogameCard key={game.slug} game={game} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Merchandising */}
      {latestMerchandise.length > 0 && (
        <section className="py-12 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-fg">Merchandising</h2>
              <Link to="/merchandising" className="text-fg hover:text-fg">
                Ver todo &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {latestMerchandise.map((item) => (
                <MerchandiseCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Novelas */}
      {novelsLatest.latest.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-fg">Novelas</h2>
              <Link to="/novelas" className="text-fg hover:text-fg">
                Ver todas &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {novelsLatest.latest.map((novel) => (
                <NovelCard key={novel.slug} novel={novel} series={novelsLatest.series} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
