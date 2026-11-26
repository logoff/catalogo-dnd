import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useComic, useComicIndex } from '@/hooks/useComicData'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ComicDetail from '@/components/comics/ComicDetail'
import { comicStructuredData } from '@/utils/comicStructuredData'
import { SITE_URL } from '@/utils/constants'
import NotFoundPage from './NotFoundPage'

export default function ComicDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const state = useComic(slug)
  const index = useComicIndex()

  if (state.status === 'missing') return <NotFoundPage />
  if (state.status === 'loading' || !index) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="py-12 text-center text-muted">Cargando cómic…</p>
      </div>
    )
  }

  const { comic } = state

  return (
    <>
      <MetaTags
        title={comic.spanishTitle ?? comic.title}
        description={comic.description}
        image={comic.cover ? `${SITE_URL}${comic.cover}` : undefined}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Sin «<» literal, para que un texto no pueda cerrar la etiqueta
          __html: JSON.stringify(comicStructuredData(comic)).replace(/</g, '\\u003c'),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Cómics', to: '/comics' }, { label: comic.title }]} />

        <Link
          to="/comics"
          className="mb-6 inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a cómics
        </Link>

        <ComicDetail comic={comic} index={index} />
      </div>
    </>
  )
}
