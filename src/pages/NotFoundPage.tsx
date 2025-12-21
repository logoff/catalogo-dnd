import { Link } from 'react-router-dom'
import MetaTags from '@/components/seo/MetaTags'

export default function NotFoundPage() {
  return (
    <>
      <MetaTags title="Página no encontrada" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="font-display text-8xl text-dnd-red mb-4">404</div>
        <h1 className="font-display text-3xl text-dnd-gold mb-4">
          Página no encontrada
        </h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          La página que buscas no existe o ha sido movida.
          Quizás un Beholder la desintegró.
        </p>
        <Link to="/" className="btn-primary">
          Volver al inicio
        </Link>
      </div>
    </>
  )
}
