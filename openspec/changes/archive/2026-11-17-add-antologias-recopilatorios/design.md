# Design

## Context

- Los recopilatorios viven en `data/novels/series.json`, dentro de cada
  serie (`collections`), y el esquema `novel-series.jsonschema` ya
  admite el castellano (`language`, `spain`). La ficha los muestra en la
  sección «Recopilatorios» (`collectionsIn` en `src/utils/novels.ts`).
  Ahora solo hay recopilatorios en inglés, que el generador
  `build_lot.py` saca de ISFDB.
- `series.json` y cada ficha se cargan en trozos aparte de forma
  perezosa (`novelLoader.ts`); la ficha lee de la caché síncrona y
  `entry-server.tsx` la llena entera antes de prerenderizar.
- Tercera Fundación registra los recopilatorios en castellano como
  ediciones de cada novela con el mismo ISBN (por ejemplo, el tomo de
  Cormyr de 2009); en el lote 8.4 se quitaron a mano de las fichas.

## Goals / Non-Goals

**Goals:**

- Que las antologías sigan el mismo modelo de ediciones que las novelas,
  para reutilizar validación, portadas y botones de compra.
- Que el bundle principal no crezca: los datos de antologías van en un
  trozo aparte, como `series.json`.

**Non-Goals:**

- Página propia, listado o buscador de antologías.
- Listar los relatos que contiene cada antología.

## Decisions

1. **Archivo propio `data/novels/anthologies.json`** con esquema
   `novel-anthology.jsonschema`, en vez de meterlas en `series.json` o
   como fichas de novela con un `kind` nuevo. Una antología puede
   relacionarse con varias series (o con novelas sueltas) y tiene
   ediciones propias en dos idiomas; como ficha de novela habría que
   excluirla a mano del listado, del buscador y del sitemap.
   - Campos: `id`, `title`, `title_es?`, `settings` (uno o varios),
     `description`, `source`, `series` (ids), `novels` (slugs),
     `editions` (reutiliza `$defs/edition` de `novel.jsonschema`).
2. **Relación por serie o por novela**: la ficha muestra una antología
   si la novela está en `novels` o su serie en `series`. Así basta con
   anotar la serie en el caso común, y la novela suelta cuando la
   antología solo continúa algunos libros (por ejemplo, los relatos de
   Drizzt, que abarcan varias subseries).
3. **Relaciones a partir de ISFDB**: la página de contenidos de cada
   antología en ISFDB indica la serie de cada relato; se cruzan con las
   series del catálogo y se completan con la columna de serie de la lista
   de Wikipedia. Lo que no encaje en ninguna serie se relaciona con las
   novelas cuyos personajes protagonizan los relatos.
4. **Recopilatorios en castellano desde Tercera Fundación**: una edición
   en castellano cuyo ISBN se repite en varias novelas de la misma serie
   es un recopilatorio; `build_lot.py` (o un script nuevo de la skill)
   la saca de las ediciones y la añade a `collections` de la serie.
5. **Portadas** en `public/images/novels/anthologies/<id>/<isbn>.webp`,
   con un modo `--anthology <id>` en `download-novel-covers.mjs`, igual
   que `--series` para los recopilatorios.
6. **Carga**: `anthologies.json` se importa con un glob perezoso, como
   `series.json`; `loadNovel` lo carga junto a la ficha y
   `entry-server.tsx` lo precarga.

## Risks / Trade-offs

- [Antología sin serie clara (relatos sueltos de los Reinos)] → se
  relaciona con las novelas de los personajes que protagonizan los
  relatos; si no hay ninguna con ficha, no entra y queda anotada en el
  inventario como descartada.
- [Recopilatorios en castellano mal detectados (mismo ISBN por error en
  Tercera Fundación)] → solo se tratan como recopilatorio si el título
  de la edición es distinto del de la novela o reúne novelas de la misma
  serie; se revisan a mano antes de escribirlos.
- [Peso del trozo de antologías] → unas 45 entradas, del orden de
  decenas de kB; no afecta al bundle principal.
