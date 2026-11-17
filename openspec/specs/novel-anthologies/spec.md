# novel-anthologies Specification

## Purpose

Recoge las antologías oficiales de relatos de D&D, con sus ediciones en
inglés y en castellano, como libros relacionados con las series y
novelas de la sección, sin ficha propia.

## Requirements

### Requirement: Alcance de las antologías

El catálogo SHALL recoger las antologías oficiales de relatos de D&D
publicadas en inglés: las de la lista de ficción de D&D de Wikipedia y
cualquier otra antología oficial que se añada al inventario. Una
antología que aparece dos veces en la lista con el mismo libro SHALL
constar una sola vez.

#### Scenario: Antología de la lista de Wikipedia

- **WHEN** una antología figura en la lista de Wikipedia, como _Realms
  of Valor_
- **THEN** consta en el catálogo de antologías

#### Scenario: Antología repetida en la lista

- **WHEN** la lista incluye _Dragons: Worlds Afire_ dos veces con el
  mismo libro
- **THEN** la antología consta una sola vez

### Requirement: Datos de la antología

Cada antología SHALL tener título original, título en castellano si se
tradujo, mundo (o varios, si mezcla mundos), una descripción propia en
castellano, una fuente que confirme que es oficial y al menos una
edición en inglés. Sus ediciones SHALL seguir las mismas reglas que las
de las novelas (idioma, editorial, fecha, formato, ISBN válido, país o
publicación en España, portada local y URLs de compra limpias).

#### Scenario: Antología traducida

- **WHEN** una antología se publicó también en castellano
- **THEN** consta con su título en castellano y con cada edición en
  castellano, indicando si salió en España

#### Scenario: Edición con ISBN inválido

- **WHEN** una edición de una antología tiene un ISBN con dígito de
  control erróneo
- **THEN** los tests del proyecto fallan

### Requirement: Relación con series y novelas

Cada antología SHALL relacionarse con al menos una serie o novela que
tenga ficha: las series cuyos personajes o historias continúan sus
relatos y, si solo afecta a algunas novelas, esas novelas concretas.
Toda serie y novela indicada SHALL existir.

#### Scenario: Antología de una serie

- **WHEN** _Realms of the Elves_ continúa la serie _The Last Mythal_
- **THEN** la antología se relaciona con esa serie

#### Scenario: Referencia a una serie inexistente

- **WHEN** una antología indica una serie que no existe
- **THEN** los tests del proyecto fallan

### Requirement: Sin ficha propia

Las antologías SHALL NOT tener página propia ni aparecer en el listado
de novelas, en el buscador ni en el sitemap.

#### Scenario: Listado de novelas

- **WHEN** el usuario abre `/novelas`
- **THEN** el listado no muestra antologías

### Requirement: Inventario de antologías

El inventario maestro SHALL incluir una sección de antologías, y los
tests SHALL fallar si una antología del inventario no tiene datos o si
hay datos de una antología que no está en el inventario.

#### Scenario: Antología sin inventariar

- **WHEN** se añade una antología a los datos sin anotarla en el
  inventario
- **THEN** los tests del proyecto fallan
