# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code)
para trabajar con el código de este repositorio.

## Resumen del proyecto

Catálogo en castellano de libros y accesorios de Dungeons & Dragons
para las ediciones 5E (2014) y 5.5E (2024), de todos los videojuegos
oficiales de D&D, del merchandising con licencia, de las novelas
y los cómics oficiales y de otros juegos de rol de la familia de D&D con sus licencias
abiertas (sección separada de lo oficial). Se despliega en Cloudflare Pages en
<https://catalogodnd.es/>.

## Comandos

Se usa `just` como task runner. Ejecutar `just` para ver todas las
recetas disponibles.

- `just dev` — Servidor de desarrollo en <http://localhost:5173/>
- `just build` — Build de producción (incluye comprobación TypeScript,
  generación de sitemap y prerenderizado de cada página)
- `just test` — Ejecutar tests (vitest)
- `just test-watch` — Tests en modo watch
- `just lint` — ESLint
- `just lint-fix` — ESLint con auto-fix
- `just format` — Formatear con Prettier
- `just format-check` — Comprobar formato con Prettier
- `just check` — Todas las verificaciones (lint + format + typecheck
  y test)
- `just novedades` — Lista las novedades de 2024 a vigilar (sin fecha,
  fechas futuras, sin edición en castellano). La skill `novedades` parte
  de aquí para buscar información nueva
- `just video-thumbnails` — Descarga las miniaturas que falten de los
  vídeos de los videojuegos
- `just affiliate-coverage` — Lista las fichas sin enlace a las tiendas
  de afiliados aceptadas (excepciones en `data/affiliate-exceptions.json`)
- `just check-videos` — Avisa de vídeos retirados, no empotrables o de
  otro canal (en Actions, sin bloquear)
- `just check-scores` — Avisa de notas de Metacritic u OpenCritic de los
  videojuegos que han cambiado o cuya página ya no existe (en Actions, sin
  bloquear)
- `just check-reviews` — Avisa de reseñas de libros y novelas con el
  enlace roto (en Actions, sin bloquear)
- `just reviews-coverage` — Lista los libros publicados sin reseñas
- `just novel-covers <slug> <isbn>=<url>…` — Descarga las portadas de las
  ediciones de una novela, las convierte a WebP con miniatura y las anota
  en su ficha (`--openlibrary` para las que falten, `--series <id>` para
  los recopilatorios)
- `just comic-covers <slug> <clave>=<url>… --source <página>` — Descarga
  portadas de un cómic (números, tomos por ISBN o `tomo-<n>`, grapas en
  castellano con `castellano-<n>`), las convierte a WebP con miniatura y
  las anota en su ficha (`--collection <id>` para los tomos de varias series)
- `just screenshots <slug> --steam` — Descarga capturas oficiales de un
  videojuego, las convierte a WebP y las anota en su ficha (`--source
<página> <url>…` para GOG, webs oficiales o kits de prensa)

Ejecutar un test individual:
`npx vitest run src/utils/imageResolver.test.ts`

## Arquitectura

**Diseño:** sistema propio sobre Tailwind 4. Los colores son tokens
semánticos (`bg`, `surface`, `well`, `fg`, `muted`, `line`, `accent`,
`accent-solid`, `on-accent`, `accent-soft`, `focus`) definidos para el
tema claro y el oscuro en `src/styles/globals.css`; los componentes no usan
otros colores ni la variante `dark:` para ellos, y `contrast.test.ts` exige
AA. El rojo es el único acento: acción principal (comprar), castellano,
elemento activo y foco. Fuentes Geist y Geist Mono (cifras, fechas, ISBN).
Los títulos usan la escala de `headingClass` (`styles.ts`): sección, título de
bloque, grupo de una lista (versalitas grises) y elemento; nada de tamaños
sueltos. En las listas de libros va primero el título original y, debajo, el de
castellano con `SpanishMark`. Los componentes base están en `src/components/ui/` (botón, tarjeta,
insignia, buscador, control segmentado, navegación por secciones, tablas,
cabecera de página). Sin animaciones de entrada ni degradados. El tema se
aplica antes de pintar con el script en línea de `index.html` (el mismo
criterio que `src/utils/theme.ts`) y el botón usa `useTheme`.

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Zustand
(estado) + React Router v6

**Capa de datos:** Los productos están en archivos JSON en
`data/{2014,2024}/products/`, organizados por directorios numerados
de categoría (ej. `01_books/01_core_rules/001_phb.json`). Cada JSON
sigue el esquema de `data/schemas/product.jsonschema`. Los archivos
se importan en tiempo de build mediante `import.meta.glob` de Vite.
El servicio `dataLoader.ts` enriquece los datos `Product` en objetos
`ProductWithMeta` con campos derivados (slug, idiomas, rango de fechas).

