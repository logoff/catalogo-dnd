# home-page Specification

## Purpose

Define qué muestra la portada del catálogo y en qué orden, para que sirva
de punto de partida práctico hacia cada sección y hacia lo más reciente.

## Requirements

### Requirement: Cabecera de la portada

La portada SHALL empezar con un título y una frase que digan qué es el
catálogo, alineados a la izquierda, y un buscador de todo el catálogo que
lleve a la página de resultados `/buscar`. NO SHALL tener un hero centrado
a pantalla completa ni una fila de botones iguales.

#### Scenario: Primera vista en móvil

- **WHEN** se abre la portada a 360 px de ancho
- **THEN** el título, la frase y el buscador caben en la primera pantalla
  sin imagen decorativa encima

#### Scenario: Buscar desde la portada

- **WHEN** se escribe «fiends» en el buscador de la portada
- **THEN** se navega a `/buscar?q=fiends`

### Requirement: Accesos a las secciones

La portada SHALL enlazar a cada sección (libros de 5E, libros de 5.5E,
videojuegos, merchandising, novelas, cómics, otros juegos de rol y guías) con
una tarjeta que diga qué contiene y cuántos elementos tiene. Los recuentos
SHALL ir en esas tarjetas, no en una tira de estadísticas aparte.

#### Scenario: Recuento de novelas

- **WHEN** se muestra la portada
- **THEN** la tarjeta de novelas enlaza a `/novelas` e indica el total de
  novelas del catálogo

#### Scenario: Recuento de cómics

- **WHEN** se muestra la portada
- **THEN** la tarjeta de cómics enlaza a `/comics` e indica el total de
  series del catálogo

#### Scenario: Recuento de otros juegos de rol

- **WHEN** se muestra la portada
- **THEN** la tarjeta de otros juegos de rol enlaza a `/rol` e indica el
  número de sistemas y de libros de la sección

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
