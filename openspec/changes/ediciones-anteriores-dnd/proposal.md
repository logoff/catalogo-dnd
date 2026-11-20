# Proposal

## Why

«Qué edición de D&D…» es una búsqueda habitual, y el catálogo solo cubre la
5E. La sección de otros juegos de rol tiene una ficha mínima de D&D 3.5, como
origen de Pathfinder, pero dice que no es oficial y no tiene libros ni
contexto. Las ediciones anteriores son D&D oficial y no encajan en «Otros
juegos de rol». La 3.ª edición y la 3.5 son además las que explican las
licencias abiertas (SRD 3.0 y 3.5 bajo la OGL) y las últimas que Devir
tradujo en bloque. Es la primera tanda de #100. Cuando se haga #99, serán
nodos de su árbol.

## What Changes

- **Sección nueva «Ediciones anteriores de D&D»** en `/ediciones`, enlazada
  desde el grupo «Libros» de la cabecera:
  - un listado de todas las ediciones en orden cronológico; la 5E y la
    revisión de 2024 enlazan al catálogo oficial;
  - una ficha por edición (`/ediciones/:edicion`), con su descripción,
    características, licencias, derivaciones y libros;
  - una ficha por libro (`/ediciones/:edicion/:libro`), con sus ediciones en
    inglés y en castellano y sin tiendas, porque están descatalogados.
- **Ficha nueva de D&D 3.ª edición (2000)** con sus tres libros básicos
  (Manual del Jugador, Guía del Dungeon Master y Manual de Monstruos) en
  inglés y en castellano (Devir).
- **Licencia nueva SRD 3.0**: el documento de referencia de la 3.ª edición,
  publicado bajo la OGL.
- **D&D 3.5 pasa a la sección nueva**, deriva de la 3.ª edición como
  revisión y lleva todo el catálogo de libros de Wizards of the Coast para
  3.5 en inglés, con su edición de Devir cuando salió. `/rol/dnd-3-5`
  redirige a `/ediciones/dnd-3-5`.
- **«Otros juegos de rol» deja de listar estas ediciones.** Sus fichas siguen
  enlazándolas como origen de una derivación (Pathfinder 1E deriva de D&D
  3.5) o como sistema que usa una licencia (SRD 3.5), ahora apuntando a
  `/ediciones`.
- La 5E (2014 y 2024) sigue igual en «Otros juegos de rol»: enlaza al
  catálogo oficial y agrupa los libros de terceros para 5E.

Fuera de esta tanda: OD&D, Basic, AD&D 1.ª y 2.ª y 4.ª edición; el resto de
libros de 3.ª edición (suplementos y lo que tradujo Devir de 3.0); productos
que no son libros (miniaturas, Dungeon Tiles, cartas, revistas); el material
con licencia de otras editoriales (Dragonlance de Sovereign Press); los
enlaces de compra, incluidos los de segunda mano; una tarjeta en la portada
y el árbol genealógico (#99).

## Capabilities

### New Capabilities

- `dnd-editions`: la sección de ediciones anteriores de D&D, con su listado
  cronológico, las fichas de edición y de libro, su alcance (los libros
  oficiales de Wizards de cada edición, en inglés y en castellano), sin
  tiendas, su navegación, sus redirecciones y su prerenderizado.

### Modified Capabilities

- `rpg-systems`: las ediciones de D&D sin catálogo oficial en el sitio
  quedan fuera de la sección, aunque se pueden seguir citando en
  derivaciones y licencias, y sus enlaces van a `/ediciones`.
- `rpg-books`: los libros de Wizards de esas ediciones no son de la sección
  de otros juegos de rol.
- `rpg-listing`: `/rol` no lista esas ediciones ni sus libros.
- `open-licenses`: la ficha de una licencia enlaza los sistemas que la usan
  en la sección que les corresponde.

## Impact

- **Esquemas:** `rpg-system.jsonschema` gana `official` para las ediciones
  oficiales de D&D. `rpg-book.jsonschema` no cambia.
- **Datos:** `data/rol/licenses/srd-3-0.json`, `data/rol/systems/dnd-3e.json`,
  `dnd-3-5.json` revisado y unos 130 libros en `data/rol/books/dnd-3e/` y
  `data/rol/books/dnd-3-5/`, con sus portadas en `public/images/rol/`.
  Inventario en una sección propia de `data/rol/inventory.md`.
- **Código:** páginas nuevas de la sección y rutas en el router, en
  `entry-server.tsx` y en el sitemap; un único lugar que calcula la URL de
  un sistema y de un libro, usado por el listado de `/rol`, las fichas, las
  licencias, el feed y el sitemap; filtros de `/rol`, `virtual:rpg-index`
  y `virtual:rpg-stats` sin estas ediciones; enlace en `Header.tsx`;
  `public/_redirects` nuevo.
- **Afiliados:** `just affiliate-coverage` no revisa estos libros.
- **Build:** unas 130 páginas prerenderizadas más.
