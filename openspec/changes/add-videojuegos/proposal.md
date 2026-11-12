# Proposal

## Why

El catálogo solo cubre libros y accesorios de D&D, pero la marca tiene
casi medio siglo de videojuegos oficiales, desde la serie Gold Box hasta
Baldur's Gate 3, y no hay ningún sitio en castellano que los reúna todos
y diga en cuál se puede jugar en castellano y dónde comprarlo hoy. Esto
amplía el público del sitio y abre una fuente de afiliación nueva: el
programa de GOG en Adtraction, con un 6 % por venta en España.

## What Changes

- Sección nueva de videojuegos oficiales de D&D: todos, de cualquier
  época y plataforma, incluidos los juegos online o de móvil ya
  cerrados.
- Ficha por juego con fechas, desarrolladora y editora, plataformas y
  ediciones, castellano por plataforma (textos, subtítulos y voces),
  notas de medios, portada, contexto (mundo, reglas, género) y libros
  relacionados del catálogo.
- Listado en `/videojuegos` con filtros, orden y búsqueda; fichas en
  `/videojuego/:slug`. Las dos páginas se prerenderizan y entran en el
  sitemap como el resto del sitio.
- Enlaces de compra por plataforma, empezando por GOG con afiliado de
  Adtraction, Amazon (digital y físico) y Humble Bundle; Fanatical y
  Green Man Gaming si sus condiciones convencen; Instant Gaming y Eneba
  como una tienda más; Steam sin afiliado.
- Inventario maestro de juegos oficiales para medir lo que falta.
- Herramientas de mantenimiento: skill `add-videogame` y vigilancia de
  lanzamientos en `novedades`.
- Ajuste de los textos generales del sitio (portada, cabecera, página
  legal), que ahora solo hablan de libros.

Fuera de alcance: juegos electrónicos de mesa (como el _Computer
Labyrinth Game_ de Mattel), juegos de fans y mods, herramientas
digitales (D&D Beyond, mesas virtuales) y precios o stock en tiempo
real.

## Capabilities

### New Capabilities

- `videogame-records`: qué juegos entran en el catálogo y qué datos
  verificables se guardan de cada uno (ediciones, plataformas,
  castellano, notas, imágenes, relación con los libros).
- `videogame-detail-page`: la ficha pública de un videojuego y lo que
  muestra.
- `videogame-listing`: el listado de videojuegos con filtros, orden,
  búsqueda e integración en la navegación del sitio.
- `videogame-purchase-links`: los enlaces de compra a tiendas de
  videojuegos, con o sin afiliado, agrupados por plataforma.

### Modified Capabilities

Ninguna: el proyecto aún no tiene specs en `openspec/specs/`, y el
comportamiento del catálogo de libros no cambia.

## Impact

- **Datos:** carpeta nueva `data/videogames/` y esquema
  `data/schemas/videogame.jsonschema`; portadas en
  `public/images/videogames/`.
- **Código:** tipos, servicio de carga, store de Zustand, páginas y
  componentes nuevos; `AppRoutes.tsx`; tipo `Store` y `STORES` en
  `src/utils/stores.ts`; `src/vite-env.d.ts`.
- **Build:** `scripts/generate-sitemap.mjs`, prerenderizado y vistas
  previas de 1200×630; `scripts/download-images.mjs`.
- **Despliegue:** variable nueva `VITE_AFFILIATE_GOG_PROGRAM` en los
  secretos de Cloudflare Pages.
- **Herramientas:** skill nueva `add-videogame`, cambios en la skill
  `novedades` y en `scripts/novedades.mjs`, y `CLAUDE.md` y README
  actualizados.
- **Externo:** solicitar el programa de GOG en Adtraction.
