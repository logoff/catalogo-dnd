import { Link } from 'react-router-dom'
import { cardClass } from '@/components/ui/styles'
import PageHeader from '@/components/ui/PageHeader'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import SectionNav from '@/components/ui/SectionNav'
import { GUIDES, GUIDE_GROUPS, type Guide } from './guides/guides'

export function GuideCards({ guides = GUIDES }: { guides?: Guide[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => (
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
        description="Guías de Dungeons & Dragons por tipo: por dónde empezar, libros de 5E y 5.5E en inglés y en castellano, y órdenes de lectura de las novelas."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Guías' }]} />
        <PageHeader
          title="Guías"
          description="Para orientarse entre tantos libros, cajas y ediciones."
        />
        <SectionNav
          sections={GUIDE_GROUPS.map(({ id, label }) => ({ id, label }))}
          label="Tipos de guía"
          className="mb-6"
        />
        <div className="space-y-10">
          {GUIDE_GROUPS.map(({ id, label }) => (
            <section key={id} id={id} className="scroll-mt-32">
              <h2 className="mb-4 text-xl font-semibold tracking-tight">{label}</h2>
              <GuideCards guides={GUIDES.filter((guide) => guide.group === id)} />
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
