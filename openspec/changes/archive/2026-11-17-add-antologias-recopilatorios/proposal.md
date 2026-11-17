# Proposal

## Why

La sección de novelas solo recoge los recopilatorios en inglés que lista
ISFDB, y deja fuera las antologías de relatos. Las dos son libros que el
lector puede comprar (muchos de segunda mano en castellano) y que
completan las series que ya tienen ficha: un lector de Drizzt querrá
saber que existe _The Collected Stories: The Legend of Drizzt_, y uno de
la Dragonlance, que los _Cuentos de la Dragonlance_ salieron en castellano.

## What Changes

- **Recopilatorios en castellano**: se añaden a `series.json` los
  volúmenes en castellano que reúnen varias novelas (por ejemplo, el
  tomo de Timun Mas de 2009 con las tres novelas de Cormyr), con las
  mismas reglas que los de inglés. La ficha ya los muestra.
- **Antologías de relatos** (las 43 de la lista de Wikipedia más
  _Untold Adventures_, sin el duplicado de _Dragons: Worlds Afire_):
  - Se guardan en un archivo nuevo, `data/novels/anthologies.json`, con
    sus ediciones en inglés y en castellano (ISBN, editorial, fecha,
    formato, portada y enlaces de compra), igual que las novelas.
  - No tienen ficha propia: cada antología se relaciona con las series
    y, si hace falta, con las novelas concretas cuyos personajes o
    historias continúa.
  - La ficha de cada novela relacionada muestra una sección
    «Antologías» con esos libros y sus botones de compra.
- **Inventario**: las antologías pasan de estar fuera del alcance a una
  sección propia del inventario, que los tests cruzan con el archivo.
- **Exclusiones**: los relatos y novelas cortas publicados solo en
  antologías siguen sin ficha propia; ahora se llega a ellos a través de
  la antología.

## Capabilities

### New Capabilities

- `novel-anthologies`: datos de las antologías de relatos, sus
  ediciones y su relación con series y novelas.

### Modified Capabilities

- `novel-records`: las antologías dejan de ser una exclusión total (siguen
  sin ficha) y los recopilatorios en castellano pasan a ser obligatorios
  cuando existan.
- `novel-detail-page`: nueva sección «Antologías» en la ficha.

## Impact

- Datos: `data/novels/series.json` (recopilatorios en castellano),
  nuevo `data/novels/anthologies.json`, `data/novels/inventory.md`.
- Esquema nuevo `data/schemas/novel-anthology.jsonschema`.
- `src/types/novel.ts`, `src/services/novelLoader.ts` (carga aparte, como
  `series.json`), `src/utils/novels.ts`, `src/components/novels/NovelDetail.tsx`,
  `src/entry-server.tsx` y `src/main.tsx` (precarga).
- `scripts/download-novel-covers.mjs` (portadas de antologías) y skill
  `add-novel` (cómo dar de alta antologías y recopilatorios en castellano).
- Tests de `novelLoader.test.ts` y `NovelDetailPage.test.tsx`.
