# Tasks

## 1. Grupo y tipos nuevos

- [x] 1.1 Añadir el grupo `stationery` con los tipos `journal`, `puzzle` y `stationery_gift`, y el tipo `gamebook` en `books`, a `data/schemas/merchandise.jsonschema`, `src/types/merchandise.ts` y `src/utils/merchandiseTranslations.ts`; verificar con un caso de filtro por el grupo en `src/utils/merchandiseFilters.test.ts` y `just test`

## 2. Alcance e inventario

- [x] 2.1 Actualizar el alcance de `data/merchandising/inventory.md`, añadir la sección «Papelería y regalo» y las filas nuevas de libros, y anotar como pendiente revisar otras editoriales de papelería
- [x] 2.2 Actualizar la skill `add-merchandise` (grupos y tipos) y la sección de merchandising de `CLAUDE.md`; verificar con `just format-check`

## 3. Fichas

- [x] 3.1 Cargar las fichas de libros que faltan de Penguin Random House y las ediciones especiales de _Art & Arcana_ y _Lore & Legends_, con imagen y enlaces comprobados; verificar con `just test` (_Cozy Dungeon_ queda pendiente en el inventario: aún no tiene portada publicada)
- [x] 3.2 Cargar los siete librojuegos (_Escape from Host Tower_ y los seis _Endless Quest_); verificar con `just test` (_Escape from Host Tower_ queda pendiente: aún no tiene portada publicada)
- [x] 3.3 Cargar las fichas de papelería y regalo; verificar con `just test`
- [x] 3.4 Dar de alta el cómic _The Candlekeep Chronicles_ con la skill `add-comic`; verificar con `just test`
- [x] 3.5 `just affiliate-coverage` no lista ninguna ficha sin revisar y las descripciones pasan al usuario para revisión

## 4. Verificación

- [x] 4.1 `just check` pasa y `/merchandising` con el filtro «Papelería y regalo» muestra las fichas nuevas en `just dev`

## Workflow follow-up

- Abrir la PR, fusionarla tras la revisión del usuario y archivar el cambio con `/opsx:archive`.
