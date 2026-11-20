import { Link, useParams } from 'react-router-dom'
import NotFoundPage from '@/pages/NotFoundPage'
import { SpanishMark } from '@/components/ui/Badge'
import { getAllProducts } from '@/services/dataLoader'
import { getAllVideogames } from '@/services/videogameLoader'
import { useNovelIndex } from '@/hooks/useNovelData'
import { useRpgIndex } from '@/hooks/useRpgData'
import { productPath } from '@/utils/releases'
import { bookPath } from '@/utils/rpg'
import { worldFromSlug, worldNames, type World } from '@/utils/worlds'
import GuideLayout from './GuideLayout'

// Guías de orden de lectura que existen para cada mundo
const readingOrders: Partial<Record<World, { slug: string; title: string }[]>> = {
  forgotten_realms: [
    { slug: 'orden-de-lectura-drizzt', title: 'Orden de lectura de la Leyenda de Drizzt' },
  ],
  dragonlance: [
    { slug: 'orden-de-lectura-dragonlance', title: 'Orden de lectura de la Dragonlance' },
  ],
}

const year = (date: string | null | undefined) => (date ? date.slice(0, 4) : null)

// Todo lo del catálogo de un mundo: libros de 5E y 5.5E, libros de las ediciones anteriores por
// edición, novelas y videojuegos, a partir del campo de ambientación de cada ficha
export default function WorldGuide() {
  const { world: param = '' } = useParams()
  const world = worldFromSlug(param)
  const rpg = useRpgIndex()
  const novels = useNovelIndex()
  if (!world) return <NotFoundPage />

  const name = worldNames[world]
  const products = getAllProducts()
    .filter((p) => p.settings?.includes(world))
    .sort((a, b) => (a.dateRange.earliest ?? '').localeCompare(b.dateRange.earliest ?? ''))
  const games = getAllVideogames()
    .filter((g) => g.setting === world)
    .sort((a, b) => (a.firstReleaseDate ?? '').localeCompare(b.firstReleaseDate ?? ''))
  const worldNovels = novels?.novels.filter((n) => n.setting === world) ?? []
  const series = (novels?.series ?? [])
    .map((s) => ({ ...s, count: worldNovels.filter((n) => n.series?.id === s.id).length }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)

  // Libros de las ediciones anteriores agrupados por edición, de la más antigua a la más reciente
  const editions = (rpg?.systems ?? [])
    .filter((s) => s.official && !s.official_catalog)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((system) => ({
      system,
      books: (rpg?.books ?? [])
        .filter((b) => b.system === system.slug && b.settings?.includes(world))
        .sort((a, b) => (a.originalDate ?? '').localeCompare(b.originalDate ?? '')),
    }))
    .filter((e) => e.books.length > 0)

  return (
    <GuideLayout
      title={`${name}: guía de todo lo publicado`}
      description={`Todo lo que hay en el catálogo de ${name}: los libros de cada edición de D&D, las novelas y los videojuegos, cada uno con su ficha.`}
    >
      <p>
        Todo lo publicado de {name} que recoge el catálogo, de la edición más antigua a la más
        reciente: libros de juego, novelas y videojuegos. Cada título lleva a su ficha, con sus
        ediciones en inglés y en castellano.
      </p>

      {products.length > 0 && (
        <section>
          <h2>Libros de 5E y 5.5E</h2>
          <ul>
            {products.map((product) => (
              <li key={`${product.primaryEdition}-${product.code}`}>
                <Link to={productPath(product)}>{product.primaryTitle}</Link>{' '}
                <span className="text-muted">· {year(product.dateRange.earliest)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {editions.length > 0 && (
        <section>
          <h2>Ediciones anteriores de D&D</h2>
          {editions.map(({ system, books }) => (
            <div key={system.slug}>
              <h3>
                {system.name}{' '}
                <span className="text-sm font-normal text-muted">
                  {books.length === 1 ? '1 libro' : `${books.length} libros`}
                </span>
              </h3>
              <ul>
                {books.map((book) => (
                  <li key={book.slug}>
                    <Link to={bookPath(book, rpg!.systems)}>{book.title}</Link>{' '}
                    <span className="text-muted">· {year(book.originalDate)}</span>
                    {book.titleEs && book.titleEs !== book.title && (
                      <>
                        {' '}
                        <SpanishMark>
                          <span lang="es">{book.titleEs}</span>
                        </SpanishMark>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {worldNovels.length > 0 && (
        <section>
          <h2>Novelas</h2>
          <p>
            El catálogo tiene <strong>{worldNovels.length} novelas</strong> de {name}. Están todas
            en el <Link to={`/novelas?mundo=${world}`}>listado de novelas de {name}</Link>.
          </p>
          {readingOrders[world]?.map((guide) => (
            <p key={guide.slug}>
              <Link to={`/guias/${guide.slug}`}>{guide.title}</Link>
            </p>
          ))}
          {series.length > 0 && (
            <ul>
              {series.map((s) => (
                <li key={s.id}>
                  <Link to={`/novelas?serie=${s.id}`}>{s.title_es ?? s.title}</Link>{' '}
                  <span className="text-muted">
                    · {s.count === 1 ? '1 novela' : `${s.count} novelas`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {games.length > 0 && (
        <section>
          <h2>Videojuegos</h2>
          <ul>
            {games.map((game) => (
              <li key={game.slug}>
                <Link to={`/videojuego/${game.slug}`}>{game.title}</Link>{' '}
                <span className="text-muted">· {year(game.firstReleaseDate)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </GuideLayout>
  )
}
