---
name: add-rpg
description: Añadir licencias abiertas, sistemas o libros a la sección «Otros juegos de rol» (Pathfinder, Starfinder, Tales of the Valiant, Daggerheart, 13th Age, Level Up, libros de terceros para 5E). Usa esta skill cuando el usuario quiera dar de alta un juego, una licencia o un libro de la sección, completar una entrada del inventario o cargar un lote.
argument-hint: "[título, sistema o lote del inventario]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch
---

# Añadir a «Otros juegos de rol»

La lista maestra está en `data/rol/inventory.md`: toda licencia, sistema
o libro que se añada debe estar ahí. Si no está, consulta al usuario si
entra según el alcance de `rpg-systems` y `rpg-books` (specs en
`openspec/specs/` o, mientras no se haya archivado la change, en
`openspec/changes/otros-juegos-de-rol/specs/`).

## Argumentos

`$ARGUMENTS`

## Alcance

- **Sistemas de la familia de D&D:** los que derivan de D&D o se publican
  bajo sus licencias abiertas (OGL, SRD, ORC) y los grandes juegos de
  fantasía comparables, como Daggerheart. Fuera: juegos de otras familias
  (La llamada de Cthulhu, Vampiro…).
- **OSR y NSR:** sistemas con `movement` (`osr` si derivan de una edición
  de D&D y siguen siendo compatibles, directamente o a través de otro OSR;
  `nsr` si solo se inspiran en ellas, con derivación `inspiration`). La
  definición no es precisa: ante la duda, pregunta al usuario. Entra todo
  lo publicado en castellano y la línea impresa propia en inglés (la
  editorial del sistema o las de `line_publishers`): suplementos,
  aventuras, cajas y pantallas (`format: screen`). Cada edición lleva
  `format` y al menos una debe ser impresa (vale la impresión bajo
  demanda). Fuera: material de terceros solo en inglés, zines y libros
  solo en PDF. La constancia de la impresión sale de la tienda de la
  editorial, del formato impreso en DriveThruRPG o de un ISBN.
- **Libros:** todo lo publicado o anunciado en castellano de esos
  sistemas; de lo que solo está en inglés, los principales (básicos y caja
  de inicio, con `core: true`) de los sistemas grandes y el catálogo
  impreso principal de las editoriales destacadas (`FEATURED_PUBLISHERS`
  en `src/utils/rpg.ts`, hoy Kobold Press). Sin packs de tienda,
  suscripciones ni contenido solo digital de plataformas comunitarias.
- **Lo oficial de D&D no se duplica:** los sistemas de D&D de 5E tienen
  ficha mínima con `official` y `official_catalog`, y sus libros siguen en
  el catálogo oficial. Los libros de otras editoriales para 5E cuelgan de
  `dnd-5e-2014` o `dnd-5e-2024`.
- **Ediciones anteriores de D&D** (sección `/ediciones`, inventario en su
  propia lista): sistemas con `official: true` y sin `official_catalog`
  (`dnd-3e`, `dnd-3-5`…). Entran todos los libros impresos de Wizards de
  la edición (básicos, cajas de inicio, suplementos, ambientaciones y
  aventuras), aunque solo salieran en inglés; fuera pantallas, hojas de
  personaje, miniaturas, Dungeon Tiles, revistas y material con licencia
  de otras editoriales (Dragonlance de Sovereign Press). **Solo DMsGuild**:
  están descatalogados; si DMsGuild vende el PDF o la impresión bajo demanda
  de Wizards, su enlace va en la edición en inglés (ningún otro). Los básicos llevan sufijo de edición en
  el slug (`players-handbook-3-5`) y `core: true`.

## Reglas de los datos

- **Nada inventado.** Cada dato sale de una fuente citable: la web de la
  editorial o del titular de la licencia y, solo si no existe, una tienda.
  Si no se encuentra, el campo se omite. La web de Devir y algunas otras
  necesitan Chrome; holocubierta.com está bloqueada para la extensión:
  usa tiendas y distribuidoras (SD Distribuciones, Dracotienda, Agapea).
- **Textos propios en castellano**, sin copiar a la editorial ni a las
  tiendas, y siempre en dos párrafos separados por `\n\n`:
  - licencia: qué es y qué permite; qué no permite y quién la usa. Sin
    interpretación jurídica.
  - sistema: qué es y cómo se juega; por qué importa y si está en
    castellano.
  - libro: qué trae; para quién es y con qué se complementa.
- **Licencias:**
  - `kind`: `license` (texto legal), `reference_document` (SRD, con
    `published_under` y la fecha desde la que se publica bajo cada
    licencia) o `community_license` (licencia de un editor para su juego).
  - Al menos un enlace oficial. Los cambios de estado (revocaciones
    anunciadas o retiradas, cambios de versión) van en `status_notes` con
    fecha y fuente.
