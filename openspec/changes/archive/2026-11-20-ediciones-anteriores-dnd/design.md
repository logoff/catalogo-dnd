# Design

## Context

Los sistemas y libros de «Otros juegos de rol» se leen de `data/rol/` y
llegan a las páginas por `virtual:rpg-index` (índice ligero con licencias,
sistemas y resumen de libros) y un trozo por libro (`rpgLoader.ts`). Las
URLs `/rol/${…}` están escritas a mano en siete sitios: `RpgSectionPage`,
`RpgSystemPage`, `RpgBookPage`, `RpgBookCard`, `RpgSection`,
`LicenseDetailPage`, `generate-sitemap.mjs` y `feed.mjs`.

El aviso de «no oficial» se oculta cuando el sistema tiene
`official_catalog`, que solo admite `/2014` y `/2024`. Por eso
`/rol/dnd-3-5`, publicada como ficha mínima, dice que no es oficial. Pathfinder
1E deriva de `dnd-3-5` y el SRD 3.5 la lista entre sus sistemas.

La cabecera ya tiene un grupo «Libros» (Catálogo completo, 5E, 5.5E) y la ficha de
libro ya oculta botones y aviso de afiliado si no hay enlaces (`forSale`).

## Goals / Non-Goals

**Goals:**

- Una sección propia para las ediciones anteriores sin duplicar el modelo de
  datos, el cargador ni los componentes de ficha.
- Que la URL de cada sistema y libro se calcule en un solo sitio, para que
  mover una edición de sección no deje enlaces rotos.
- Cargar unos 130 libros por tandas, con `just check` en verde tras cada una.

**Non-Goals:**

- Enlaces de compra, también de segunda mano. Se valorarán más adelante.
- Tarjeta en la portada del sitio: se añadirá cuando la sección tenga más
  de una tanda publicada.
- Cambiar el aspecto de las fichas.

## Decisions

### Mismo modelo y mismos datos, otra sección

Las ediciones siguen siendo fichas de `rpg-system.jsonschema` en
`data/rol/systems/` y sus libros, de `rpg-book.jsonschema` en
`data/rol/books/<edición>/`. El esquema de sistema gana `official: boolean`.
Una edición es de la sección nueva si es `official` y no tiene
`official_catalog`. Se marcan `official` las cuatro ediciones de D&D: las dos
de 5E, con catálogo, se quedan en `/rol`.

Así siguen funcionando sin cambios las derivaciones (Pathfinder 1E → D&D
3.5), los ciclos, las licencias y la caché de `rpgLoader.ts`.

_Alternativa descartada:_ un directorio `data/ediciones/` con esquemas y
cargador propios. Separa más los datos, pero duplica cargador, plugin,
tests y sitemap, y rompe las referencias cruzadas con los sistemas de rol.

### Un solo cálculo de URL

`src/utils/rpg.ts` gana `isDndEdition(system)`, `systemPath(system)` y
`bookPath(book, systems)` (`/ediciones/…` o `/rol/…`). Todos los enlaces de
las páginas, de las tarjetas y de la ficha de licencia pasan a usarlos.
`generate-sitemap.mjs` y `feed.mjs` son `.mjs` y leen los JSON directamente,
así que repiten la misma condición sobre el JSON del sistema, con un test en
`scripts/feed.test.mjs`.

### Páginas

- `DndEditionsPage` (`/ediciones`; ya existe un `EditionPage` para `/2014`
  y `/2024`): las ediciones oficiales por fecha. Las de la sección van con su
  número de libros y enlace a la ficha; las de 5E, con enlace al catálogo
  oficial.
- Las fichas de edición y de libro son `RpgSystemPage` y `RpgBookPage` con
  `section="ediciones"`, en vez de páginas nuevas con bloques extraídos: la
  sección cambia las migas («Ediciones anteriores de D&D»), quita
  `UnofficialNotice` (que ahora depende de `official`) y ajusta textos
  («Edición», «Derivan de ella», «Descatalogado.»). Cada página devuelve no
  encontrado para lo que no sea de su sección, salvo `/rol/:edicion`, que
  redirige.
- Libros de la ficha de una edición agrupados por `kind` (`BooksByKind`),
  cada grupo del más antiguo al más reciente, porque 3.5 tendrá más de cien.
