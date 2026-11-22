# Spec Delta

## MODIFIED Requirements

### Requirement: Filtros del listado

El listado de libros SHALL permitir filtrar por sistema, por licencia, por
movimiento (OSR o NSR) y por libros con edición en castellano, y combinar los
filtros.

#### Scenario: Filtrar por licencia

- **WHEN** el visitante elige la ORC
- **THEN** ve solo los libros de sistemas que usan la ORC o que la indican
  ellos mismos

#### Scenario: Solo en castellano

- **WHEN** el visitante marca «En castellano» y elige Pathfinder 2E
- **THEN** ve solo los libros de Pathfinder 2E con edición en castellano

#### Scenario: Filtrar por movimiento

- **WHEN** el visitante elige OSR y marca «En castellano»
- **THEN** ve solo los libros con edición en castellano de sistemas con la
  etiqueta OSR

## ADDED Requirements

### Requirement: Sistemas OSR y NSR agrupados

La página `/rol` SHALL presentar los sistemas OSR y NSR en un grupo propio,
separado del resto de familias, junto al texto que explica los movimientos.

#### Scenario: Grupo propio

- **WHEN** un visitante abre `/rol`
- **THEN** ve los sistemas OSR y NSR juntos en su grupo, cada uno con su
  etiqueta, y la explicación de que la definición no es precisa
