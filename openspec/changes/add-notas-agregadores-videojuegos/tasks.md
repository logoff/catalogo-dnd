# Tasks

## 1. Solo agregadores

- [x] 1.1 Reducir `source` a `metacritic` y `opencritic` en
      `data/schemas/videogame.jsonschema`, `ReviewSource`
      (`src/types/videogame.ts`) y `reviewSourceNames`
      (`src/utils/videogameTranslations.ts`); añadir a
      `videogameLoader.test.ts` un test de que una nota con
      `source: "ign"` no pasa el esquema; verificar con `just check`

## 2. Vigilancia

- [x] 2.1 Añadir `allScores()` a `scripts/videogames.mjs` y crear
      `scripts/check-scores.mjs` con la receta `just check-scores` según
      el diseño (agrupado por URL, `aggregateRating.ratingValue` del
      JSON-LD, comparación solo con la nota de la plataforma principal,
      aviso con 404/410 o nota distinta, 403/429/5xx/sin nota como no
      comprobadas, aviso único sin red, `::warning` en Actions, salida
      siempre 0); verificar con las notas actuales, con una nota cambiada
      a mano y con una URL inventada en una ficha temporal
- [ ] 2.2 Añadir el paso `node scripts/check-scores.mjs` a
      `.github/workflows/test.yml` con `continue-on-error: true`;
      verificar en la PR que el workflow termina en verde

## 3. Carga de notas

- [x] 3.1 Con un script de un solo uso en el scratchpad, listar
      candidatos de Metacritic y OpenCritic para los juegos publicados
      sin nota (URL, nota, número de críticas y título de la página);
      verificar que la lista cubre todos los juegos publicados sin nota
- [x] 3.2 Revisar cada candidato (mismo juego, año, plataforma
      principal, edición) y añadir las notas a las fichas, con las de
      OpenCritic de los juegos que la tengan; verificar con `just check`,
      `just check-scores` sin avisos y, tras `just build`, que las fichas
      nuevas muestran «Notas» y que el listado ordenado por nota las
      incluye
- [x] 3.3 Dejar anotados en el informe de la PR los juegos que quedan
      sin nota por no tener página en ningún agregador

## 4. Herramientas y documentación

- [x] 4.1 Actualizar la skill `add-videogame` (notas solo de Metacritic
      y OpenCritic, cómo elegir la plataforma principal, ediciones con
      página propia y `just check-scores`) y la skill `novedades` (notas
      de los juegos publicados en el último año y `just check-scores`);
      verificar leyendo las skills
- [x] 4.2 Documentar las fuentes de las notas y `just check-scores` en
      `CLAUDE.md` y el README; verificar con `just check` (markdownlint y
      Prettier)

## Workflow follow-up

- Abrir la PR con las comprobaciones y, tras fusionar, archivar
  `add-notas-agregadores-videojuegos`.
