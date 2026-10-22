import { Link } from 'react-router-dom'
import { getAllProducts } from '@/services/dataLoader'
import GuideLayout from './GuideLayout'
import Timeline from './Timeline'

export default function SpanishTimeline() {
  const products = getAllProducts()
  const spanishProducts = products.filter((p) => p.languages.includes('castellano'))

  return (
    <GuideLayout
      title="D&D en castellano: cronología"
      description="Todos los libros y cajas de la quinta edición de Dungeons & Dragons publicados en castellano, por orden de publicación y con su editorial."
    >
      <p>
        La quinta edición llegó al castellano en 2017, tres años después que en inglés, de la mano
        de <strong>Edge Entertainment</strong>, con licencia de Gale Force Nine. Edge publicó los
        libros básicos y buena parte de las aventuras hasta 2021. Desde octubre de ese año es{' '}
        <strong>Wizards of the Coast</strong> quien publica directamente en castellano: reeditó los
        libros básicos y algunos títulos de Edge, y desde entonces traduce sus novedades con mucho
        menos retraso.
      </p>
      <p>
        De los {products.length} productos del catálogo, {spanishProducts.length} tienen edición en
        castellano. Muchos suplementos y ambientaciones de 2014 nunca se tradujeron; puedes
        consultarlos en la <Link to="/guias/cronologia-ingles">cronología en inglés</Link>.
      </p>

      <Timeline language="castellano" showPublisher />
    </GuideLayout>
  )
}
