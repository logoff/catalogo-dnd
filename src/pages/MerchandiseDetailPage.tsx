import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { getMerchandiseBySlug } from '@/services/merchandiseLoader'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import MerchandiseDetail from '@/components/merchandise/MerchandiseDetail'
import { SITE_URL } from '@/utils/constants'
import NotFoundPage from './NotFoundPage'

export default function MerchandiseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const item = slug ? getMerchandiseBySlug(slug) : undefined

  if (!item) return <NotFoundPage />

  return (
    <>
      <MetaTags
        title={item.title_es ?? item.title}
        description={item.description}
        image={`${SITE_URL}${item.images[0]}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[{ label: 'Merchandising', to: '/merchandising' }, { label: item.title }]}
        />

        <Link
          to="/merchandising"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-dnd-gold mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a merchandising
        </Link>

        <MerchandiseDetail item={item} />
      </div>
    </>
  )
}
