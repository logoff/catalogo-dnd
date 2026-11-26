import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { getScreenWorkBySlug } from '@/services/screenLoader'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ScreenDetail from '@/components/screen/ScreenDetail'
import { SITE_URL } from '@/utils/constants'
import { kindNames, screenStructuredData, yearsLabel } from '@/utils/screen'
import NotFoundPage from './NotFoundPage'

export default function ScreenDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const work = slug ? getScreenWorkBySlug(slug) : undefined

  if (!work) return <NotFoundPage />

  const years = yearsLabel(work)

  return (
    <>
      <MetaTags
        title={`${work.displayTitle} (${[kindNames[work.kind].toLowerCase(), years].filter(Boolean).join(', ')})`}
        description={work.description}
        image={work.poster ? `${SITE_URL}${work.poster.image}` : undefined}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Sin «<» literal, para que un texto no pueda cerrar la etiqueta
          __html: JSON.stringify(screenStructuredData(work)).replace(/</g, '\\u003c'),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: 'Cine y series', to: '/cine-y-series' }, { label: work.displayTitle }]}
        />

        <Link
          to="/cine-y-series"
          className="mb-6 inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a cine y series
        </Link>

        <ScreenDetail work={work} />
      </div>
    </>
  )
}
