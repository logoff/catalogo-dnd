# Spec Delta

## MODIFIED Requirements

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
