import { Link } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import { headingClass } from '@/components/ui/styles'
import type { RpgMovement } from '@/types/rpg'
import { MOVEMENTS_ANCHOR, movementNames } from '@/utils/rpgTranslations'

// Etiqueta del movimiento de un sistema, enlazada a la explicación
export function MovementBadge({ movement }: { movement: RpgMovement }) {
  return (
    <Link
      to={`/rol#${MOVEMENTS_ANCHOR}`}
      title="Qué son el OSR y el NSR"
      className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <Badge>{movementNames[movement]}</Badge>
    </Link>
  )
}

// Qué son el OSR y el NSR y qué criterio sigue el catálogo, dejando claro que las etiquetas son
// una orientación y no una clasificación precisa
export function MovementsNote() {
  return (
    <div className="max-w-3xl space-y-3 text-fg">
      <h3 id={MOVEMENTS_ANCHOR} className={headingClass('title')}>
        OSR y NSR
      </h3>
      <p>
        El <strong>OSR</strong> (<i lang="en">Old School Renaissance</i>, «renacimiento de la vieja
        escuela») es el movimiento que, desde mediados de los años 2000, recupera la forma de jugar
        de las primeras ediciones de D&amp;D. Reúne retroclones que reescriben aquellas reglas
        gracias a las licencias abiertas, como Old-School Essentials o Aventuras en la Marca del
        Este, y juegos nuevos que parten de ellas. Personajes frágiles, mucha exploración y el
        ingenio de los jugadores por delante de las reglas, con aventuras que suelen servir para
        varios de estos juegos.
      </p>
      <p>
        El <strong>NSR</strong> (<i lang="en">New School Revolution</i>) agrupa juegos más recientes
        de la misma escena que conservan ese espíritu pero cambian las reglas a fondo, como Into the
        Odd, Cairn o Mörk Borg, a menudo con un diseño gráfico muy personal.
      </p>
      <p>
        <strong>Ninguno de los dos términos tiene una definición precisa.</strong> La propia
        comunidad discute dónde acaba uno y empieza el otro, y hay juegos que unos consideran OSR y
        otros no. Este catálogo usa un criterio sencillo, que es solo una orientación y no una
        clasificación oficial: un juego es OSR si deriva de una edición de D&amp;D, casi siempre de
        las primeras, y en general sigue siendo compatible con ella, directamente o a través de otro
        OSR; es NSR si solo se inspira en ellas o en un OSR. La ficha de cada juego y el árbol
        genealógico explican de dónde viene.
      </p>
    </div>
  )
}