- `/rol` (listado, filtros), `virtual:rpg-stats` y la ficha de licencia
  excluyen las ediciones y sus libros; la licencia sigue mostrando la edición
  en su lista de sistemas.

### Redirección

`public/_redirects` nuevo, que Cloudflare Pages aplica antes de servir
archivos: `/rol/dnd-3-5 /ediciones/dnd-3-5 301`. Como no se prerenderiza
ningún HTML en `/rol/dnd-3-5`, la regla no choca con un archivo. En la
navegación del cliente no hay enlaces a esa URL. Si se escribe a mano, la
ruta de `RpgSystemPage` redirige con `<Navigate replace>` cuando el sistema
es una edición.

### Tests

En `rpgLoader.test.ts`:

- `official` solo en la familia de D&D.
- `official_catalog` exige `official`.
- Ningún libro de Wizards of the Coast en un sistema con `official_catalog`.
- Ningún libro de una edición con `purchase_links`.
- El test de alcance de libros solo en inglés no se aplica a las ediciones.

El test de inventario reconoce la lista nueva.

Tests de componentes de la página nueva, de las fichas en `/ediciones` y de los cambios de `/rol` y
de la licencia.

### Slugs, tipos y licencia

- Sistema nuevo `dnd-3e` («D&D 3.ª edición», fecha por confirmar con
  fuente). `dnd-3-5` gana `derived_from: [{ system: "dnd-3e", kind:
"revision", note }]`.
- Los tres básicos llevan sufijo de edición y `core: true`:
  `players-handbook-3e`, `players-handbook-3-5`. El resto, slug del título en
  inglés sin sufijo, salvo colisión.
- Tipos: `setting` para Reinos Olvidados, Eberron y Greyhawk; `adventure`
  para los módulos; `starter` para las cajas de inicio; `supplement` para el resto. Pantallas y hojas de personaje no entran.
- `srd-3-0`: `reference_document` de Wizards (2000), bajo `ogl-1-0a`. Si se
  confirma que la primera versión salió bajo la OGL 1.0, se cuenta en la
  descripción.

### Inventario y fuentes

El inventario va en `data/rol/inventory.md`, en dos listas nuevas: ediciones
anteriores de D&D y sus libros.

- **Lista de libros:** la de Wikipedia en inglés de libros de 3.ª edición y
  3.5, contrastada con las páginas de wizards.com archivadas en archive.org.
- **Ediciones en inglés:** páginas archivadas de wizards.com (fecha, ISBN,
  portada) o, si no hay copia, Open Library.
- **Ediciones en castellano:** catálogo de Devir archivado o, si no está,
  tiendas y distribuidoras solo como fuente de título, fecha e ISBN.

### Afiliados

`scripts/affiliate-coverage.mjs` omite los libros de las ediciones. No se
añaden excepciones.

### Publicación por tandas

1. **Primera PR:** sección, código, tests, redirección, `srd-3-0`, `dnd-3e` y
   `dnd-3-5` con sus tres básicos cada uno, e inventario completo de 3.5 con
   el resto en `pendiente`.
2. **PR siguientes:** tandas de 20 a 30 libros por línea.

## Risks / Trade-offs

- [Los datos de una sección viven en `data/rol/`] → Se acepta a cambio de no
  duplicar el modelo. `CLAUDE.md` y la skill `add-rpg` lo explican. Si en el
  futuro estorba, se pueden mover los archivos cambiando solo los globs.
- [Muchas páginas de wizards.com no están en archive.org] → Open Library o
  una tienda como fuente, citada en `source`. Si no se confirma un dato, se
  omite el campo.
- [Ediciones de Devir poco documentadas] → Solo consta una edición en
  castellano con fuente que la confirme. Las dudosas quedan «por confirmar»
  en el inventario.
- [`virtual:rpg-index` crece con unos 130 resúmenes que `/rol` no usa] → Es
  un trozo aparte y no entra en el bundle principal. Se mide su tamaño en la
  primera tanda grande y, si pesa, se separa en un índice propio.
- [Un `_redirects` mal escrito puede romper rutas] → Una sola regla
  concreta. Se comprueba tras el despliegue con
  `curl -I https://catalogodnd.es/rol/dnd-3-5`.

## Open Questions

- Fecha exacta de salida de la 3.ª edición (agosto de 2000) y si el SRD 3.0
  salió primero bajo la OGL 1.0. Se confirma con fuente al escribir las
  fichas.
