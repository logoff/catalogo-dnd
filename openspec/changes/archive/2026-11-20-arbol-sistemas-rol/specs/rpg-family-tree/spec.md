# Spec Delta

## Purpose

Mostrar en una sola página cómo se relacionan las ediciones de D&D y los
juegos de su familia, a partir de las derivaciones de sus fichas.

## ADDED Requirements

### Requirement: Árbol genealógico de sistemas

El sitio SHALL tener una página en `/rol/arbol` con todos los sistemas de
`data/rol/systems/` ordenados por fecha, cada uno con su nombre, su año y sus
licencias abiertas, y cada derivación dibujada como una línea entre el
sistema padre y el derivado, con un trazo distinto por tipo y una leyenda.

#### Scenario: Derivación tipada

- **WHEN** un visitante abre `/rol/arbol`
- **THEN** ve una línea de Pathfinder 1E a Pathfinder 2E con el trazo de
  «cambio mayor de reglas»

#### Scenario: Sistema nuevo

- **WHEN** se añade una ficha de sistema con su derivación
- **THEN** el árbol la muestra en su año sin tocar el código

### Requirement: Enlaces del árbol

Cada sistema del árbol SHALL enlazar a su ficha: las ediciones anteriores de
D&D a `/ediciones`, la 5E a su catálogo oficial y los demás a `/rol`.

#### Scenario: Edición anterior

- **WHEN** un visitante pulsa AD&D 2.ª edición en el árbol
- **THEN** llega a `/ediciones/dnd-add2`

### Requirement: Acceso y prerenderizado del árbol

`/rol` y `/ediciones` SHALL enlazar al árbol, y la página SHALL
prerenderizarse y entrar en el sitemap con título y descripción propios.

#### Scenario: Sitemap

- **WHEN** se genera el build
- **THEN** el sitemap incluye `/rol/arbol`
