import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { getVideogameBySlug } from '@/services/videogameLoader'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import VideogameDetail from '@/components/videogames/VideogameDetail'
import { SITE_URL } from '@/utils/constants'
import NotFoundPage from './NotFoundPage'

export default function VideogameDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const game = slug ? getVideogameBySlug(slug) : undefined

  if (!game) return <NotFoundPage />

  const cover = game.images?.[0]
  const year = game.firstReleaseDate?.slice(0, 4)

  return (
    <>
      <MetaTags
        title={year ? `${game.title} (${year})` : game.title}
        description={game.description}
        image={cover && `${SITE_URL}${cover}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[{ label: 'Videojuegos', to: '/videojuegos' }, { label: game.title }]}
        />

        <Link
          to="/videojuegos"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-dnd-gold mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a videojuegos
        </Link>

        <VideogameDetail game={game} />
      </div>
    </>
  )
}
