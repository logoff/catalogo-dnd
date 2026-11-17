# Proposal

## Why

Desde 1978 se han publicado unas 700 novelas oficiales de D&D (Dragonlance,
Reinos Olvidados, Eberron, Ravenloft…) y muchas se tradujeron al
castellano en varias ediciones (Timun Mas, Minotauro, Devir…). No hay
ningún sitio en castellano que reúna qué existe en inglés, qué se tradujo,
con qué título y en qué orden se leen las series, y buena parte sigue a la
venta en Amazon, así que la sección suma visitas e ingresos por afiliados
sin depender del calendario de libros de reglas.

## What Changes

- Sección nueva «Novelas» con todas las novelas oficiales de D&D en
  inglés, tomando como punto de partida la [lista de ficción de D&D de
  Wikipedia](https://en.wikipedia.org/wiki/List_of_Dungeons_%26_Dragons_fiction):
  - Entran novelas, novelas juveniles e infantiles, novelas publicadas
    solo en ebook o solo en la web, novelas cortas y relatos publicados
    como libro o ebook independiente y las guías narrativas de
    Dragonlance (_Bertrem's Guide_), decididas una a una con el usuario.
  - Quedan fuera relatos y novelas cortas que solo salieron dentro de
    antologías o revistas, antologías, librojuegos (_Endless Quest_),
    poemas, ensayos, cómics y novelas gráficas.
- Una ficha por novela con su mundo de campaña, su serie y su número en
  ella, autores, fecha, descripción propia, portada y **todas** sus
  ediciones, en inglés y en castellano con la misma profundidad: cada
  edición con ISBN propio (tapa dura, rústica, bolsillo, ebook,
  reediciones con portada nueva, ediciones británicas) con su editorial,
  año, formato, ISBN, portada si se encuentra y enlaces de compra con
  afiliado cuando sigue a la venta. No cuentan como edición las
  reimpresiones sin ISBN nuevo ni los audiolibros.
- Listado en `/novelas` con búsqueda (por título en inglés o en
  castellano y por autor), filtros por mundo, serie, castellano y a la
  venta, y orden por fecha, título u orden de lectura. Ficha en
  `/novela/<slug>` con la lista ordenada de su serie. Las dos páginas se
  prerenderizan y entran en el sitemap.
- Enlaces entre novelas y libros, videojuegos o merchandising
  relacionados (por ejemplo, _Baldur's Gate_ o _Dragonlance: Shadow of the
  Dragon Queen_).
- Inventario maestro de novelas con su fuente, y skill `add-novel` para
  darlas de alta por lotes.
- Enlace en la cabecera y en la portada, y mención en la página legal.

Fuera de alcance: los formatos excluidos arriba (podrán tener su propia
sección más adelante), audiolibros, novelas de otros juegos de TSR o
Wizards que no son de D&D, ficción de fans y el buscador de la cabecera,
que sigue buscando solo libros de reglas.

## Capabilities

### New Capabilities

- `novel-records`: qué novelas entran en la sección y qué datos
  verificables se guardan de cada una, de su serie y de sus ediciones en
  inglés y en castellano.
- `novel-listing`: el listado de la sección, con búsqueda, filtros, orden
  y su lugar en la navegación del sitio.
- `novel-detail-page`: la ficha pública de cada novela, con sus
  ediciones, enlaces de compra y la serie a la que pertenece.

### Modified Capabilities

Ninguna: `merchandise-records` ya deja fuera las novelas y el resto de
specs no cambian; la cabecera y la portada solo ganan un enlace.

## Impact

- **Datos:** carpeta nueva `data/novels/` con un JSON por novela, un
  archivo de series, esquema `data/schemas/novel.jsonschema`, inventario
  `data/novels/inventory.md` y portadas en `public/images/novels/`
  (unas 3.000 imágenes entre ediciones inglesas y castellanas: se
  guardan en WebP).
- **Código:** tipos, loader, store, páginas y componentes nuevos;
  `AppRoutes.tsx`, `Header.tsx`, `HomePage.tsx`, `LegalPage.tsx` y
  `main.tsx` (los datos de novelas van en un trozo aparte del bundle). Se
  reutilizan `stores.ts`, `ImageLightbox` y `PurchaseButton`.
- **Build:** `scripts/generate-sitemap.mjs` y `scripts/prerender.mjs`
  (unas 700 páginas más).
- **Afiliados:** puede interesar solicitar tiendas de libros (Casa del
  Libro, IberLibro para segunda mano); se decide durante el cambio.
- **Herramientas:** skill nueva `add-novel`, `CLAUDE.md` y README.
