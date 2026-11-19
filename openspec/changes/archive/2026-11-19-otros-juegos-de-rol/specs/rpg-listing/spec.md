# Spec Delta

## Purpose

Define la página de entrada de la sección de otros juegos de rol, con sus
sistemas y sus libros, los filtros y su lugar en la navegación del sitio.

## ADDED Requirements

### Requirement: Página de la sección

El sitio SHALL tener una página en `/rol` que presente los sistemas de la
sección, agrupados por familia, y un listado de sus libros, prerenderizada e
incluida en el sitemap, con un enlace a `/licencias`.

#### Scenario: Entrada a la sección

- **WHEN** un visitante abre `/rol`
- **THEN** ve los sistemas con su editorial y su número de libros, cada uno
  enlazado a su ficha, y un enlace a las licencias abiertas

### Requirement: Contenido de cada libro en el listado

Cada libro del listado SHALL mostrar su portada, su título (en castellano si
lo tiene), su sistema, el año de su edición más reciente y una marca si
tiene edición en castellano, y enlazar a su ficha.

#### Scenario: Libro sin portada

- **WHEN** un libro no tiene portada
- **THEN** su tarjeta muestra la imagen genérica del sitio

### Requirement: Filtros del listado

El listado de libros SHALL permitir filtrar por sistema, por licencia y por
libros con edición en castellano, y combinar los filtros.

#### Scenario: Filtrar por licencia

- **WHEN** el visitante elige la ORC
- **THEN** ve solo los libros de sistemas que usan la ORC o que la indican
  ellos mismos

#### Scenario: Solo en castellano

- **WHEN** el visitante marca «En castellano» y elige Pathfinder 2E
- **THEN** ve solo los libros de Pathfinder 2E con edición en castellano

### Requirement: Búsqueda y orden

El listado SHALL permitir buscar por título original o en castellano y por
editorial, sin distinguir mayúsculas ni tildes, y ordenar por fecha (más
recientes o más antiguos primero) y por título.

#### Scenario: Orden por defecto

- **WHEN** un visitante abre `/rol` sin elegir orden
- **THEN** ve los libros del más reciente al más antiguo

### Requirement: Navegación del sitio

La cabecera SHALL enlazar a la sección con el texto «Otros juegos de rol».

#### Scenario: Enlace en la cabecera

- **WHEN** un visitante abre cualquier página en escritorio o en móvil
- **THEN** la cabecera tiene un enlace «Otros juegos de rol» a `/rol`

### Requirement: Secciones existentes intactas

El catálogo oficial de D&D, sus páginas de edición y el buscador de la
cabecera SHALL seguir funcionando igual; los sistemas y libros de la sección
no aparecen en ellos.

#### Scenario: Buscador de la cabecera

- **WHEN** un visitante busca el título de un libro de Pathfinder
- **THEN** el buscador de la cabecera no lo muestra
