# Proposal

## Why

«Otros juegos de rol» deja fuera los juegos OSR «por ahora» (#95), aunque son
los descendientes más directos de las ediciones antiguas de D&D que el
catálogo ya tiene completas en `/ediciones` y en el árbol genealógico. Hay
mucho publicado en castellano (Aventuras en la Marca del Este, Old-School
Essentials, Mörk Borg…) que nadie reúne, y casi todo su catálogo en inglés se
vende en DriveThruRPG, cuyo programa de afiliados ya está integrado (#142).

## What Changes

- Los sistemas de la sección pueden llevar una **etiqueta de movimiento**:
  `osr` (Old School Renaissance: retroclones y juegos que reescriben las
  ediciones antiguas de D&D) o `nsr` (New School Revolution: juegos de la
  misma escena que solo se inspiran en ellas, como Mörk Borg o Into the
  Odd).
- **Alcance de los sistemas**: se quita la exclusión de los OSR. Entran los
  juegos OSR, que derivan de una edición de D&D con una derivación real
  (revisión, compatible o cambio mayor de reglas), y los NSR, que pueden
  colgar de D&D o de un OSR solo por inspiración. Los juegos de otras familias
  siguen fuera.
- **Alcance de los libros** de los sistemas OSR y NSR, a por todas:
  - todo lo publicado en castellano, de cualquier editorial;
  - toda la línea impresa propia de cada juego en inglés (la de la editorial
    del sistema): básicos, suplementos, aventuras, cajas y pantallas;
  - fuera: lo de otras editoriales que solo esté en inglés y lo que solo
    existe en PDF o como zine en plataformas comunitarias.
- **Licencias**: ficha de cada licencia que use un juego OSR o NSR, incluidas
  las licencias de compatibilidad propias de cada editorial (las de Old-School
  Essentials, Mörk Borg, Shadowdark, Dungeon Crawl Classics, Labyrinth Lord o
  Swords & Wizardry, según se confirme cada una) y la CC BY-SA 4.0.
- **Listado `/rol`**: filtro por movimiento (OSR, NSR), los sistemas OSR y NSR
  agrupados aparte y un texto propio que explica qué son ambos movimientos y
  que **la definición no es precisa**: las fronteras las discute la propia
  comunidad y la etiqueta del catálogo es una orientación, no una clasificación
  oficial.
- **Fichas de sistema**: muestran la etiqueta, enlazada a esa explicación.
- **Árbol genealógico**: los nuevos sistemas salen con sus derivaciones, sin
  tocar el código de trazado más allá de lo necesario para que siga legible.
- **Enlaces de compra** con las tiendas que ya existen: DriveThruRPG (PDF e
  impresión bajo demanda), Juegos de la Mesa Redonda y Casa del Libro para lo
  editado en castellano y Amazon para los impresos.
- Todo en un único cambio y una sola PR: estructura, libros en castellano y
  líneas completas en inglés (unos 500-700 libros).

Fuera de alcance: juegos de rol de otras familias, material de terceros solo en
inglés, zines y PDF de autores sueltos, y tiendas nuevas.

## Capabilities

### New Capabilities

- `rpg-movements`: qué significan las etiquetas OSR y NSR, a qué sistemas se
  aplican, cómo se comprueba su derivación de D&D y el texto que explica que la
  frontera es difusa.

### Modified Capabilities

- `rpg-systems`: el alcance deja de excluir los OSR e incluye OSR y NSR; la
  ficha muestra el movimiento.
- `rpg-books`: regla de alcance propia para los sistemas OSR y NSR (todo en
  castellano y la línea propia completa en inglés, sin solo PDF).
- `rpg-listing`: filtro por movimiento, grupo propio de sistemas y texto
  explicativo en `/rol`.
- `open-licenses`: las licencias de compatibilidad de cada editorial entran
  como licencias comunitarias.

## Impact

- Datos: `data/rol/systems/`, `data/rol/books/<sistema>/`,
  `data/rol/licenses/`, portadas en `public/images/rol/` y
  `data/rol/inventory.md`.
- Esquema `data/schemas/rpg-system.jsonschema` (campo de movimiento) y tipos
  en `src/types/rpg.ts`.
- Lógica en `src/utils/rpg.ts`, `src/utils/rpgFilters.ts` y el índice
  `virtual:rpg-index` de `vite.config.ts`.
- Páginas `RpgSectionPage`, `RpgSystemPage` y `RpgTreePage`, con sus tests.
- Tests de datos en `src/services/rpgLoader.test.ts`.
- `scripts/affiliate-coverage.mjs` y `data/affiliate-exceptions.json`.
- Skill `add-rpg`, CLAUDE.md y README.
