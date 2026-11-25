# Tasks

## 1. Modelo de la campaña

- [x] 1.1 Añadir `crowdfunding` (`platform`, `url`, `end`) a la edición en `data/schemas/rpg-book.jsonschema` y `src/types/rpg.ts`; verificar con un caso del esquema en los tests del loader de rol
- [x] 1.2 Módulo `virtual:build-date` en `vite.config.ts` y la campaña en `RpgBookPage.tsx` (abierta o financiada); verificar con `RpgBookPage.test.tsx`
- [x] 1.3 `campaignEntries` en `scripts/releases.mjs`, lista `campaigns` en `virtual:releases` y bloque «En micromecenazgo» en `ReleasesPage`; verificar con `scripts/releases.test.mjs` y `ReleasesPage.test.tsx`

## 2. Fichas

- [x] 2.1 Sistemas Axis Mundi, Vieja Escuela, Kaylos OSR y Helvéczia con sus libros, y filas en `data/rol/inventory.md`; verificar con `just test`
- [x] 2.2 Libros de El Mazmorrón (con sus campañas), Magia y Acero y Más allá de Corny Groń; verificar con `just test`
- [x] 2.3 `just affiliate-coverage` sin fichas por revisar; descripciones al usuario para revisión
- [x] 2.4 Descarga gratuita abierta a cualquier copia legal de la editorial o del autor (esquema, `freeDownloadLabel` y ficha), con enlace en Vieja Escuela, Magia & Acero y Trasgos y Mazmorras, y sistemas Eirendor y Trasgos y Mazmorras; verificar con `src/utils/rpg.test.ts` y `just test`

## 3. Documentación y verificación

- [x] 3.1 Documentar la campaña en la skill `add-rpg` y en `CLAUDE.md`; verificar con `just format-check`
- [x] 3.2 `just check` pasa y en `just dev` la ficha de _Mazmorrón: El Azulón_ y `/novedades` muestran la campaña abierta

## Workflow follow-up

- Abrir la PR, fusionarla tras la revisión del usuario y archivar el cambio con `/opsx:archive`.
