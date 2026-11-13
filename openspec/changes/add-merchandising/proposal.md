# Proposal

## Why

Alrededor de D&D hay muchos productos oficiales con licencia de Wizards
of the Coast que no son de reglas: libros de cocina o de crochet,
figuras, LEGO, peluches y juegos de mesa. Son regalos habituales para
quien juega, nadie los reúne en castellano y casi todos se venden en
Amazon y en tiendas de juegos con programa de afiliados (Juegos de la
Mesa Redonda, Generación X), así que suman visitas e ingresos sin
depender del calendario de libros.

## What Changes

- Sección nueva «Merchandising» con productos oficiales con licencia de
  D&D, en tres grupos:
  - **Libros licenciados** que no son de reglas: cocina, manualidades
    (crochet, bordado), arte y guías ilustradas.
  - **Figuras y juguetes:** Funko, LEGO, figuras de acción, peluches y
    miniaturas pintadas de coleccionista.
  - **Juegos de mesa y cartas** que no son de rol: _Dungeon Mayhem_,
    _Betrayal at Baldur's Gate_ y similares.
- Listado en `/merchandising` con filtros por grupo y tipo, búsqueda y
  orden; ficha en `/merchandising/:slug` con descripción propia, datos
  del fabricante, ediciones en inglés y en castellano, imágenes y
  enlaces de compra con afiliado. Las dos páginas se prerenderizan y
  entran en el sitemap.
- Enlaces entre artículos y libros o videojuegos del catálogo (por
  ejemplo, las figuras de _Baldur's Gate 3_).
- Inventario maestro de artículos, con su fuente, y skill para dar de
  alta artículos.
- Enlace en la cabecera y en la portada, y mención en la página legal.

Fuera de alcance: novelas y cómics (tendrán su propia sección), dados,
ropa y complementos, productos sin licencia oficial o de fans,
productos anteriores a 2014, y el buscador de la cabecera, que sigue
buscando solo libros.

## Capabilities

### New Capabilities

- `merchandise-records`: qué productos licenciados entran en la sección
  y qué datos verificables se guardan de cada uno.
- `merchandise-listing`: el listado de la sección, con filtros,
  búsqueda, orden y su lugar en la navegación del sitio.
- `merchandise-detail-page`: la ficha pública de cada artículo.

### Modified Capabilities

Ninguna: las specs principales (`videogame-videos` y
`videogame-screenshots`) no cambian, y el catálogo de libros y el de
videojuegos solo ganan un enlace en la navegación.

## Impact

- **Datos:** carpeta nueva `data/merchandising/` con un JSON por
  artículo, esquema `data/schemas/merchandise.jsonschema`, inventario
  `data/merchandising/inventory.md` e imágenes en
  `public/images/merchandising/`.
- **Código:** tipos, servicio de carga, store de Zustand, páginas y
  componentes nuevos; `AppRoutes.tsx`, `Header.tsx`, `HomePage.tsx` y
  `LegalPage.tsx`. Se reutilizan `stores.ts` (tiendas y afiliados),
  `ImageLightbox` y `PurchaseButton`.
- **Build:** `scripts/generate-sitemap.mjs` y las vistas previas de
  `scripts/prerender.mjs`.
- **Herramientas:** skill nueva `add-merchandise`, `CLAUDE.md` y README.
