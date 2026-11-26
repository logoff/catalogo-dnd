# Proposal

## Why

El catálogo solo recibe visitas puntuales a fichas y guías; no hay un lugar
que dé actualidad y motive a volver (#89). El feed de novedades ya reúne lo
recién salido de todas las secciones, pero no tiene página propia. Con los
datos de noviembre de 2026 hay unos 35 lanzamientos por trimestre y muy
pocos anuncios con fecha futura (Wizards confirma tarde y el castellano llega
aún más tarde), así que la página se centra en lo recién salido y deja lo
próximo como bloque secundario.

## What Changes

- Nueva página `/novedades` con:
  - **Recién salido**: las ediciones publicadas en los últimos 90 días de
    todas las secciones (libros 5E y 5.5E, videojuegos, merchandising,
    novelas, otros juegos de rol y ediciones anteriores), agrupadas por mes,
    en inglés y en castellano, con filtro por idioma.
  - **Próximamente**: las ediciones con fecha futura, agrupadas por mes, y
    los productos anunciados sin fecha (o solo con el año). Solo aparece si
    hay algo.
  - Sin cuadrícula de calendario: con tan pocos anuncios quedaría vacía; la
    agrupación por meses cumple esa función.
- La lógica de qué es una novedad se comparte con el feed Atom, que pasa a
  usarla para lo publicado; el feed no cambia de contenido.
- La portada añade un bloque «Novedades» con lo más próximo y lo más
  reciente, que enlaza a la página.
- El menú principal y el sitemap enlazan a `/novedades`.
- El sitio se vuelve a desplegar cada día, para que lo que llega a su fecha
  pase de «Próximamente» a «Recién salido» sin intervención.
- Cada enlace de la página lanza un evento de Umami para medirla.

## Capabilities

### New Capabilities

- `releases-page`: la página de novedades: qué ediciones entran, cómo se
  agrupan y filtran, cómo se mantiene al día y cómo se mide.

### Modified Capabilities

- `home-page`: el requisito «Lo más reciente» añade el bloque de
  novedades.

## Impact

- Código: `scripts/feed.mjs` (lógica compartida), nuevo módulo virtual en
  `vite.config.ts`, nueva página y ruta en `src/`, `HomePage.tsx`,
  `Header.tsx`, `scripts/generate-sitemap.mjs`.
- Despliegue: `.github/workflows/deploy.yml` gana un `schedule` diario
  (Cloudflare Pages admite de sobra un despliegue al día). IndexNow sigue
  avisando solo cuando cambian los datos.
- Medición: Umami (visitas a `/novedades`, evento de los enlaces); el
  informe mensual puede añadirlo más adelante.
- Datos: ninguno nuevo; depende de que la skill `novedades` mantenga las
  fechas (una pasada al mes).
- Relación: «Este mes en el catálogo» (#91) podría ser más adelante una
  sección de esta página; queda fuera de este cambio.
