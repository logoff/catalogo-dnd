import { Link } from 'react-router-dom'
import GuideLayout, { ProductLink } from './GuideLayout'

export default function StartGuide() {
  return (
    <GuideLayout
      title="Por dónde empezar"
      description="Qué comprar para empezar a jugar a Dungeons & Dragons según si vas a jugar o a dirigir, y qué hay disponible en castellano."
    >
      <p>
        Dungeons & Dragons tiene muchos libros, pero para empezar hacen falta muy pocos. Lo que
        conviene comprar depende de dos cosas: si nunca has jugado a rol o ya tienes algo de
        experiencia, y si vas a ser jugador o Dungeon Master (la persona que dirige la partida).
        Esta guía se centra en material disponible en castellano.
      </p>

      <h2>Si nunca has jugado: una caja de inicio</h2>
      <p>
        Las cajas de inicio traen todo lo necesario para la primera partida: reglas resumidas,
        personajes, dados y una aventura pensada para aprender. Son la forma más barata y sencilla
        de probar el juego con un grupo de amigos.
      </p>
      <ul>
        <li>
          <strong>
            <ProductLink edition="2024" code="HotB">
              Caja de Inicio: Héroes de las Tierras Fronterizas
            </ProductLink>
          </strong>
          : la caja actual, con las reglas de 2024. Usa tableros, cartas y mapas de póster, lo que
          la hace muy visual y fácil de seguir en la mesa. Para 3 a 5 jugadores.
        </li>
        <li>
          <strong>
            <ProductLink edition="2014" code="DOSI">
              Caja de Inicio: Los Dragones de la Isla de las Tempestades
            </ProductLink>
          </strong>
          : más sencilla y corta, con las reglas de 2014. Una aventura para los niveles 1 a 3 y
          cinco personajes ya hechos.
        </li>
        <li>
          <strong>
            <ProductLink edition="2014" code="DIP">
              Kit Esencial
            </ProductLink>
          </strong>
          : con las reglas de 2014, pero más completo que una caja de inicio. Permite crear
          personajes desde cero, incluye pantalla del Dungeon Master y reglas para jugar con un solo
          jugador.
        </li>
      </ul>
      <p>
        Si en casa hay fans de la serie, las cajas de Stranger Things (
        <ProductLink edition="2014" code="HFTT">
          la caja de inicio de 2019
        </ProductLink>
        , en castellano, y{' '}
        <ProductLink edition="2024" code="WttHC">
          Welcome to the Hellfire Club
        </ProductLink>
        , en inglés) son una entrada muy amable.
      </p>

      <h2>Si vas a jugar: el Manual del Jugador</h2>
      <p>
        Un jugador solo necesita el{' '}
        <ProductLink edition="2024" code="PHB">
          Manual del Jugador
        </ProductLink>
        . Ahí están la creación de personajes, las clases, los conjuros y las reglas que se usan en
        cada partida. No hace falta que cada jugador tenga el suyo: en muchos grupos se comparte un
        ejemplar en la mesa.
      </p>

      <h2>Si vas a dirigir: los básicos y una aventura</h2>
      <p>
        Además del Manual del Jugador, el Dungeon Master suele usar la{' '}
        <ProductLink edition="2024" code="DMG">
          Guía del Dungeon Master
        </ProductLink>{' '}
        y el{' '}
        <ProductLink edition="2024" code="MM">
          Manual de Monstruos
        </ProductLink>
        . Ninguno de los dos es imprescindible para la primera campaña: con el Manual del Jugador y
        una aventura publicada, que ya incluye los monstruos que necesita, se puede empezar.
      </p>
      <p>Algunas aventuras en castellano que funcionan bien como primera campaña:</p>
      <ul>
        <li>
          <strong>
            <ProductLink edition="2014" code="PABTSO">
              Phandelver y más allá: El Obelisco despedazado
            </ProductLink>
          </strong>
          : incluye La Mina Perdida de Phandelver, la aventura introductoria más jugada de la
          edición, y la continúa hasta nivel 12.
        </li>
        <li>
          <strong>
            <ProductLink edition="2014" code="WDH">
              Waterdeep: El Golpe de los Dragones
            </ProductLink>
          </strong>
          : intriga urbana para niveles bajos, ideal si al grupo le atrae más hablar e investigar
          que explorar mazmorras.
        </li>
        <li>
          <strong>
            <ProductLink edition="2014" code="WBTW">
              Las tierras más allá de Brujaluz
            </ProductLink>
          </strong>
          : una aventura de hadas que se puede completar sin combatir, muy adecuada para grupos
          jóvenes.
        </li>
        <li>
          <strong>
            <ProductLink edition="2014" code="KFTGV">
              Las Llaves de la Cámara de Oro
            </ProductLink>
          </strong>
          : trece golpes independientes, perfectos si el grupo no puede comprometerse con una
          campaña larga.
        </li>
        <li>
          <strong>
            <ProductLink edition="2014" code="COS">
              La Maldición de Strahd
            </ProductLink>
          </strong>
          : la campaña de terror gótico más valorada de la edición. Mejor como segunda campaña,
          cuando el Dungeon Master ya tiene algo de rodaje.
        </li>
      </ul>
      <p>
        Estas aventuras se escribieron para las reglas de 2014, pero se pueden jugar sin problemas
        con las de 2024.
      </p>

      <h2>¿Reglas de 2014 o de 2024?</h2>
      <p>
        Si empiezas ahora, lo más sencillo es ir directamente a las reglas de 2024: son las que se
        siguen publicando y los tres libros básicos ya están en castellano. Si alguien del grupo ya
        tiene los libros de 2014, también puedes jugar con ellos sin problema. Las diferencias están
        explicadas en la guía <Link to="/guias/2014-vs-2024">2014 frente a 2024</Link>.
      </p>

      <h2>¿Inglés o castellano?</h2>
      <p>
        Los libros básicos, las cajas de inicio y muchas aventuras están en castellano, pero buena
        parte de los suplementos y ambientaciones solo existen en inglés. Puedes consultar qué se ha
        traducido y cuándo en la{' '}
        <Link to="/guias/cronologia-castellano">cronología de D&D en castellano</Link>.
      </p>
    </GuideLayout>
  )
}
