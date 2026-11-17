# Proposal

## Why

La sección de novelas tiene los datos que más se buscan sobre la ficción
de D&D («en qué orden leer a Drizzt», «orden de la Dragonlance», «qué
novelas hay en castellano»), pero repartidos en 619 fichas. Una guía por
cada pregunta atrae búsquedas y lleva a las fichas, que tienen los botones
de compra; ayuda además a llegar a las ventas mínimas del programa de
Amazon antes de abril de 2027.

## What Changes

- Tres guías nuevas en `/guias`, generadas a partir de los datos de las
  novelas:
  - **Orden de lectura de la Leyenda de Drizzt**
    (`/guias/orden-de-lectura-drizzt`): las novelas de R. A. Salvatore
    sobre Drizzt, por subserie y en el orden recomendado.
  - **Orden de lectura de la Dragonlance**
    (`/guias/orden-de-lectura-dragonlance`): la línea principal de
    Margaret Weis y Tracy Hickman, en orden de publicación.
  - **Novelas de D&D en castellano** (`/guias/novelas-en-castellano`):
    por mundo, las series traducidas (cuántas novelas de cada una) y las
    novelas sueltas traducidas.
- En cada novela: título en inglés, título en castellano si lo tiene,
  año, si está en castellano y enlace a su ficha.
- Las guías entran en el listado de guías, el sitemap y el
  prerenderizado, y cargan el índice de novelas antes de hidratar.

## Capabilities

### New Capabilities

- `novel-guides`: guías de lectura generadas desde los datos de las
  novelas.

### Modified Capabilities

(ninguna)

## Impact

- `src/pages/guides/` (tres guías nuevas y `guides.ts`), `AppRoutes.tsx`,
  `scripts/generate-sitemap.mjs`.
- `novelLoader.ts`: `preloadNovelRoute` carga el índice también en las
  rutas de estas guías; `entry-server.tsx` ya lo tiene completo.
- Un archivo de datos con el orden de cada guía (series y novelas).