**Estructura de producto:** Cada producto tiene un `code` (ej. "PHB")
y un array de `publications` — múltiples ediciones/idiomas/portadas
del mismo producto. Tipos de publicación: `book`, `boxed_set`,
`accessory`. Ediciones: `5e` (2014) y `2024`.

**Reseñas:** los libros de 2014 y 2024 llevan en `reviews` reseñas de
medios de la lista cerrada `data/review-outlets.json` (esquema
`review-outlets.jsonschema`, con la escala de la nota de cada medio). Cada
una lleva un resumen propio en castellano (nunca texto copiado del medio)
y la nota tal cual la da el medio. No se calculan medias ni se emiten
como `Review`/`AggregateRating`. Los tests validan los productos contra
`product.jsonschema` y las reglas cruzadas de las reseñas, y exigen al
menos una a todo libro publicado hace más de 90 días. `MediaReviews.tsx` las pinta en
la ficha. Para darlas de alta, usar la skill `add-review`.

**Videojuegos:** cada juego es un JSON en
`data/videogames/games/<década>/<slug>.json` (esquema
`data/schemas/videogame.jsonschema`) con sus lanzamientos por plataforma
y edición, el castellano de cada uno (solo si está confirmado; sin dato
cuenta como solo en inglés), notas y enlaces de compra. Las notas son
solo de Metacritic y OpenCritic (cifra, escala y enlace a la página del
agregador); en Metacritic la primera de cada URL es la de la plataforma
principal, la que `just check-scores` compara con el JSON-LD.
`videogameLoader.ts` los enriquece en `VideogameWithMeta`.
Pueden llevar hasta tres vídeos oficiales de YouTube (`videos`), solo de
la editora, la desarrolladora, una plataforma o Wizards; su miniatura se
guarda en `public/images/videogames/<slug>/video-<id>.jpg` y el
reproductor de `youtube-nocookie.com` solo se carga al pulsar
(`YouTubeVideo.tsx`), para no contactar con YouTube antes.
También hasta seis capturas oficiales (`screenshots`, con su página de
origen) en WebP con miniatura `-thumb.webp`, en `ScreenshotGallery.tsx`.
`data/videogames/inventory.md` es la lista maestra: un test exige que
cada ficha esté en ella y al revés. Para dar de alta juegos, usar la
skill `add-videogame`.

**Merchandising:** productos con licencia oficial de D&D desde 2014 que
no son de reglas (libros licenciados, figuras y juguetes, juegos de mesa
y cartas, y dados y accesorios de dados). Los dados solo entran si se
pueden comprar en España, con enlace de compra. Cada artículo es un JSON en
`data/merchandising/items/<grupo>/<slug>.json` (esquema
`data/schemas/merchandise.jsonschema`) con sus ediciones por idioma; las
de castellano indican si salieron en España (`spain`).
`merchandiseLoader.ts` los enriquece en `MerchandiseWithMeta`.
`data/merchandising/inventory.md` es la lista maestra (un test exige que
cada ficha esté en ella y al revés). Para dar de alta artículos, usar la
skill `add-merchandise`.

**Novelas:** todas las novelas oficiales de D&D en inglés (desde 1978)
con todas sus ediciones en inglés y en castellano. Cada novela es un JSON
en `data/novels/<mundo>/<slug>.json` (esquema
`data/schemas/novel.jsonschema`); las series y sus recopilatorios
(volúmenes con varias novelas, que se guardan una sola vez) están en
`data/novels/series.json`. Las antologías de relatos no tienen ficha:
están en `data/novels/anthologies.json` (esquema
`novel-anthology.jsonschema`) y se muestran en las fichas de las novelas
de las series o novelas con las que se relacionan. Son cientos de fichas,
así que sus datos no van en el bundle principal: un plugin de `vite.config.ts` genera
`virtual:novels-index` (índice ligero del listado, en un trozo aparte) y
`virtual:novels-latest` (total y últimas, para la portada); cada ficha y
`series.json` son trozos aparte. Las páginas leen de la caché síncrona de
`novelLoader.ts` (`useNovelIndex`, `useNovel`); `entry-server.tsx` la
llena entera y `main.tsx` precarga lo de la ruta antes de hidratar.
`data/novels/inventory.md` es la lista maestra (un test exige que cada
ficha esté en ella y al revés). Para dar de alta novelas, usar la skill
`add-novel`.
Las novelas pueden llevar `reviews` (mismo esquema común
`review.jsonschema` y medios que los libros, pero sin cobertura
obligatoria y solo con URL pública) y `bestseller`: la primera semana en
la lista de superventas del NYT, con la lista (tapa dura o bolsillo) y su
fuente, normalmente el PDF semanal de hawes.com. Nunca valoraciones de
usuarios (Goodreads, Amazon…). La lista de medios está en
`src/services/reviewOutlets.ts` y el componente de reseñas, compartido con
los libros, es `src/components/common/MediaReviews.tsx`.
Las guías de orden de lectura (`/guias/orden-de-lectura-*`) y la de
novelas en castellano se generan desde el índice; el orden de cada una
está en `data/novels/reading-orders.json` (series enteras o novelas
sueltas).