- **Sistemas:**
  - Una ficha por edición de un juego (`pathfinder-1e`, `pathfinder-2e`),
    con `family` común.
  - `features`: tres o cuatro características cortas.
  - `movement` y `line_publishers` solo en los OSR y NSR (los tests
    comprueban que el OSR llega a D&D sin pasar por `inspiration` y que el
    NSR llega con ella).
  - `licenses`: cada una con `since` (fecha o versión, como «Remaster
    (2023)») y `note` si hace falta. Vacío si no tiene licencia abierta.
  - `derived_from`: solo la relación directa y reconocida, con `kind`
    (`revision`, `compatible`, `major_rewrite`, `inspiration`),
    `via_license` si deriva a través de una licencia y `note` que la
    matice (obligatoria en `inspiration`). Si la relación es difusa, mejor
    `inspiration` con nota que un tipo más fuerte; ante la duda, pregunta
    al usuario.
- **Libros:**
  - Un libro con edición en inglés y en castellano es una sola ficha con
    las dos ediciones (cada una con su editorial, fecha, formato, ISBN y
    portada). Los tomos de una senda de aventuras tienen ficha propia.
  - `license` solo si el libro no usa las licencias de su sistema (por
    ejemplo, un libro del Remaster de Pathfinder 2E usa `orc`) o `none`
    si solo se declara compatible.
  - Portadas en `public/images/rol/<slug>/<idioma>.webp` (600 px de ancho)
    con miniatura `<idioma>-thumb.webp` (240 px), convertidas con `sharp`.
  - **URLs de compra limpias**, sin parámetros de afiliado, y solo a
    tiendas del esquema: `amazon`, `juegos_mesa_redonda`, `nosolorol`,
    `casa_del_libro` y `drivethrurpg` (ediciones anteriores: solo
    `dmsguild`). En los OSR y NSR se revisa DriveThruRPG en las ediciones
    en inglés en lugar de Amazon, y JMR y Casa del Libro en las de
    castellano. `just affiliate-coverage` lista las que faltan; lo
    que se revisa y no está a la venta va con su motivo en
    `data/affiliate-exceptions.json`.
  - **Descarga gratuita:** si La Marca del Este ha liberado el libro en
    Codex de la Marca, la edición en castellano lleva `free_download` con
    la URL de su entrada (`https://codexdelamarca.com/posts/<entrada>/`).
    No es una tienda ni cuenta como enlace de compra; solo si la entrada
    tiene descarga.

## Fuentes recomendadas

- **Ediciones anteriores de D&D:** páginas de producto de wizards.com
  archivadas en archive.org (fecha, ISBN, portada) y, si no hay copia, Open
  Library por ISBN. Las ediciones de Devir ya no están en su web: tiendas,
  distribuidoras o catálogos archivados, solo para título, fecha e ISBN.
- **Paizo:** `store.paizo.com/<producto>/` (fecha, ISBN en la página y
  portada en `og:image`).
- **Devir:** catálogo de cada línea (`devir.es/pathfinder-2-ed`) y su
  buscador (`/catalogsearch/result/?q=`), con Chrome.
- **Nosolorol:** `nosolorol.com/srd-5-edicion` y
  `nosolorol.com/talesofthevaliant`.
- **Kobold Press:** su tienda (`koboldpress.com/kpstore/`) y la lista de
  Wikipedia como apoyo.
- **OSR y NSR:** la tienda de cada editorial (muchas son Shopify:
  `/products.json` da títulos, formatos y portadas), las páginas de
  editorial de DriveThruRPG (fecha, páginas, autores, formatos e ISBN) y,
  para La Marca del Este, su web y su blog (`/wp-json/wp/v2/posts?search=`),
  Tesoros de la Marca, las tiendas españolas y Codex de la Marca
  (`codexdelamarca.com/index.xml` lista todas las entradas).
- **Licencias:** páginas de Wizards y D&D Beyond (OGL, SRD), Paizo
  (ORC), Creative Commons, Kobold Press (Black Flag), Darrington Press
  (DPCGL) y EN Publishing (A5E SRD).

## Pasos

1. **Buscar la entrada en el inventario** y comprobar que entra en el
   alcance.
2. **Dar de alta lo que falte antes**: la licencia antes que el sistema
   que la usa, y el sistema antes que sus libros (los tests exigen que
   todas las referencias existan).
3. **Reunir los datos** con las fuentes de arriba y descargar las
   portadas fuera del repositorio (en el directorio temporal), antes de
   convertirlas.
4. **Escribir el JSON**:
   - `data/rol/licenses/<slug>.json` (`license.jsonschema`)
   - `data/rol/systems/<slug>.json` (`rpg-system.jsonschema`)
   - `data/rol/books/<sistema>/<slug>.json` (`rpg-book.jsonschema`)
5. **Pedir al usuario que revise** las descripciones y las derivaciones.
6. **Marcar la ficha en el inventario**: cambia `pendiente` por el slug en
   la columna «Ficha».
7. **Verificar** con `just check` (esquemas, nombres de archivo,
   referencias, ciclos de derivación, alcance de los libros solo en
   inglés, descripciones, ISBN, portadas, URLs e inventario) y, si hace
   falta, mira la ficha con `just dev` en `/rol/<sistema>/<libro>`,
   `/rol/<sistema>` o `/licencia/<slug>`.

## Ejemplos

- `data/rol/licenses/srd-5-1.json`: documento de referencia publicado
  bajo dos licencias, con su fecha.
- `data/rol/systems/pathfinder-2e.json`: sistema con cambio de licencia
  en una revisión y derivación de su primera edición.
- `data/rol/books/pathfinder-2e/player-core.json`: libro principal con
  edición en inglés y en castellano y licencia propia.
