import GuideLayout, { ProductLink } from './GuideLayout'

const equivalences: Array<{ code2014: string; code2024: string; note: string }> = [
  { code2014: 'PHB', code2024: 'PHB', note: 'Revisión completa de clases, especies y conjuros.' },
  { code2014: 'DMG', code2024: 'DMG', note: 'Más centrada en enseñar a dirigir; añade bastiones.' },
  {
    code2014: 'MM',
    code2024: 'MM',
    note: 'Perfiles revisados, hábitats y tesoros.',
  },
  { code2014: 'DOSI', code2024: 'HotB', note: 'La caja de inicio pasa a usar tableros y cartas.' },
  { code2014: 'VRGR', code2024: 'RtHW', note: 'Los Dominios del Terror, adaptados a 2024.' },
  { code2014: 'ERLW', code2024: 'EFotA', note: 'Eberron y el artífice, adaptados a 2024.' },
  { code2014: 'SCAG', code2024: 'FRHoF', note: 'Los Reinos Olvidados, ahora en dos libros.' },
]

export default function EditionsGuide() {
  return (
    <GuideLayout
      title="2014 frente a 2024"
      description="Qué cambia entre la quinta edición de 2014 y la revisión de 2024 (5.5E), si son compatibles y qué libros sustituyen a cuáles."
    >
      <p>
        En 2024 Wizards of the Coast publicó una revisión de las reglas de la quinta edición, a
        menudo llamada <strong>5.5E</strong> o <strong>D&D 2024</strong>. No es una edición nueva:
        la base del juego es la misma y el material de 2014 sigue siendo compatible. Lo que cambia
        es cómo se crean los personajes, el equilibrio de las clases y muchos detalles de reglas.
      </p>

      <h2>Lo que cambia</h2>
      <h3>Creación de personajes</h3>
      <ul>
        <li>
          Los <strong>aumentos de característica</strong> ya no dependen de la especie, sino del
          trasfondo. Cada trasfondo da además una <strong>dote de origen</strong> a nivel 1.
        </li>
        <li>
          Se habla de <strong>especies</strong> en lugar de razas. El Manual del Jugador de 2024
          trae diez: aasimar, dracónido, enano, elfo, gnomo, goliat, mediano, humano, orco y
          tiefling. El semielfo y el semiorco desaparecen como opciones separadas.
        </li>
        <li>
          Todas las clases eligen <strong>subclase a nivel 3</strong>. Hay cuatro subclases por
          clase en el Manual del Jugador, muchas recuperadas de suplementos de 2014.
        </li>
      </ul>
      <h3>Reglas de juego</h3>
      <ul>
        <li>
          La <strong>maestría con armas</strong> da a cada arma un efecto especial que pueden usar
          las clases marciales, lo que hace el combate con armas más variado.
        </li>
        <li>
          Muchos <strong>conjuros</strong> se han revisado, y algunos de los más potentes son ahora
          más contenidos.
        </li>
        <li>
          El <strong>cansancio</strong> se simplifica: cada nivel resta 2 a las pruebas con d20 y
          reduce la velocidad.
        </li>
        <li>
          La <strong>inspiración heroica</strong> sustituye a la inspiración de 2014 y algunas
          especies y dotes la conceden de forma regular.
        </li>
      </ul>
      <h3>Para el Dungeon Master</h3>
      <ul>
        <li>
          La Guía del Dungeon Master explica mejor cómo preparar y dirigir sesiones, e incluye{' '}
          <strong>bastiones</strong>, fortalezas que los personajes pueden construir y gestionar.
        </li>
        <li>
          El Manual de Monstruos trae <strong>perfiles</strong> de criaturas más fáciles de usar,
          con información de hábitat y tesoro.
        </li>
      </ul>

      <h2>¿Son compatibles?</h2>
      <p>
        Sí. Las aventuras y suplementos de 2014 se pueden usar con las reglas de 2024 con pocos o
        ningún ajuste. Lo habitual es usar los personajes del Manual del Jugador de 2024 y, cuando
        una aventura de 2014 nombra un monstruo, tomar la versión del Manual de Monstruos de 2025 si
        la tienes, o la original si no. Mezclar subclases de 2014 en personajes de 2024 también
        suele funcionar, aunque conviene que el Dungeon Master lo revise.
      </p>

      <h2>Equivalencias entre libros</h2>
      <p>Estos son los libros de 2024 que ocupan el lugar de uno de 2014:</p>
      <ul>
        {equivalences.map(({ code2014, code2024, note }) => (
          <li key={code2024}>
            <ProductLink edition="2014" code={code2014} /> (2014) →{' '}
            <ProductLink edition="2024" code={code2024} /> (2024). {note}
          </li>
        ))}
      </ul>
      <p>
        La Guía del Xanathar para Todo y El Caldero de Tasha para Todo no tienen un sustituto
        directo: parte de sus subclases y conjuros se incorporaron al Manual del Jugador de 2024, y
        el resto sigue siendo utilizable tal cual.
      </p>

      <h2>¿Merece la pena actualizarse?</h2>
      <p>
        Si ya juegas con los libros de 2014 y tu grupo está contento, no es imprescindible: el juego
        sigue funcionando igual de bien. Las reglas de 2024 compensan si vas a empezar de cero, si
        quieres las clases más equilibradas o si piensas usar el material nuevo, que ya se publica
        solo para 2024. En castellano, los tres libros básicos de 2024 están disponibles desde 2025.
      </p>
    </GuideLayout>
  )
}
