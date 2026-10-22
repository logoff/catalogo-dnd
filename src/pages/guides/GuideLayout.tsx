import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import { getProductByCodeAndEdition } from '@/services/dataLoader'

interface GuideLayoutProps {
  title: string
  description: string
  children: ReactNode
}

// Estilos de texto largo para el contenido de las guías
const articleClasses = `
  space-y-4 text-gray-300 leading-relaxed
  [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-dnd-gold [&_h2]:mt-10 [&_h2]:mb-3
  [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:text-gray-100 [&_h3]:mt-6 [&_h3]:mb-2
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
  [&_strong]:text-gray-100
  [&_a]:text-dnd-gold [&_a:hover]:text-dnd-gold-light [&_a]:underline [&_a]:underline-offset-2
`

export default function GuideLayout({ title, description, children }: GuideLayoutProps) {
  return (
    <>
      <MetaTags title={title} description={description} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Guías', to: '/guias' }, { label: title }]} />

        <h1 className="font-display text-3xl md:text-4xl text-dnd-gold mb-4">{title}</h1>
        <p className="text-lg text-gray-400 mb-8">{description}</p>

        <article className={articleClasses}>{children}</article>
      </div>
    </>
  )
}

interface ProductLinkProps {
  edition: '2014' | '2024'
  code: string
  children?: ReactNode
}

// Enlace a la ficha de un producto; sin texto, usa el título del producto
export function ProductLink({ edition, code, children }: ProductLinkProps) {
  const product = getProductByCodeAndEdition(code, edition === '2014' ? '5e' : '2024')
  return (
    <Link to={`/producto/${edition}/${code.toLowerCase()}`}>
      {children ?? product?.primaryTitle ?? code}
    </Link>
  )
}
