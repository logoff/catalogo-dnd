# Spec Delta

## MODIFIED Requirements

### Requirement: Alcance de los libros

La sección SHALL incluir todo libro publicado en castellano de un sistema de
la sección y, de lo que solo está en inglés, los libros principales (básicos
y caja de inicio) de los sistemas grandes y el catálogo impreso principal de
las editoriales de 5E destacadas, empezando por Kobold Press. El contenido solo
digital de plataformas comunitarias queda fuera. Los libros oficiales de
Wizards of the Coast no SHALL estar en la sección.

#### Scenario: Suplemento en castellano

- **WHEN** un suplemento de cualquier sistema de la sección se publicó en
  castellano
- **THEN** entra en la sección con sus ediciones en inglés y en castellano

#### Scenario: Suplemento solo en inglés

- **WHEN** un suplemento de un sistema grande solo está en inglés
- **THEN** no entra en la sección

#### Scenario: Básico solo en inglés

- **WHEN** el libro básico de un sistema grande solo está en inglés
- **THEN** entra en la sección marcado como principal

#### Scenario: Libro de Kobold Press solo en inglés

- **WHEN** un libro impreso de Kobold Press para 5E solo está en inglés
- **THEN** entra en la sección, aunque no sea un libro básico

#### Scenario: Libro oficial de una edición anterior de D&D

- **WHEN** un libro es de Wizards of the Coast para D&D 3.5
- **THEN** no aparece en la sección, sino en la de ediciones anteriores

#### Scenario: Libro de Wizards para 5E

- **WHEN** un libro de Wizards of the Coast cuelga de un sistema de 5E de la
  sección
- **THEN** los tests del proyecto fallan

### Requirement: Datos del libro

Cada libro SHALL guardar su sistema, su título original, su tipo de una lista
cerrada (básico, caja de inicio, suplemento, aventura, ambientación u otro),
si es principal y una fuente oficial de la editorial o, solo si no existe,
de una tienda. SHALL poder guardar el título en castellano.

#### Scenario: Sistema inexistente

- **WHEN** un libro indica un sistema que no tiene ficha
- **THEN** los tests del proyecto fallan

#### Scenario: Libro solo en inglés no principal

- **WHEN** un libro de un sistema de la sección no tiene edición en
  castellano, no está marcado como principal y no es de una editorial
  destacada
- **THEN** los tests del proyecto fallan
