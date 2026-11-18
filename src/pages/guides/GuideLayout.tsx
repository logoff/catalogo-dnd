import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import Prose from '@/components/common/Prose'
import { getProductByCodeAndEdition } from '@/services/dataLoader'

interface GuideLayoutProps {
  title: string
  description: string
  // Imagen propia para la vista previa en redes; sin ella, la genérica del sitio
  image?: string
  children: ReactNode
}

export default function GuideLayout({ title, description, image, children }: GuideLayoutProps) {
  return (
    <>
      <MetaTags title={title} description={description} image={image} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Guías', to: '/guias' }, { label: title }]} />

        <h1 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="text-lg text-muted mb-8">{description}</p>

        <Prose>{children}</Prose>
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
