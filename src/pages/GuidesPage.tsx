import { Link } from 'react-router-dom'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import { GUIDES } from './guides/guides'

export function GuideCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {GUIDES.map((guide) => (
        <Link
          key={guide.slug}
          to={`/guias/${guide.slug}`}
          className="card-dnd p-5 hover:border-dnd-gold/50 transition-colors"
        >
          <h2 className="font-display text-xl text-dnd-gold mb-2">{guide.title}</h2>
          <p className="text-gray-400 text-sm">{guide.summary}</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Guías' }]} />
        <h1 className="font-display text-3xl text-dnd-gold mb-2">Guías</h1>
        <p className="text-gray-400 mb-8">
          Para orientarse entre tantos libros, cajas y ediciones.
        </p>
        <GuideCards />
      </div>
    </>
  )
}