**Cómics:** todos los cómics oficiales de D&D en inglés y todo lo publicado
en castellano (también las series solo españolas, con `language`), una
ficha por serie en `data/comics/<editorial>/<slug>.json` (esquema
`data/schemas/comic.jsonschema`) con sus números (`issues`) y sus ediciones:
tomos con `contents` (qué números recogen) y grapas en castellano
(`format: "issue"` con sus propios números). Los tomos de varias series van
una vez en `data/comics/collections.json`. Como novelas, un plugin de
`vite.config.ts` genera `virtual:comics-index` (listado, en un trozo aparte),
`virtual:comics-stats` (portada) y `virtual:comics-related` (los cómics que
enlazan a cada novela, videojuego, artículo o libro, para sus fichas); cada
serie es un trozo aparte y las páginas leen de la caché de `comicLoader.ts`.
`data/comics/inventory.md` es la lista maestra. Las series sin ninguna
portada están en `PENDING_COVERS` de `comicLoader.test.ts`. Para dar de alta,
usar la skill `add-comic`.

**Otros juegos de rol:** juegos de la familia de D&D que no son de
Wizards (los que derivan de D&D o usan sus licencias abiertas, y grandes
de fantasía como Daggerheart) y libros de otras editoriales para 5E,
claramente separados de lo oficial. Tres tipos de ficha en `data/rol/`:
licencias (`licenses/<slug>.json`, esquema `license.jsonschema`),
sistemas, una ficha por edición de un juego, con sus licencias y sus
derivaciones tipadas (`systems/<slug>.json`, `rpg-system.jsonschema`) y
libros con sus ediciones en inglés y en castellano
(`books/<sistema>/<slug>.json`, `rpg-book.jsonschema`). Entra todo lo
publicado en castellano y, de lo que solo está en inglés, los libros
principales (`core`) de los sistemas grandes y el catálogo de las
editoriales destacadas (`FEATURED_PUBLISHERS` en `src/utils/rpg.ts`).
Los juegos OSR y NSR llevan `movement` en su sistema (con texto propio
en `/rol#osr-y-nsr` que avisa de que la definición no es precisa) y de
ellos entra, además, la línea impresa propia en inglés (editorial del
sistema o `line_publishers`), con `format` en cada edición y al menos una
impresa (`movementBookProblem` en `src/utils/rpg.ts`). Si la editorial ha
liberado un libro en Codex de la Marca, la edición lo enlaza con
`free_download`, un botón aparte que no es de compra. De los juegos de La
Marca del Este entra todo lo oficial, también accesorios (formato
`accessory`), novelas y PDF liberados en Codex.
Los sistemas de D&D tienen ficha mínima que enlaza al catálogo oficial
(`official_catalog`). Como en novelas, un plugin de `vite.config.ts`
genera `virtual:rpg-index` (licencias, sistemas y resumen de los libros)
y `virtual:rpg-stats` (recuentos para la portada); cada libro es un trozo
aparte y las páginas leen de la caché de `rpgLoader.ts` (`useRpgIndex`,
`useRpgBook`). `data/rol/inventory.md` es la lista maestra (un test exige
que cada ficha esté en ella y al revés). Para dar de alta, usar la skill
`add-rpg`.

**Ediciones anteriores de D&D:** sección propia en `/ediciones`, fuera de
«Otros juegos de rol», con el mismo modelo y los mismos datos de `data/rol/`:
una edición es un sistema con `official: true` y sin `official_catalog`
(`isDndEdition` en `src/utils/rpg.ts`, que con `systemPath` y `bookPath` da
la URL de cada sistema y libro). Llevan todos los libros impresos de Wizards
de la edición, aunque solo salieran en inglés, con su edición de Devir si la
hubo. Están descatalogados: el único enlace de compra permitido es el de
DMsGuild (PDF e impresión bajo demanda de Wizards), en la edición en inglés;
un test lo exige y `just affiliate-coverage` solo revisa esa tienda. Las fichas son `RpgSystemPage` y
`RpgBookPage` con `section="ediciones"`; `/rol/dnd-3-5` redirige con
`public/_redirects`.

