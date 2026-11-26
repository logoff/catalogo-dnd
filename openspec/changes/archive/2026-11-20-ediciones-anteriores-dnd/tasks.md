# Tasks

## 1. Inventario

- [x] 1.1 Añadir a `data/rol/inventory.md` la licencia `srd-3-0` y dos listas
      nuevas, «Ediciones anteriores de D&D» (`dnd-3e`, `dnd-3-5`) y sus
      libros. Incluir los tres básicos de 3.0 y todo el catálogo impreso de
      Wizards para 3.5 (julio de 2003 a 2008): básicos, suplementos,
      ambientaciones y aventuras, sin miniaturas, Dungeon Tiles, cartas,
      revistas ni material con licencia de otras editoriales. Cada entrada
      con su fuente (Wikipedia y wizards.com archivada), su tipo, si salió
      con Devir (o «por confirmar») y la ficha en `pendiente`. Verificar
      que cada entrada tiene fuente
- [x] 1.2 Revisar el inventario con el usuario (lista, tipos, ediciones en
      castellano y orden de las tandas) y dejarlo aprobado

## 2. Modelo y URLs

- [x] 2.1 Añadir `official` a `rpg-system.jsonschema` y a `src/types/rpg.ts`
      y marcarlo en `dnd-5e-2014`, `dnd-5e-2024` y `dnd-3-5`. Añadir
      `isDndEdition`, `systemPath` y `bookPath` a `src/utils/rpg.ts`, con
      tests unitarios
- [x] 2.2 Añadir a `rpgLoader.test.ts` los tests de `official` solo en D&D,
      `official_catalog` exige `official`, ningún libro de Wizards en un
      sistema con `official_catalog` y ningún libro de una edición con
      `purchase_links`. Excluir las ediciones del test de alcance de libros
      solo en inglés y hacer que el test de inventario lea las listas
      nuevas. Verificar que fallan con fichas de prueba inválidas y pasan
      con los datos reales
- [x] 2.3 Sustituir las URLs `/rol/${…}` escritas a mano en las páginas, en
      `RpgBookCard`, en `RpgSection` y en `LicenseDetailPage` por
      `systemPath` y `bookPath`. Verificar con `just test` y con
      `grep -rn '/rol/\${' src` sin resultados fuera de `rpg.ts`

## 3. Sección de ediciones anteriores

- [x] 3.1 Parametrizar `RpgSystemPage`, `RpgBookPage` y `RpgPage` por
      sección (otros juegos de rol o ediciones anteriores: migas, aviso,
      textos y libros agrupados por tipo) para reutilizarlas en las fichas
      de `/ediciones`, sin cambiar su salida en `/rol`. Verificar con los
      tests de las dos páginas sin tocar sus aserciones
- [x] 3.2 Crear `DndEditionsPage` (`/ediciones`) y dar de alta las rutas
      `/ediciones/:edicion` y `/ediciones/:edicion/:libro` con
      `RpgSystemPage` y `RpgBookPage` en `section="ediciones"` (libros
      agrupados por tipo, sin aviso de «no oficial», no encontrado para lo
      que no sea de la sección) y su precarga en `preloadRpgRoute`.
      Verificar con tests de componentes que cubran los escenarios de
      `dnd-editions`
- [x] 3.3 Añadir «Ediciones anteriores» al grupo «Libros» de `Header.tsx` y
      ampliar su test. Verificar en escritorio y móvil con `just dev`
- [x] 3.4 Excluir las ediciones y sus libros de `/rol` (sistemas, listado,
      filtros), de `virtual:rpg-stats` y de los libros de la ficha de
      licencia. En `RpgSystemPage`, redirigir con `<Navigate replace>` a
      `/ediciones/:edicion` y devolver no encontrado en `RpgBookPage`.
      Verificar con tests de `RpgSectionPage`, `LicenseDetailPage` y
      `RpgSystemPage`
