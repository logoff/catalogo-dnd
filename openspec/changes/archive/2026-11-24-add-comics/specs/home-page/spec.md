# Spec Delta

## MODIFIED Requirements

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
