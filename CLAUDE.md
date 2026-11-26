# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code)
para trabajar con el código de este repositorio.

## Resumen del proyecto

Catálogo en castellano de libros y accesorios de Dungeons & Dragons
para las ediciones 5E (2014) y 5.5E (2024), de todos los videojuegos
oficiales de D&D, del merchandising con licencia, de las novelas
oficiales, de las películas y series (oficiales y, aparte, no oficiales)
y de otros juegos de rol de la familia de D&D con sus licencias
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
  vídeos de los videojuegos y los tráileres de cine y series
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
- `just screen-posters <slug> --source <página> <idioma>=<url>…` — Descarga
  los carteles de una película o serie (`en`, `es` o `pt`), los convierte a
  WebP con miniatura y los anota en su ficha
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
Los componentes base están en `src/components/ui/` (botón, tarjeta,
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
y cartas). Cada artículo es un JSON en
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

**Cine y series:** películas, series, documentales y episodios sueltos
de D&D. Cada obra es un JSON en `data/screen/<tipo>/<slug>.json` (tipos
`films`, `series`, `documentaries`, `episodes`; esquema
`data/schemas/screen.jsonschema`), oficial (licencia de TSR, Wizards o
Hasbro) o no oficial (sin licencia pero con D&D como tema principal, con
`unofficial_reason`). Lleva sinopsis propia, estrenos por país y medio,
ediciones físicas en España (solo Amazon), hasta dos carteles
(`poster-<idioma>.webp` en `public/images/screen/<slug>/`), hasta tres
tráileres de canales oficiales con su idioma (mismo reproductor y
miniaturas locales que los videojuegos, `src/components/common/YouTubeVideo.tsx`)
y enlaces a IMDb y FilmAffinity. Las relaciones con novelas,
merchandising y videojuegos solo se guardan en la ficha de la obra;
`screenLoader.ts` calcula el sentido inverso. Va en el bundle principal.
`data/screen/inventory.md` es la lista maestra (un test exige que cada
ficha esté en ella y al revés). Para dar de alta obras, usar la skill
`add-screen`. Prime Video y otras plataformas solo se enlazan si se acepta
su programa de afiliados.

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
Los sistemas de D&D tienen ficha mínima que enlaza al catálogo oficial
(`official_catalog`). Como en novelas, un plugin de `vite.config.ts`
genera `virtual:rpg-index` (licencias, sistemas y resumen de los libros)
y `virtual:rpg-stats` (recuentos para la portada); cada libro es un trozo
aparte y las páginas leen de la caché de `rpgLoader.ts` (`useRpgIndex`,
`useRpgBook`). `data/rol/inventory.md` es la lista maestra (un test exige
que cada ficha esté en ella y al revés). Para dar de alta, usar la skill
`add-rpg`.

**Rutas:** `/catalogo` (catálogo completo), `/2014` y `/2024` (páginas
de edición con categoría opcional), `/producto/:edition/:code` (detalle
de producto), `/videojuegos` (listado), `/videojuego/:slug` (ficha), `/merchandising`
(listado), `/merchandising/:slug` (ficha), `/novelas` (listado, con
`?mundo=` y `?serie=`), `/novela/:slug` (ficha), `/cine-y-series`
(listado), `/cine-y-series/:slug` (ficha), `/rol` (otros juegos de rol), `/rol/:sistema` y `/rol/:sistema/:libro` (fichas), `/licencias` y
`/licencia/:slug`.

**Tiendas y afiliados:** `src/utils/stores.ts` resuelve el enlace de
cada tienda (Amazon, Adtraction, Awin, Instant Gaming; NoSoloRol solo en
otros juegos de rol); los JSON guardan
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

**Feed de novedades:** `scripts/generate-feed.mjs` genera en el build
`dist/feed.xml` (Atom) con las 50 últimas ediciones con fecha de todas las
secciones, usando la lógica pura de `scripts/feed.mjs` (con tests en
`scripts/feed.test.mjs`). Se anuncia en el `<head>` de `index.html` y en el
pie.

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