- [x] 3.5 Generar en `generate-sitemap.mjs` las URLs de `/ediciones` y quitar
      las de `/rol` de las ediciones. Dar a `feed.mjs` la ruta nueva con un
      test en `scripts/feed.test.mjs`. Crear `public/_redirects` con
      `/rol/dnd-3-5 /ediciones/dnd-3-5 301`. Verificar con `just build` que
      el sitemap y `dist/` tienen las páginas nuevas, que no hay
      `dist/rol/dnd-3-5.html` y que `dist/_redirects` existe
- [x] 3.6 Omitir los libros de las ediciones en
      `scripts/affiliate-coverage.mjs`. Verificar con
      `just affiliate-coverage`
- [x] 3.7 Actualizar `CLAUDE.md` (rutas, sección nueva y `official`) y la
      skill `add-rpg` (ediciones anteriores: alcance, sin tiendas, fuentes
      de wizards.com archivada y Devir, slugs con sufijo). Verificar con
      `just format-check`

## 4. Licencia, ediciones y básicos (primera PR)

- [x] 4.1 Crear `data/rol/licenses/srd-3-0.json` (bajo `ogl-1-0a`, con la
      OGL 1.0 inicial en la descripción si se confirma) con enlace oficial o
      copia archivada. Verificar con `just test`
- [x] 4.2 Crear `data/rol/systems/dnd-3e.json` (`official`, fecha con
      fuente, `srd-3-0`, descripción en dos párrafos y tres o cuatro
      características) y revisar `dnd-3-5.json` (`derived_from` `dnd-3e`
      como `revision` con nota, descripción). Pedir al usuario que revise
      descripciones y derivación. Verificar en `just dev` que
      `/ediciones/dnd-3e` muestra D&D 3.5 como revisión y que
      `/rol/pathfinder-1e` enlaza a `/ediciones/dnd-3-5`
- [x] 4.3 Dar de alta los tres básicos de 3.0 y los tres de 3.5 con sus
      ediciones en inglés y de Devir y sus portadas, sin enlaces de compra.
      Marcar el inventario. Verificar con `just check`
- [x] 4.4 Hacer `just build`, revisar en `just dev` las tres páginas nuevas y
      `/rol`, y abrir la primera PR (grupos 1 a 4)

## 5. Catálogo de 3.5 por tandas

- [x] 5.1 Tanda de suplementos de reglas generales (Monster Manual III a V,
      Player's Handbook II, Dungeon Master's Guide II, Unearthed Arcana,
      compendios, psiónica, sistemas nuevos de Incarnum, Tome of Magic y
      Tome of Battle, Book of Exalted Deeds, Miniatures Handbook y Weapons
      of Legacy; el Monster Manual II es de 3.0). Marcar el inventario,
      verificar con `just check` y abrir su PR
- [x] 5.2 Tanda del resto de suplementos de reglas: las series Complete y
      Races of y los libros de entornos, monstruos y temas (Frostburn,
      Sandstorm, Stormwrack, Libris Mortis, Draconomicon, Fiendish Codex,
      Heroes of Battle…). Marcar el inventario, verificar con `just check` y
      abrir su PR
- [x] 5.3 Tanda de Reinos Olvidados para 3.5. Marcar el inventario,
      verificar con `just check` y abrir su PR
- [x] 5.4 Tanda de Eberron. Marcar el inventario, verificar con
      `just check` y abrir su PR
- [x] 5.5 Tanda de aventuras y del resto, hasta que no quede ningún libro de
      3.5 en `pendiente`. Verificar con `just check` y con el inventario sin
      pendientes de 3.5, y abrir su PR

## Workflow follow-up

- Tras el despliegue de la primera PR, comprobar con
  `curl -I https://catalogodnd.es/rol/dnd-3-5` que redirige con 301.
- Comentar el avance en #100 tras cada PR.
- Archivar la change cuando no quede ningún libro de 3.5 pendiente y dejar
  #100 abierta para OD&D, Basic, AD&D, 4E y el resto de 3.0.
