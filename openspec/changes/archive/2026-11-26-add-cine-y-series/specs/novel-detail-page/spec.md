# Spec Delta

## MODIFIED Requirements

### Requirement: Contenido relacionado

La ficha SHALL enlazar a los libros, videojuegos, artículos de merchandising y
obras de cine y series del catálogo con los que esté relacionada la novela, si
los hay.

#### Scenario: Novela ligada a un videojuego

- **WHEN** una novela está relacionada con _Baldur's Gate 3_
- **THEN** la ficha enlaza a `/videojuego/baldurs-gate-3`

#### Scenario: Novelización de una película

- **WHEN** una novela es la novelización de una película del catálogo
- **THEN** la ficha enlaza a `/cine-y-series/<slug>` de esa película
