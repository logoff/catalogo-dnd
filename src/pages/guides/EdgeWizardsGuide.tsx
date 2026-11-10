import { Link } from 'react-router-dom'
import { formatDate } from '@/utils/formatters'
import { getEdgeEditions, type SpanishEditions } from '@/utils/releases'
import type { Publication } from '@/types'
import GuideLayout from './GuideLayout'

function Edition({ pub }: { pub: Publication }) {
  return (
    <>
      {pub.date && formatDate(pub.date)}
      {pub.isbn13 && <span className="block text-gray-400 font-mono">{pub.isbn13}</span>}
    </>
  )
}

function BookLink({ editions }: { editions: SpanishEditions }) {
  return (
    <Link to={`/producto/2014/${editions.product.code.toLowerCase()}`}>{editions.edge.title}</Link>
  )
}

export default function EdgeWizardsGuide() {
  const editions = getEdgeEditions()
  const reissued = editions.filter((e) => e.wizards)
  const edgeOnly = editions.filter((e) => !e.wizards)

  return (
    <GuideLayout
      title="Edge o Wizards: libros de D&D en castellano"
      description="Qué libros de la quinta edición publicó en castellano Edge Entertainment, cuáles reeditó después Wizards of the Coast y cómo distinguir cada edición por su código."
    >
      <p>
        La quinta edición de 2014 llegó al castellano de la mano de{' '}
        <strong>Edge Entertainment</strong>, con licencia de Gale Force Nine, que publicó{' '}
        {editions.length} libros y cajas entre 2017 y 2021. Desde octubre de 2021 es{' '}
        <strong>Wizards of the Coast</strong> quien publica directamente en castellano: reeditó{' '}
        {reissued.length} de esos títulos y el resto no ha vuelto a publicarse.
      </p>
      <p>
        Si compras de segunda mano, es fácil encontrar las dos ediciones del mismo libro. Las dos
        corresponden a la misma obra original, así que para jugar sirve cualquiera; esta guía te
        ayuda a saber cuál tienes delante.
      </p>

      <h2>Cómo distinguirlas</h2>
      <p>
        Lo más rápido es mirar el número que aparece bajo el código de barras de la contraportada:
      </p>
      <ul>
        <li>
          <strong>Wizards of the Coast</strong>: empieza siempre por <strong>978-0-7869</strong>, el
          prefijo editorial de Wizards.
        </li>
        <li>
          <strong>Edge Entertainment</strong>: o un ISBN español, que empieza por{' '}
          <strong>978-84</strong>, o un código propio de Edge que empieza por{' '}
          <strong>8435407</strong>.
        </li>
      </ul>

      <h2>Reeditados por Wizards</h2>
      <p>
        De estos títulos hay edición de Edge y edición de Wizards. Debajo de cada fecha tienes el
        código de cada una.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-100 border-b border-dnd-gold/30">
            <tr>
              <th className="py-2 pr-4">Libro</th>
              <th className="py-2 pr-4">Edge</th>
              <th className="py-2">Wizards</th>
            </tr>
          </thead>
          <tbody>
            {reissued.map((e) => (
              <tr key={e.product.code} className="border-b border-dnd-stone-light align-top">
                <td className="py-2 pr-4">
                  <BookLink editions={e} />
                </td>
                <td className="py-2 pr-4">
                  <Edition pub={e.edge} />
                </td>
                <td className="py-2">
                  <Edition pub={e.wizards!} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Solo en la edición de Edge</h2>
      <p>
        Wizards no ha reeditado estos títulos en castellano, así que solo se encuentran de segunda
        mano o en tiendas que aún conserven ejemplares.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-100 border-b border-dnd-gold/30">
            <tr>
              <th className="py-2 pr-4">Libro</th>
              <th className="py-2">Edge</th>
            </tr>
          </thead>
          <tbody>
            {edgeOnly.map((e) => (
              <tr key={e.product.code} className="border-b border-dnd-stone-light align-top">
                <td className="py-2 pr-4">
                  <BookLink editions={e} />
                </td>
                <td className="py-2">
                  <Edition pub={e.edge} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>¿Y los libros de 2024?</h2>
      <p>
        Todos los libros de la revisión de 2024 los publica en castellano Wizards of the Coast, así
        que ahí no hay dudas de edición. Si estás empezando, échale un vistazo a{' '}
        <Link to="/guias/2014-vs-2024">2014 frente a 2024</Link> antes de comprar los básicos de
        segunda mano, y a{' '}
        <Link to="/guias/cuando-sale-en-castellano">cuándo sale en castellano</Link> cada novedad.
      </p>
    </GuideLayout>
  )
}
