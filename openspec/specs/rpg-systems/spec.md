# rpg-systems Specification

## Purpose

Define qué sistemas de juego de rol entran en la sección de otros juegos de
rol, qué datos se guardan de cada uno (descripción, características,
licencias y derivaciones) y qué muestra su ficha.

## Requirements

### Requirement: Alcance de los sistemas

La sección SHALL incluir los sistemas de la familia de D&D: los que derivan
de D&D o se publican bajo sus licencias abiertas (OGL, SRD, ORC), los
grandes juegos de fantasía comparables, como Daggerheart, y los juegos de
los movimientos OSR y NSR. De los que no son OSR ni NSR, SHALL incluir los
grandes y cualquiera con un libro en castellano; de los OSR y NSR, todos los
que tengan un libro impreso. Quedan fuera los juegos de otras familias.

#### Scenario: Sistema pequeño en castellano

- **WHEN** un juego derivado de 5E poco conocido tiene un libro publicado en
  castellano
- **THEN** entra en la sección

#### Scenario: Sistema pequeño solo en inglés

- **WHEN** un juego derivado de 5E poco conocido solo está en inglés
- **THEN** no entra en la sección

#### Scenario: Juego de otra familia en castellano

- **WHEN** un juego de rol sin relación con D&D, como La llamada de
  Cthulhu, está publicado en castellano
- **THEN** no entra en la sección

#### Scenario: Retroclon solo en inglés

- **WHEN** un retroclon de D&D básico tiene libros impresos solo en inglés
- **THEN** entra en la sección con la etiqueta OSR

#### Scenario: Juego NSR

- **WHEN** un juego de la escena NSR inspirado en D&D, como Mörk Borg, tiene
  libros impresos
- **THEN** entra en la sección con la etiqueta NSR

### Requirement: Una ficha por edición

Cada edición de un juego con reglas distintas SHALL ser un sistema propio,
y SHALL indicar la familia a la que pertenece para agrupar las ediciones del
mismo juego.

#### Scenario: Ediciones de Pathfinder

- **WHEN** se dan de alta Pathfinder 1E y Pathfinder 2E
- **THEN** son dos sistemas de la misma familia, cada uno con su ficha

### Requirement: Datos del sistema

Cada sistema SHALL guardar su nombre, su editorial, su año de salida y al
menos un enlace oficial.

#### Scenario: Sistema sin editorial

- **WHEN** un sistema no indica editorial
- **THEN** los tests del proyecto fallan

### Requirement: Descripción y características

Cada sistema SHALL tener una descripción propia en castellano de qué es y
cómo se juega, y una lista corta de sus características principales (por
ejemplo, dados que usa, tipo de ambientación o mecánica distintiva), sin
copiar textos de la editorial.

#### Scenario: Sistema sin características

- **WHEN** un sistema no tiene características
- **THEN** los tests del proyecto fallan

### Requirement: Licencias del sistema

Un sistema SHALL poder indicar las licencias abiertas que usa, cada una con
desde qué versión o fecha, porque puede cambiar de licencia entre revisiones.
Cada licencia indicada SHALL tener ficha. Un sistema sin licencia abierta lo
SHALL mostrar así.

#### Scenario: Cambio de licencia en una revisión

- **WHEN** un sistema pasó de una licencia a otra en una revisión
- **THEN** su ficha muestra las dos, cada una con su versión o fecha

#### Scenario: Licencia sin ficha

- **WHEN** un sistema indica una licencia que no tiene ficha
- **THEN** los tests del proyecto fallan

#### Scenario: Sistema cerrado

- **WHEN** un sistema no usa ninguna licencia abierta
- **THEN** su ficha indica que no tiene licencia abierta

### Requirement: Derivaciones con su tipo

Un sistema SHALL poder indicar de qué sistemas deriva directamente, cada
derivación con su tipo de una lista cerrada (revisión menor, reescrito pero
compatible, cambio mayor de reglas o inspiración), la licencia por la que
deriva si la hay y una nota que la matice.

#### Scenario: Derivación por una licencia

- **WHEN** Pathfinder 1E deriva de D&D 3.5 a través de la OGL 1.0a
- **THEN** su ficha lo muestra como cambio mayor de reglas, con la licencia
  y la nota

#### Scenario: Inspiración sin nota

- **WHEN** una derivación de tipo inspiración no tiene nota
- **THEN** los tests del proyecto fallan

#### Scenario: Derivación circular

- **WHEN** dos sistemas derivan uno del otro, directa o indirectamente
- **THEN** los tests del proyecto fallan

### Requirement: D&D como sistema enlazado

Las ediciones de D&D con catálogo oficial en el sitio (5E) SHALL poder ser
sistemas de la sección, con su descripción, sus licencias y sus
derivaciones, pero su ficha SHALL enlazar al catálogo oficial del sitio en
lugar de listar libros oficiales. Las ediciones anteriores no SHALL estar en
la sección: tienen la suya propia en `/ediciones`.

#### Scenario: Ficha de D&D 5E

- **WHEN** un visitante abre la ficha de D&D 5E (2014) en la sección
- **THEN** ve un enlace a `/2014` y ningún libro oficial duplicado

#### Scenario: Libro de terceros para 5E

- **WHEN** un libro de otra editorial es para D&D 5E
- **THEN** aparece en la ficha del sistema D&D 5E de la sección

#### Scenario: Edición anterior de D&D

- **WHEN** un visitante abre `/rol/dnd-3-5`
- **THEN** llega a la ficha de D&D 3.5 en `/ediciones/dnd-3-5`

### Requirement: Ficha del sistema

El sitio SHALL tener una ficha por sistema en `/rol/:sistema`, con su
descripción, sus características, sus datos, sus licencias enlazadas, sus
derivaciones en los dos sentidos (de qué deriva y qué deriva de él), las
otras ediciones de su familia y sus libros. Una derivación de una edición
anterior de D&D SHALL enlazar a su ficha en `/ediciones`.

#### Scenario: Sistemas derivados

- **WHEN** un visitante abre la ficha de Pathfinder 1E
- **THEN** ve Starfinder 1E entre los sistemas que derivan de él

#### Scenario: Derivación de una edición anterior de D&D

- **WHEN** un visitante abre la ficha de Pathfinder 1E
- **THEN** ve que deriva de D&D 3.5, enlazado a `/ediciones/dnd-3-5`

#### Scenario: Sistema inexistente

- **WHEN** un visitante abre `/rol/` con un sistema que no existe
- **THEN** ve la página de no encontrado

### Requirement: Separación del catálogo oficial

Las fichas de sistema y de libro SHALL distinguirse a simple vista de las
del catálogo oficial de D&D e indicar que no son productos de Wizards of the
Coast, salvo las fichas de los sistemas de D&D.

#### Scenario: Ficha de Pathfinder

- **WHEN** un visitante abre la ficha de Pathfinder 2E
- **THEN** ve el nombre de la sección y una indicación de que no es D&D
  oficial

### Requirement: Prerenderizado y metadatos de los sistemas

Cada ficha de sistema SHALL prerenderizarse, entrar en el sitemap y tener
título y descripción propios.

#### Scenario: Ficha en el sitemap

- **WHEN** se genera el build
- **THEN** el sitemap incluye `/rol/:sistema` de cada sistema
