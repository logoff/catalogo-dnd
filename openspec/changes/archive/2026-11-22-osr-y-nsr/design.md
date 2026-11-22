# Design

## Context

«Otros juegos de rol» tiene 19 sistemas en `data/rol/systems/`
(`rpg-system.jsonschema`), sus libros en `data/rol/books/<sistema>/`
(`rpg-book.jsonschema`) y sus licencias en `data/rol/licenses/`. Las páginas
leen de `virtual:rpg-index` (licencias, sistemas y un resumen de cada libro) y
de un trozo por libro. Las ediciones antiguas de D&D (original, básico, AD&D
1.ª y 2.ª, 3.0, 3.5 y 4E) ya son sistemas, que viven en `/ediciones`, y el
árbol (`/rol/arbol`, `src/utils/rpgTree.ts`) coloca cada sistema en una
columna por línea evolutiva y una fila por fecha.

Hoy el alcance de los libros lo vigila un test en `rpgLoader.test.ts`: un
libro solo en inglés tiene que ser principal o de una editorial de
`FEATURED_PUBLISHERS`. Los filtros de `/rol` (`rpgFilters.ts`) son estado de
React: sistema, licencia, búsqueda y castellano. DriveThruRPG ya está en
`stores.ts` y en el esquema de los libros de rol.

## Goals / Non-Goals

**Goals:**

- Añadir OSR y NSR con el mínimo de modelo nuevo, reutilizando sistemas,
  libros, licencias, árbol y fichas.
- Que las reglas de alcance (derivación de D&D, línea propia, edición impresa)
  las comprueben los tests, no la memoria de quien cataloga.
- Cargar todo en un solo cambio con `just check` en verde.

**Non-Goals:**

- Una página o ruta nueva (`/osr`) o una guía aparte: la explicación va en
  `/rol`.
- Cambiar el aspecto de las fichas, salvo la etiqueta de movimiento.
- Material de terceros solo en inglés y zines solo en PDF.

## Decisions

### Movimiento como campo del sistema

`rpg-system.jsonschema` gana `movement: "osr" | "nsr"`, opcional. No se usa
`family`, porque `family` agrupa las ediciones de un mismo juego (Mörk Borg y
Cy_Borg son familias distintas, ambas NSR) y el árbol y la ficha ya dependen de
ese significado. Tampoco se crean etiquetas libres: una lista cerrada se puede
validar y filtrar.

### Comprobación de la derivación

`src/utils/rpg.ts` gana una función pura que recorre `derived_from` hacia
arriba y dice si un sistema llega a una edición de D&D (`official: true`),
admitiendo o no la inspiración. Los tests la usan con las reglas de
`rpg-movements`: OSR sin inspiración, NSR con ella. Ya existe la comprobación
de ciclos, así que el recorrido termina.

### Línea propia y edición impresa

- La línea propia de un juego es la de la editorial de su sistema. Algunos
  juegos tienen más de una editorial propia (Mörk Borg: Free League y
  Ockult Örtmästare; Swords & Wizardry: Frog God Games y Mythmere Games), así
  que el sistema gana `line_publishers` opcional, que por defecto es
  `[publisher]`.
- En los sistemas con movimiento, cada edición SHALL indicar `format`, que hoy
  es opcional, y un libro necesita al menos una edición que no sea `pdf`. La
  impresión bajo demanda se registra como `paperback` o `hardcover`.
- El test de alcance actual se divide: los sistemas sin movimiento siguen la
  regla de principal o editorial destacada; los que tienen movimiento, la de
  castellano o línea propia, más la de la edición impresa.

_Alternativa descartada:_ marcar a mano cada libro como «de la línea propia».
Es redundante con la editorial de la edición y fácil de olvidar.

### Explicación y grupo en `/rol`

Un componente con el texto de los movimientos, propio y en castellano, va en
`RpgSectionPage` con el ancla `#osr-y-nsr`, encabezando el grupo de sistemas
OSR y NSR. El texto vive en el código, no en los datos, porque es parte de la
página. La lista de familias se parte en dos: las familias sin movimiento,
como ahora, y después las de OSR y NSR, cada sistema con su etiqueta. La ficha
de sistema muestra una insignia (`Badge`) que enlaza a `/rol#osr-y-nsr`.

