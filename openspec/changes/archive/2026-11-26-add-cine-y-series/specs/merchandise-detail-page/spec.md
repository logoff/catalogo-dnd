# Spec Delta

## MODIFIED Requirements

### Requirement: Contenido relacionado

La ficha SHALL enlazar a los libros, videojuegos y obras de cine y series del
catálogo con los que esté relacionado el artículo, si los hay.

#### Scenario: Figura de un videojuego

- **WHEN** un artículo está relacionado con _Baldur's Gate 3_
- **THEN** la ficha enlaza a `/videojuego/baldurs-gate-3`

#### Scenario: Figura de una película

- **WHEN** un artículo está relacionado con _Honor entre ladrones_
- **THEN** la ficha enlaza a `/cine-y-series/<slug>` de esa película
