# Design

## Context

- Las guías actuales están en `src/pages/guides/`, con `GuideLayout`, la
  lista `GUIDES` de `guides.ts`, una ruta cada una en `AppRoutes.tsx` y
  su URL a mano en `scripts/generate-sitemap.mjs`.
- Las novelas se leen del índice ligero (`virtual:novels-index`, con
  slug, títulos, serie, año, mundo, castellano y miniatura) por
  `useNovelIndex`. `preloadNovelRoute` solo lo precarga en `/novelas` y
  `/novela/:slug`; `entry-server.tsx` lo llena siempre.
- Algunas novelas de las guías no están en una serie propia: _Dragons of
  Summer Flame_ no tiene serie, y en _The Sundering_ solo la novela de
  Salvatore es de Drizzt.

## Goals / Non-Goals

**Goals:**

- Guías que se mantienen solas: si cambian los datos de una novela
  (título en castellano, edición nueva), la guía cambia con ellos.
- Sin cargar las fichas completas: basta con el índice.

**Non-Goals:**

- Guías de otras series (se pueden añadir después con el mismo formato).
- Mostrar botones de compra en la guía: se compra desde la ficha.

## Decisions

1. **Orden en un archivo de datos**: `data/novels/reading-orders.json`
   con cada guía como lista de bloques `{ título, series | novels }`. Un
   bloque por serie toma sus novelas en el orden de `series.number`; con
   `novels`, la lista explícita (para _Dragons of Summer Flame_ o
   _The Companions_ de Salvatore). Un test comprueba que todo existe.
   Alternativa descartada: escribir el orden en el componente, que
   mezclaría datos y presentación.
2. **Drizzt en orden cronológico** (el de la numeración oficial de la
   Leyenda de Drizzt: el elfo oscuro, el Valle del Viento Helado…), con
   una nota de que se publicaron en otro orden. **Dragonlance en orden de
   publicación**, que es como se recomienda leer la línea principal.
3. **Componente común** `ReadingOrderGuide` que pinta los bloques con la
   miniatura, títulos, año, distintivo de castellano y enlace; las dos
   guías de orden lo usan con su id.
4. **Guía en castellano calculada** sobre el índice: agrupa por mundo y
   serie las novelas con `spanish !== 'none'`; cada serie enlaza al
   listado filtrado (`/novelas?serie=`).
5. **Precarga**: `preloadNovelRoute` carga el índice en las rutas
   `/guias/orden-de-lectura-*` y `/guias/novelas-en-castellano`, para
   que el primer render coincida con el HTML prerenderizado.

## Risks / Trade-offs

- [El orden de lectura es opinable] → se explica el criterio en la
  introducción de cada guía y se indica la alternativa (orden de
  publicación de Drizzt).
- [Peso del índice en las guías] → el índice ya va en un trozo aparte y
  lo comparten el listado y las fichas.
