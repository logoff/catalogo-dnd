import { Link } from 'react-router-dom'
import { getAllProducts } from '@/services/dataLoader'
import GuideLayout from './GuideLayout'
import Timeline from './Timeline'

export default function EnglishTimeline() {
  const products = getAllProducts()
  const englishOnly = products.filter(
    (p) => p.languages.includes('english') && !p.languages.includes('castellano')
  )

  return (
    <GuideLayout
      title="D&D en inglés: cronología"
      description="Todos los libros, cajas y accesorios de la quinta edición de Dungeons & Dragons publicados en inglés, por orden de publicación, incluidos los anunciados."
    >
      <p>
        La quinta edición se publicó en inglés en el verano de 2014, con la caja de inicio y el
        Manual del Jugador, y durante diez años Wizards of the Coast fue ampliándola con
        suplementos, ambientaciones y aventuras. En septiembre de 2024 empezó la revisión de las
        reglas (5.5E), que desde entonces es la base de todas las novedades. Desde esa revisión,
        muchos libros salen también con una <strong>portada alternativa</strong>, que se lista
        aparte.
      </p>
      <p>
        Todo lo que sale en castellano se publica antes en inglés. De los {products.length}{' '}
        productos del catálogo, {englishOnly.length} solo existen en inglés. Para ver qué se ha
        traducido y cuándo, consulta la{' '}
        <Link to="/guias/cronologia-castellano">cronología en castellano</Link>.
      </p>

      <Timeline language="english" />
    </GuideLayout>
  )
}
