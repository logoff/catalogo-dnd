# Design

## Context

- Las notas ya existen: `reviews` en `videogame.jsonschema`
  (`source`, `score`, `scale`, `url`, `platform`, `edition`), el tipo
  `Review` y la sección «Notas» de `VideogameDetail.tsx`, que pinta cada
  nota con `ReviewScore.tsx` como enlace al agregador.
  `videogameLoader.ts` calcula `bestScore` (la mejor nota normalizada),
  que el listado usa para ordenar y para la tarjeta.
- Los datos actuales: 16 notas en 11 juegos, todas de Metacritic salvo
  la de OpenCritic de _Baldur's Gate 3_. Las ediciones mejoradas con
  página propia se guardan aparte con `edition` («Enhanced Edition»).
- Las dos webs publican la nota en el JSON-LD de la página
  (`aggregateRating.ratingValue`, sobre 100). En Metacritic es la nota de
  la plataforma principal de la página (PC en _Baldur's Gate 3_, Xbox 360
  en _Daggerdale_): la página es única para todas las plataformas, el
  JSON-LD no cambia con `?platform=` y el desglose por plataforma solo
  aparece como texto en el HTML.
- `check-videos.mjs` y `check-reviews.mjs` son los modelos de vigilancia
  no bloqueante.
- Ver proposal.md para la motivación y `specs/videogame-records/spec.md`
  para los requisitos.

## Goals / Non-Goals

**Goals:**

- Que las notas sean solo de agregadores y se puedan vigilar sin
  intervención manual.
- Cargar las notas que faltan en una sola pasada, con un listado de
  candidatos generado por script y revisado a mano.

**Non-Goals:**

- Cambiar la presentación de la ficha o del listado.
- Vigilar las notas de las plataformas secundarias: Metacritic solo las
  da como texto en el desglose de la página, sin datos estructurados, y
  leerlas así sería frágil.

## Decisions

### Fuentes: un `enum` de dos valores

`source` pasa a `["metacritic", "opencritic"]` en el esquema, en
`ReviewSource` y en `reviewSourceNames`. El esquema ya rechaza cualquier
otro valor, y los tests de videojuegos ya validan las fichas contra él.
No hacen falta tests nuevos para esto, salvo el caso explícito de una
fuente no admitida.

### Qué nota guardar en Metacritic

- Por defecto, **una nota por página**: la de la plataforma principal,
  que es la del JSON-LD, con su `platform`. Va siempre la primera de las
  notas de esa URL.
- Nota de otra plataforma aparte solo si el desglose de la página le da
  una cifra distinta. Se toma a mano del desglose y lleva su `platform`.
  `check-scores` no la compara y solo comprueba su enlace.
- Una edición con página propia (Enhanced Edition, remasterización) se
  guarda como nota aparte con `edition`, como ahora.

### OpenCritic

Una nota por juego, sin `platform`: OpenCritic agrega todas las
plataformas. Cubre sobre todo los juegos desde 2015 y las versiones de
consola recientes de los clásicos.

### Carga asistida por script

Un script de un solo uso en el scratchpad (no en el repo) prueba para
cada juego sin nota las URL probables de Metacritic (`/game/<slug>/`,
`/game/dungeons-dragons-<slug>/`…) y busca en OpenCritic. Después
imprime los candidatos con la nota, el número de críticas y el título de
la página. Cada candidato se revisa a mano: que sea el mismo juego y no
un homónimo, que tenga nota y qué plataforma es la principal. Así la
carga no depende de adivinar slugs, pero ningún dato entra sin
comprobarlo.

Las páginas de Metacritic sin nota (sin `ratingValue`, porque tienen
pocas críticas) no se guardan.

### `check-scores`

`scripts/check-scores.mjs`, con el helper `allScores()` en
`scripts/videogames.mjs`:

- Agrupa las notas por URL. Por cada URL hace un GET con `User-Agent`
  de navegador, tiempo límite y pocas peticiones a la vez, y lee
  `aggregateRating.ratingValue` del JSON-LD.
- Avisa si la URL da 404 o 410, o si la nota publicada no coincide con
  la guardada de la plataforma principal. En Metacritic esa es la nota
  sin `platform` de consola; en OpenCritic, la única. Si una URL tiene
  varias notas, solo se compara la de la plataforma principal (la
  primera).
- Los 403, 429, 5xx, tiempos agotados y páginas sin `ratingValue` se
  cuentan como no comprobadas.
- Si no responde ninguna, es que no hay red: un único aviso. Termina
  siempre con 0 y usa `::warning` en Actions, como `check-reviews`.

Las notas cambian poco una vez pasado el lanzamiento, así que un aviso
casi siempre corresponde a un juego reciente o a una página nueva tras
una remasterización.

### Presentación

No cambia. `ReviewScore.tsx` ya muestra la cifra, la escala, el nombre
del agregador en texto y el enlace en una pestaña nueva con
`rel="noopener noreferrer"`. No hay logotipos ni datos estructurados de
valoración, y así se queda.

## Risks / Trade-offs

- [Las condiciones de uso de Metacritic y OpenCritic no autorizan por
  escrito mostrar sus notas] → El usuario ha decidido tratarlas como
  dato citado, igual que Wikipedia: cifra, nombre y enlace, sin
  logotipos ni contenido copiado. Si un agregador lo pide, se quitan sus
  notas de las fichas y el resto sigue funcionando.
- [Metacritic cambia su HTML o deja de publicar JSON-LD] →
  `check-scores` lo cuenta como no comprobado y no da avisos falsos. Si
  todo sale «no comprobado» durante semanas, hay que revisar el script.
- [Homónimos en la búsqueda asistida (un _Eye of the Beholder_ de 2026
  que no es de D&D)] → Revisión manual de cada candidato con el título y
  el año de la página.
- [Notas de consola que no se vigilan] → Son pocas y estables; su enlace
  sí se comprueba.

## Migration Plan

No hace falta migrar: ningún dato usa las fuentes que se quitan. Se
despliega como siempre y se revierte con la PR.
