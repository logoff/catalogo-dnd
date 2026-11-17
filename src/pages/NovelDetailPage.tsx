import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useNovel, useNovelIndex } from '@/hooks/useNovelData'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import NovelDetail from '@/components/novels/NovelDetail'
import { mainCover } from '@/utils/novels'
import { novelStructuredData } from '@/utils/novelStructuredData'
import { SITE_URL } from '@/utils/constants'
import NotFoundPage from './NotFoundPage'

export default function NovelDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const state = useNovel(slug)
  const index = useNovelIndex()

  if (state.status === 'missing') return <NotFoundPage />
  if (state.status === 'loading' || !index) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-400 py-12 text-center">Cargando novela…</p>
      </div>
    )
  }

  const { novel } = state
  const cover = mainCover(novel)

  return (
    <>
      <MetaTags
        title={novel.titleEs ?? novel.title}
        description={novel.description}
        image={cover ? `${SITE_URL}${cover}` : undefined}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Sin «<» literal, para que un texto no pueda cerrar la etiqueta
          __html: JSON.stringify(novelStructuredData(novel, index)).replace(/</g, '\\u003c'),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Novelas', to: '/novelas' }, { label: novel.title }]} />

        <Link
          to="/novelas"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-dnd-gold mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a novelas
        </Link>

        <NovelDetail novel={novel} index={index} />
      </div>
    </>
  )
}
