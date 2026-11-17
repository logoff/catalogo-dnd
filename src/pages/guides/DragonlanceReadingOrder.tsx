import { Link } from 'react-router-dom'
import ReadingOrderGuide from './ReadingOrderGuide'

export default function DragonlanceReadingOrder() {
  return (
    <ReadingOrderGuide
      order="dragonlance"
      title="Orden de lectura de la Dragonlance"
      description="Las novelas de Margaret Weis y Tracy Hickman de la línea principal de la Dragonlance, en orden, con su título en castellano."
    >
      <p>
        La línea principal de la Dragonlance son las novelas de Margaret Weis y Tracy Hickman que
        siguen a los Héroes de la Lanza y a sus herederos: de las Crónicas, de 1984, a los Destinos,
        de 2024. Aquí van en orden de publicación, que es como se recomienda leerlas: las Crónicas
        perdidas, aunque transcurren durante las Crónicas, se escribieron veinte años después y se
        disfrutan más tras conocer la historia completa.
      </p>
      <p>
        La saga tiene además cientos de novelas de otros autores, sueltas y en series; están todas
        en el <Link to="/novelas?mundo=dragonlance">listado de la Dragonlance</Link>. Cada título de
        la guía lleva a su ficha, con todas sus ediciones y dónde comprarlas.
      </p>
    </ReadingOrderGuide>
  )
}
