import { Link } from 'react-router-dom'
import ReadingOrderGuide from './ReadingOrderGuide'

export default function DrizztReadingOrder() {
  return (
    <ReadingOrderGuide
      order="drizzt"
      title="Orden de lectura de la Leyenda de Drizzt"
      description="Todas las novelas de R. A. Salvatore sobre Drizzt Do'Urden en orden, con su título en castellano y qué se ha traducido."
    >
      <p>
        La Leyenda de Drizzt reúne más de treinta novelas de R. A. Salvatore sobre el elfo oscuro
        Drizzt Do'Urden y sus compañeros, en los Reinos Olvidados. Este es el orden cronológico de
        la historia, el mismo de la numeración oficial: se empieza por su infancia en Menzoberranzan
        con <em>La morada</em>, aunque la primera publicada fue <em>La piedra de cristal</em>, en
        1988.
      </p>
      <p>
        Si prefieres el orden de publicación, lee primero el valle del Viento Helado y después el
        elfo oscuro; a partir de ahí los dos órdenes coinciden. Cada título lleva a su ficha, con
        todas sus ediciones y dónde comprarlas. Puedes ver todas las novelas en el{' '}
        <Link to="/novelas?mundo=forgotten_realms">listado de los Reinos Olvidados</Link>.
      </p>
    </ReadingOrderGuide>
  )
}