**Rutas:** `/catalogo` (catálogo completo), `/2014` y `/2024` (páginas
de edición con categoría opcional), `/producto/:edition/:code` (detalle
de producto), `/videojuegos` (listado), `/videojuego/:slug` (ficha), `/merchandising`
(listado), `/merchandising/:slug` (ficha), `/novelas` (listado, con
`?mundo=` y `?serie=`), `/novela/:slug` (ficha), `/comics` (listado, con
`?editorial=`, `?mundo=` y `?epoca=`), `/comic/:slug` (ficha), `/rol` (otros juegos de
rol), `/rol/:sistema` y `/rol/:sistema/:libro` (fichas), `/ediciones`
(ediciones anteriores de D&D), `/ediciones/:edicion` y
`/ediciones/:edicion/:libro` (fichas), `/licencias` y `/licencia/:slug`,
`/novedades` y `/novedades/:mes` (resumen mensual).

**Tiendas y afiliados:** `src/utils/stores.ts` resuelve el enlace de
cada tienda (Amazon, Adtraction, Awin, Instant Gaming, DriveThru; NoSoloRol y
DriveThruRPG solo en otros juegos de rol, DMsGuild solo en ediciones
anteriores, Tesoros de la Marca, sin afiliado y sin `rel="sponsored"`, solo en los
juegos de La Marca del Este, `MARCA_DEL_ESTE_SYSTEMS`); los JSON guardan
siempre la URL limpia y los IDs llegan por variables `VITE_AFFILIATE_*`
(ver README).

**Planificación:** las funcionalidades grandes se planifican con
OpenSpec en `openspec/` (`/opsx:propose`, `/opsx:apply`,
`/opsx:archive`).

**Alias de ruta:** `@` apunta a `./src` (configurado en vite.config.ts).

**Prerenderizado:** tras el build del cliente se hace un build de servidor
de `src/entry-server.tsx` (en `dist-ssr/`) y `scripts/prerender.mjs`
genera un HTML por cada URL del sitemap (`dist/producto/2014/phb.html`,
etc.) con su contenido y sus etiquetas `<head>`. Las portadas que usan
las fichas como `og:image` se convierten con `sharp` en vistas previas
ligeras de 1200×630 (`dist/images/previews/`). `main.tsx` hidrata ese
HTML. Lo que pinte el primer render debe coincidir en servidor y
navegador: nada de `window` ni `localStorage` durante el render.

**Feed y página de novedades:** qué es una novedad lo decide la lógica
pura de `scripts/releases.mjs` (con tests en `scripts/releases.test.mjs`):
ediciones con fecha de mes o de día de todas las secciones y anunciados sin
fecha. `scripts/generate-feed.mjs` genera en el build `dist/feed.xml`
(Atom) con las 50 últimas ya publicadas (`scripts/feed.mjs`); se anuncia en
el `<head>` de `index.html` y en el pie. `/novedades` (`ReleasesPage`) y el
bloque de la portada leen `virtual:releases`, que un plugin de
`vite.config.ts` calcula con «hoy» en hora de Madrid: lo salido en 90 días,
lo que tiene fecha futura y lo anunciado. Como la fecha se fija en el build,
`deploy.yml` despliega también cada día a las 4:00 UTC.

**Resumen mensual:** `/novedades/AAAA-MM` (`MonthlySummaryPage`) cuenta lo
que cambió en `data/` cada mes completo desde noviembre de 2026: fichas
nuevas por sección (recuento y diez de ejemplo), ediciones y fechas en
castellano y reseñas. `virtual:monthly-summaries` lo calcula en el build con
el historial de git (`scripts/git-history.mjs` compara la última revisión
anterior al día 1 de cada mes en hora de Madrid; `scripts/monthly-summary.mjs`
es la lógica pura, con tests). Por eso `deploy.yml` clona con
`fetch-depth: 0`; en un clon superficial el build de producción falla.
`SUMMARY_TODAY=AAAA-MM-DD` simula otro día en local.

**Despliegue:** Cloudflare Pages (proyecto `catalogodnd`) en
`catalogodnd.es`; el base path es `/` en todos los entornos.

## Pre-commit

Husky + lint-staged ejecuta ESLint y Prettier sobre archivos `.ts`,
`.tsx`, `.js`, `.jsx`, `.mjs` staged antes de cada commit. Los archivos
`.md` pasan por markdownlint y Prettier.

## Idioma

La interfaz, el README, los mensajes de commit y todo el contenido
visible al usuario están en castellano. Los datos de productos incluyen
publicaciones tanto en inglés como en castellano.
