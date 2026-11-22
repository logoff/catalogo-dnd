# Tasks

## 1. Modelo y reglas

- [x] 1.1 Añadir `movement` (`osr` | `nsr`) y `line_publishers` opcionales a `data/schemas/rpg-system.jsonschema` y a `src/types/rpg.ts`; verificar con `just check` que los 19 sistemas actuales siguen validando
- [x] 1.2 Añadir a `src/utils/rpg.ts` la función que dice si un sistema llega a una edición de D&D por sus derivaciones, con o sin inspiración, y la que devuelve las editoriales de la línea propia; verificar con tests unitarios (directo, a través de otro sistema, solo inspiración, sin relación)
- [x] 1.3 Añadir a `rpgLoader.test.ts` las reglas de `rpg-movements`: movimiento solo en sistemas que no son D&D, OSR sin inspiración, NSR con camino a D&D; verificar que fallan con fichas de prueba mal formadas y pasan con los datos reales
- [x] 1.4 Dividir el test de alcance de libros: sin movimiento, la regla actual; con movimiento, castellano o línea propia, `format` en cada edición y al menos una edición impresa; verificar con casos de prueba (terceros solo en inglés, solo PDF, impresión bajo demanda)
- [x] 1.5 Llevar el movimiento del sistema al resumen de libro de `virtual:rpg-index` (`vite.config.ts`) y comprobar en el test del índice que está y que no se cuelan descripciones

## 2. Páginas

- [x] 2.1 Añadir `movement` a `RpgFilters` y al filtro de `RpgSectionPage`, combinable con los demás; verificar con tests de `rpgFilters` y de la página (OSR más castellano)
- [x] 2.2 Escribir la explicación de OSR y NSR (texto propio, que diga expresamente que la definición no es precisa y que la etiqueta es una orientación del catálogo) en un componente con ancla `#osr-y-nsr`; verificar con un test que el texto aparece en `/rol`
- [x] 2.3 Partir la lista de familias de `/rol` en las de sin movimiento y el grupo OSR y NSR con la explicación, cada sistema con su etiqueta; verificar con el test de la página
- [x] 2.4 Mostrar en `RpgSystemPage` la insignia del movimiento enlazada a `/rol#osr-y-nsr`; verificar con el test de la ficha
- [x] 2.5 Comprobar en `/rol/arbol` (servidor de desarrollo) que los sistemas nuevos se leen bien; si no, añadir un control para ocultar o mostrar OSR y NSR, con su test

## 3. Licencias

- [x] 3.1 Dar de alta la CC BY-SA 4.0 y cada licencia de compatibilidad que publique una editorial (Old-School Essentials, Mörk Borg, Shadowdark, Dungeon Crawl Classics, Labyrinth Lord, Swords & Wizardry y las que aparezcan), de tipo licencia comunitaria, con explicación propia y enlace oficial; verificar con `just test` (esquema e inventario) y en `/licencias`

## 4. Sistemas

- [x] 4.1 Dar de alta los sistemas OSR del inventario de partida que tengan libro impreso, cada uno con descripción, características, licencias, derivaciones con nota y fuente, `movement: "osr"` y `line_publishers` si hace falta; verificar con `just test` (reglas de derivación e inventario)
- [x] 4.2 Dar de alta los sistemas NSR del inventario de partida con `movement: "nsr"` y sus derivaciones de inspiración con nota; verificar con `just test`
- [x] 4.3 Añadir los sistemas a `data/rol/inventory.md` con su fuente y comprobar en `/rol/arbol` que cada uno cuelga de donde debe

## 5. Libros en castellano

- [x] 5.1 Catalogar todo lo publicado en castellano de los sistemas OSR (Aventuras en la Marca del Este y retroclones españoles, Old-School Essentials y los demás traducidos), con sus ediciones, ISBN, portadas y enlaces a JMR, Casa del Libro o NoSoloRol cuando los vendan; verificar con `just test`
- [x] 5.2 Catalogar todo lo publicado en castellano de los sistemas NSR (Mörk Borg y los demás traducidos), con lo mismo; verificar con `just test`

## 6. Líneas propias en inglés

- [x] 6.1 Old-School Essentials y Dolmenwood (Necrotic Gnome): línea impresa completa con enlaces a DriveThruRPG; verificar con `just test`
- [x] 6.2 Shadowdark (The Arcane Library): línea impresa completa con enlaces a DriveThruRPG; verificar con `just test`
- [x] 6.3 Dungeon Crawl Classics (Goodman Games): línea impresa completa con enlaces a DriveThruRPG; verificar con `just test`
- [x] 6.4 Lamentations of the Flame Princess: línea impresa completa con enlaces a DriveThruRPG si la vende; verificar con `just test`
- [x] 6.5 Swords & Wizardry, Labyrinth Lord, Basic Fantasy RPG, OSRIC, Castles & Crusades, Hyperborea, Worlds Without Number, Knave y The Black Hack: líneas impresas completas con sus enlaces; verificar con `just test` (The Black Hack no entra: no consta una línea impresa propia; de Knave, solo la primera edición, sin la segunda por no constar su impresión)
- [x] 6.6 NSR (Into the Odd, Electric Bastionland, Cairn, Mausritter, Mörk Borg, Cy_Borg, Troika!): líneas impresas completas con sus enlaces; verificar con `just test` (Troika! no entra porque no deriva de D&D; se añadió Mythic Bastionland)
- [x] 6.7 Portadas en WebP con miniatura para todos los libros nuevos que la tengan; verificar con el test de portadas

## 7. Afiliados y documentación

- [x] 7.1 Añadir a `scripts/affiliate-coverage.mjs` la regla «otros juegos de rol · drivethrurpg» para las ediciones en inglés de los sistemas con movimiento y anotar en `data/affiliate-exceptions.json` lo que no se venda allí; verificar que `just affiliate-coverage` no deja nada sin revisar
- [x] 7.2 Actualizar la skill `add-rpg`, CLAUDE.md y el README con el movimiento, la línea propia y la regla de edición impresa; verificar que `just format-check` y markdownlint pasan

## 8. Integración

- [x] 8.1 `just check` y `just build` en verde, con las fichas nuevas prerenderizadas y en el sitemap; revisar en el servidor de desarrollo `/rol`, una ficha OSR, una NSR, una licencia de compatibilidad y el árbol en escritorio y móvil
- [x] 8.2 Abrir una sola PR con todo el cambio, descripción breve (qué se hace, qué queda, comprobaciones) y el recuento de sistemas, libros y licencias

## Workflow follow-up

- Archivar el cambio con `/opsx:archive` cuando la PR esté fusionada.
- Cerrar la issue #95.
