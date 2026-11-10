import { Link } from 'react-router-dom'
import { getProductsByEdition } from '@/services/dataLoader'
import { formatDate } from '@/utils/formatters'
import { firstPublication, translationDelay } from '@/utils/releases'
import type { ProductWithMeta } from '@/types'
import GuideLayout from './GuideLayout'

const months = (n: number) => `${n} ${n === 1 ? 'mes' : 'meses'}`

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2)
}

// Novedades primero; las anunciadas sin fecha, arriba del todo
function byEnglishDateDesc(a: ProductWithMeta, b: ProductWithMeta): number {
  const dateA = firstPublication(a, 'english')?.date ?? '9999'
  const dateB = firstPublication(b, 'english')?.date ?? '9999'
  return dateB.localeCompare(dateA)
}

export default function SpanishReleases() {
  const products2024 = getProductsByEdition('2024')
  const mainProducts = products2024
    .filter((p) => p.primaryType !== 'accessory')
    .sort(byEnglishDateDesc)
  const accessories = products2024.filter((p) => p.primaryType === 'accessory')
  const translatedAccessories = accessories.filter((p) => p.languages.includes('castellano'))

  const delays = mainProducts
    .map((p) => ({ product: p, delay: translationDelay(p) }))
    .filter((d): d is { product: ProductWithMeta; delay: number } => d.delay !== undefined)
  const fastest = delays.reduce((best, d) => (d.delay < best.delay ? d : best), delays[0])
  const values = delays.map((d) => d.delay)

  return (
    <GuideLayout
      title="¿Cuándo sale en castellano?"
      description="Fechas de salida de las novedades de D&D 2024 en inglés y en castellano, y cuánto suele tardar Wizards of the Coast en traducirlas."
    >
      <p>
        Desde la revisión de 2024, <strong>Wizards of the Coast</strong> publica directamente en
        castellano los libros y cajas principales, unos meses después que en inglés. De los{' '}
        {delays.length} que ya tienen edición en castellano, la traducción ha tardado entre{' '}
        {Math.min(...values)} y {months(Math.max(...values))}, con una mediana de{' '}
        <strong>{months(median(values))}</strong>. La más rápida ha sido{' '}
        <Link to={`/producto/2024/${fastest.product.code.toLowerCase()}`}>
          {fastest.product.primaryTitle}
        </Link>
        , con {months(fastest.delay)}.
      </p>
      <p>
        La tabla recoge todos los libros y cajas de la línea 2024, de los más recientes a los más
        antiguos. Las fechas futuras son las que ha anunciado la editorial y pueden cambiar.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-100 border-b border-dnd-gold/30">
            <tr>
              <th className="py-2 pr-4">Producto</th>
              <th className="py-2 pr-4">En inglés</th>
              <th className="py-2">En castellano</th>
            </tr>
          </thead>
          <tbody>
            {mainProducts.map((product) => {
              const english = firstPublication(product, 'english')
              const spanish = firstPublication(product, 'castellano')
              return (
                <tr key={product.code} className="border-b border-dnd-stone-light align-top">
                  <td className="py-2 pr-4">
                    <Link to={`/producto/2024/${product.code.toLowerCase()}`}>
                      {product.primaryTitle}
                    </Link>
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {english?.date ? formatDate(english.date) : 'Anunciado, sin fecha'}
                  </td>
                  <td className="py-2">
                    {spanish ? (
                      <>
                        {spanish.date ? formatDate(spanish.date) : 'Anunciado, sin fecha'}
                        <span className="block text-gray-400">{spanish.title}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Sin anunciar</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h2>Accesorios</h2>
      <p>
        {translatedAccessories.length === 0
          ? `Ninguno de los ${accessories.length} accesorios de 2024 (pantallas del DM, packs de mapas, barajas y cartas de referencia) tiene por ahora edición en castellano.`
          : `De los ${accessories.length} accesorios de 2024 (pantallas del DM, packs de mapas, barajas y cartas de referencia), ${translatedAccessories.length} tienen edición en castellano.`}{' '}
        Puedes verlos todos en el <Link to="/2024">catálogo de 2024</Link>.
      </p>

      <h2>¿Y los libros de 2014?</h2>
      <p>
        De la quinta edición original se tradujeron los libros básicos y parte de las aventuras,
        primero con Edge Entertainment y después con la propia Wizards. Muchos suplementos y
        ambientaciones nunca llegaron al castellano: lo tienes todo en la{' '}
        <Link to="/guias/cronologia-castellano">cronología en castellano</Link>.
      </p>
    </GuideLayout>
  )
}
