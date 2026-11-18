import { Link } from 'react-router-dom'
import MetaTags from '@/components/seo/MetaTags'

export default function NotFoundPage() {
  return (
    <>
      <MetaTags title="Página no encontrada" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-8xl text-accent mb-4">404</div>
        <h1 className="text-3xl text-fg mb-4">Página no encontrada</h1>
        <p className="text-muted mb-8 max-w-md mx-auto">
          La página que buscas no existe o ha sido movida. Quizás un Beholder la desintegró.
        </p>
        <Link to="/" className="btn-primary">
          Volver al inicio
        </Link>
      </div>
    </>
  )
}
