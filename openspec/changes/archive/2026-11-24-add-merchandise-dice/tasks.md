# Tasks

## 1. Grupo y tipos nuevos

- [x] 1.1 Añadir el grupo `dice` y los tipos `dice_set`, `dice_accessory` y `advent_calendar` a `data/schemas/merchandise.jsonschema` (enum e `if/then` del grupo); verificar con `npx vitest run src/services/merchandiseLoader.test.ts`
- [x] 1.2 Añadirlos a `src/types/merchandise.ts` y a `groupNames`, `kindNames` y `kindsByGroup` de `src/utils/merchandiseTranslations.ts` («Dados y accesorios», «Juego de dados», «Accesorio de dados», «Calendario de adviento»); verificar con `just check`
- [x] 1.3 Test que exige al menos un enlace de compra a cada artículo del grupo `dice`, y caso de filtro por el grupo en `src/utils/merchandiseFilters.test.ts`; verificar con `just test`

## 2. Alcance e inventario

- [x] 2.1 Actualizar el alcance de `data/merchandising/inventory.md` (los dados salen de las exclusiones y solo entran si están a la venta en España) y añadir la sección «Dados y accesorios» con las 18 filas del diseño en `pendiente`, más los productos oficiales que no se venden en España como pendientes de investigar
- [x] 2.2 Actualizar la skill `add-merchandise` (reglas, tabla de grupos y tipos, criterio de venta en España, tiendas donde buscar) y la sección de merchandising de `CLAUDE.md`

## 3. Fichas

- [x] 3.1 Cargar las 8 fichas de FanRoll con su imagen, fuente de fanrolldice.com y enlaces limpios de Amazon.es comprobados en Chrome; verificar con `just test`
- [x] 3.2 Cargar las 4 fichas de Sirius Dice, las 3 de Ultra Pro y la de Nemesis Now, con la fuente en la web del fabricante; verificar con `just test`
- [x] 3.3 Cargar las 2 fichas de Wizards (Dice & Miscellany, con los sets en la descripción, y el juego de dados oficial); verificar con `just test`
- [x] 3.4 Pasar al usuario las descripciones para revisión y marcar las fichas en el inventario
- [x] 3.5 `just affiliate-coverage` no lista ninguna ficha del grupo `dice`

## 4. Verificación

- [x] 4.1 `just check` pasa y `/merchandising` con el filtro «Dados y accesorios» muestra las 18 fichas en `just dev`

## Workflow follow-up

- Abrir la PR, fusionarla tras la revisión del usuario y archivar el cambio con `/opsx:archive`.