_Alternativa descartada:_ una guía en `/guias/osr-y-nsr`. Da más
posicionamiento, pero aleja la explicación de los juegos. Se puede sacar
después sin cambiar los datos.

### Filtro por movimiento

`RpgFilters` gana `movement` (vacío, `osr` o `nsr`), igual que `system` y
`license`. El resumen de cada libro en `virtual:rpg-index` gana el movimiento
de su sistema, para filtrar sin buscar el sistema en cada tarjeta.

### Árbol

Los nuevos sistemas salen solos en el árbol, por sus derivaciones. Con unos 20
sistemas más habrá más columnas; la página ya tiene desplazamiento horizontal.
Si el árbol queda ilegible, se añade un control para ocultar o mostrar OSR y
NSR, sin tocar el algoritmo de columnas.

### Catalogación

- Inventario de partida, a confirmar con fuentes al catalogar. OSR:
  Old-School Essentials y Dolmenwood (Necrotic Gnome), Labyrinth Lord, Basic
  Fantasy RPG, Swords & Wizardry, OSRIC, Castles & Crusades, Dungeon Crawl
  Classics, Shadowdark, Lamentations of the Flame Princess, Hyperborea, Worlds
  Without Number, Knave, The Black Hack, Aventuras en la Marca del Este y los
  retroclones españoles que tengan libro impreso. NSR: Into the Odd, Electric
  Bastionland, Cairn, Mausritter, Mörk Borg, Cy_Borg y Troika!.
- Fuentes: web de cada editorial; listados de DriveThruRPG por editorial,
  recorridos en Chrome como en #142; en castellano, la web de cada editorial y
  las tiendas. Cada derivación lleva su nota y su fuente, como hoy.
- Enlaces: DriveThruRPG en las ediciones en inglés que vende (PDF o impresión
  bajo demanda); Juegos de la Mesa Redonda, Casa del Libro y NoSoloRol en las
  de castellano cuando los vendan; Amazon en los impresos.
- `just affiliate-coverage` gana la regla «otros juegos de rol ·
  drivethrurpg» para las ediciones en inglés de los sistemas con movimiento,
  con excepciones para lo que no esté a la venta allí.
- La skill `add-rpg` recoge las reglas nuevas, para que las altas futuras las
  sigan.

## Risks / Trade-offs

- [Volumen: 500-700 libros en una sola PR] → Commits por sistema o editorial y
  `just check` tras cada uno. La PR se revisa por muestreo con la lista del
  inventario.
- [Frontera OSR/NSR discutible] → La etiqueta es una orientación y la
  explicación lo dice. Cada derivación lleva nota y fuente, y la inspiración
  exige nota.
- [Datos inventados en editoriales pequeñas] → Solo entra lo que confirme una
  fuente. Sin fuente para la edición en castellano, no se da de alta.
- [El árbol pierde legibilidad] → Control para ocultar OSR y NSR si hace
  falta. Es un ajuste de presentación.
- [Portadas: cientos de imágenes nuevas] → El mismo flujo de WebP con
  miniatura y la imagen genérica del sitio para lo que no tenga portada.
- [Peso del índice `virtual:rpg-index`] → El resumen de libro es ligero.
  Revisar el tamaño del trozo tras la carga y, si crece demasiado, recortar
  campos del resumen.

## Migration Plan

No hay migración. Los campos nuevos son opcionales y los sistemas actuales no
cambian. Se despliega con la PR; deshacerlo es revertirla.

## Open Questions

- Qué retroclones españoles tienen libro impreso y quién los edita hoy (la
  Marca del Este ha cambiado de editorial). Se resuelve al catalogar.
- Qué editoriales publican de verdad una licencia de compatibilidad. Si alguna
  no la publica, su sistema queda sin licencia abierta, como dice la spec.
