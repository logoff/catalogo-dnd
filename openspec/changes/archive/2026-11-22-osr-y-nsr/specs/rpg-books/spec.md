# Spec Delta

## MODIFIED Requirements

### Requirement: Alcance de los libros

La sección SHALL incluir todo libro publicado en castellano de un sistema de
la sección y, de lo que solo está en inglés, los libros principales (básicos
y caja de inicio) de los sistemas grandes y el catálogo impreso principal de
las editoriales de 5E destacadas, empezando por Kobold Press. Los sistemas
OSR y NSR siguen su propia regla de alcance. El contenido solo digital de
plataformas comunitarias queda fuera. Los libros oficiales de Wizards of the
Coast no SHALL estar en la sección.

#### Scenario: Suplemento en castellano

- **WHEN** un suplemento de cualquier sistema de la sección se publicó en
  castellano
- **THEN** entra en la sección con sus ediciones en inglés y en castellano

#### Scenario: Suplemento solo en inglés

- **WHEN** un suplemento de un sistema grande que no es OSR ni NSR solo está
  en inglés
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

- **WHEN** un libro de un sistema de la sección que no es OSR ni NSR no
  tiene edición en castellano, no está marcado como principal y no es de una
  editorial destacada
- **THEN** los tests del proyecto fallan

## ADDED Requirements

### Requirement: Alcance de los libros OSR y NSR

De un sistema OSR o NSR SHALL entrar todo libro con edición en castellano y
toda la línea impresa en inglés de la editorial del sistema (básicos,
suplementos, aventuras, cajas y pantallas). Un libro solo en inglés de otra
editorial no SHALL entrar, ni un libro sin ninguna edición impresa.

#### Scenario: Suplemento de la línea propia

- **WHEN** Necrotic Gnome publica un suplemento impreso de Old-School
  Essentials solo en inglés
- **THEN** entra en la sección

#### Scenario: Aventura de terceros en castellano

- **WHEN** una editorial española publica una aventura para Old-School
  Essentials
- **THEN** entra en la sección

#### Scenario: Suplemento de terceros solo en inglés

- **WHEN** un libro de un sistema OSR solo tiene edición en inglés de una
  editorial distinta de la del sistema
- **THEN** los tests del proyecto fallan

#### Scenario: Zine solo en PDF

- **WHEN** un libro de un sistema NSR solo tiene ediciones en PDF
- **THEN** los tests del proyecto fallan

#### Scenario: Impresión bajo demanda

- **WHEN** un libro de la línea propia solo se vende impreso bajo demanda
- **THEN** cuenta como edición impresa y entra en la sección
