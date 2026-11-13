# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code)
para trabajar con el código de este repositorio.

## Resumen del proyecto

Catálogo en castellano de libros y accesorios de Dungeons & Dragons
para las ediciones 5E (2014) y 5.5E (2024), y de todos los videojuegos
oficiales de D&D. Se despliega en Cloudflare Pages en
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
- `just check-videos` — Avisa de vídeos retirados, no empotrables o de
  otro canal (en Actions, sin bloquear)

Ejecutar un test individual:
`npx vitest run src/utils/imageResolver.test.ts`

## Arquitectura

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

**Videojuegos:** cada juego es un JSON en
`data/videogames/games/<década>/<slug>.json` (esquema
`data/schemas/videogame.jsonschema`) con sus lanzamientos por plataforma
y edición, el castellano de cada uno (solo si está confirmado; sin dato
cuenta como solo en inglés), notas y enlaces de compra.
`videogameLoader.ts` los enriquece en `VideogameWithMeta`.
Pueden llevar hasta tres vídeos oficiales de YouTube (`videos`), solo de
la editora, la desarrolladora, una plataforma o Wizards; su miniatura se
guarda en `public/images/videogames/<slug>/video-<id>.jpg` y el
reproductor de `youtube-nocookie.com` solo se carga al pulsar
(`YouTubeVideo.tsx`), para no contactar con YouTube antes.
`data/videogames/inventory.md` es la lista maestra: un test exige que
cada ficha esté en ella y al revés. Para dar de alta juegos, usar la
skill `add-videogame`.

**Rutas:** `/catalogo` (catálogo completo), `/2014` y `/2024` (páginas
de edición con categoría opcional), `/producto/:edition/:code` (detalle
de producto), `/videojuegos` (listado) y `/videojuego/:slug` (ficha).

**Tiendas y afiliados:** `src/utils/stores.ts` resuelve el enlace de
cada tienda (Amazon, Adtraction, Awin, Instant Gaming); los JSON guardan
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
