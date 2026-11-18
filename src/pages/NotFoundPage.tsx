import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/styles'
import MetaTags from '@/components/seo/MetaTags'

export default function NotFoundPage() {
  return (
    <>
      <MetaTags title="Página no encontrada" />

      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="mb-4 font-mono text-sm text-muted">Error 404</p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight">Página no encontrada</h1>
        <p className="mx-auto mb-8 max-w-md text-muted">
          La página que buscas no existe o ha sido movida. Quizás un Beholder la desintegró.
        </p>
        <Link to="/" className={buttonClass('primary')}>
          Volver al inicio
        </Link>
      </div>
    </>
  )
}
