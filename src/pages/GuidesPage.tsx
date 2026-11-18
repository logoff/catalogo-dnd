import { Link } from 'react-router-dom'
import { cardClass } from '@/components/ui/styles'
import PageHeader from '@/components/ui/PageHeader'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import { GUIDES } from './guides/guides'

export function GuideCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {GUIDES.map((guide) => (
        <Link key={guide.slug} to={`/guias/${guide.slug}`} className={cardClass(true, 'gap-2 p-5')}>
          <h3 className="text-base font-semibold tracking-tight">{guide.title}</h3>
          <p className="text-sm text-muted">{guide.summary}</p>
        </Link>
      ))}
    </div>
  )
}

export default function GuidesPage() {
  return (
    <>
      <MetaTags
        title="Guías"
        description="Guías para elegir libros de Dungeons & Dragons: por dónde empezar, diferencias entre 2014 y 2024 y qué hay en castellano."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Guías' }]} />
        <PageHeader
          title="Guías"
          description="Para orientarse entre tantos libros, cajas y ediciones."
        />
        <GuideCards />
      </div>
    </>
  )
}
