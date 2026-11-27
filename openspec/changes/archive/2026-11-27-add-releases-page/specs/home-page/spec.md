# Spec Delta

## MODIFIED Requirements

### Requirement: Lo más reciente

Tras los accesos, la portada SHALL mostrar, cada bloque con su título y un
enlace a la sección:

- las novedades: hasta tres ediciones de «Próximamente» con fecha, de la más
  próxima a la más lejana, y hasta tres de «Recién salido», de la más
  reciente a la más antigua, con enlace a `/novedades`;
- los libros salidos más recientemente en castellano;
- hasta cuatro videojuegos publicados, del más reciente al más antiguo;
- hasta cuatro artículos de merchandising, los más recientes;
- las últimas novelas añadidas;
- las guías.

Un bloque sin elementos NO SHALL mostrarse.

#### Scenario: Bloque de novedades

- **WHEN** se muestra la portada y hay ediciones próximas y recientes
- **THEN** el primer bloque muestra las próximas y las recientes y enlaza
  a `/novedades`

#### Scenario: Sin ediciones próximas

- **WHEN** no hay ninguna edición con fecha futura
- **THEN** el bloque de novedades muestra solo las recientes

#### Scenario: Últimos en castellano

- **WHEN** se muestra la portada
- **THEN** el bloque de libros en castellano lista libros ordenados por su
  fecha de salida en castellano, de la más reciente a la más antigua, sin
  fechas futuras

#### Scenario: Sección sin elementos

- **WHEN** no hay videojuegos publicados
- **THEN** la portada no muestra el bloque de videojuegos
