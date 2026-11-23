# Proposal

## Why

La página de novedades (#89) cuenta qué sale al mercado, pero no qué ha
cambiado en el catálogo: fichas nuevas, ediciones en castellano anunciadas,
fechas confirmadas o reseñas añadidas. Un resumen mensual generado de los
datos enseña que la web está viva y da algo que compartir cada mes (#91),
sin redactar texto a mano.

## What Changes

- Una página por mes en `/novedades/AAAA-MM` con lo que cambió en `data/`
  ese mes, calculado del historial de git:
  - fichas nuevas por sección, con el recuento y hasta diez de ejemplo;
  - ediciones en castellano nuevas en fichas que ya existían;
  - fechas en castellano confirmadas o corregidas;
  - reseñas de medios añadidas.
- Solo se publican los meses completos. El primero es noviembre de 2026,
  el mes en que entró casi todo el catálogo: se publica igual, con los
  recuentos por sección y sin listar las 2.503 fichas.
- `/novedades` enlaza al último resumen y al archivo de meses anteriores.
- Las páginas de cada mes entran en el sitemap y se prerenderizan.
- El despliegue clona el historial completo para poder calcularlo; con el
  despliegue diario, el resumen de un mes aparece solo el día 1 del
  siguiente.

## Capabilities

### New Capabilities

- `catalog-monthly-summary`: el resumen mensual de cambios del catálogo:
  qué cuenta como cambio, cómo se calcula de los datos, qué meses se
  publican y cómo se enlaza.

### Modified Capabilities

<!-- Ninguna: el enlace desde /novedades se especifica en la capacidad
nueva, porque la página de novedades aún no está archivada en las specs. -->

## Impact

- Código: script con la lógica pura del resumen y lector del historial de
  git en `scripts/`, módulo virtual en `vite.config.ts`, página y ruta en
  `src/`, `ReleasesPage.tsx`, `scripts/generate-sitemap.mjs`.
- Despliegue: `deploy.yml` pasa de `fetch-depth: 2` a `0` (historial
  completo, unos 680 MB hoy); el build tarda algo más.
- Datos: ninguno nuevo. Depende de que los commits de `main` tengan la
  fecha de fusión (las PR se fusionan con squash).
- Relación: el canal propio (#92) podría publicar cada resumen; queda fuera.
