# Proposal

## Why

Las fichas de sistema ya guardan de qué deriva cada juego y con qué tipo de
relación (#94), pero esa información solo se ve de dos en dos, en cada ficha.
Un árbol con todas las ediciones de D&D y los juegos de su familia, al estilo
de los diagramas de ediciones que circulan entre aficionados, es contenido de
referencia que se comparte y enlaza, y lleva a las fichas de sistemas y
licencias (#99).

## What Changes

- Página nueva en `/rol/arbol` con el árbol genealógico de todos los
  sistemas de la sección y de las ediciones de D&D, generado desde los datos
  de derivación: cada sistema en su año, cada derivación como una línea con
  su tipo (revisión, reescrito pero compatible, cambio mayor, inspiración) y
  la licencia abierta de cada sistema.
- Cada sistema del árbol enlaza a su ficha (o al catálogo oficial en la 5E).
- Enlaces al árbol desde `/rol` y `/ediciones`.
- La 5E (2014) pasa a derivar de la 4.ª edición, para que la línea oficial de
  D&D no quede cortada.

## Capabilities

### New Capabilities

- `rpg-family-tree`: el árbol genealógico de sistemas.

### Modified Capabilities

Ninguna.

## Impact

- Datos: una derivación nueva en `data/rol/systems/dnd-5e-2014.json`.
- Código: lógica pura de colocación del árbol, una página, una ruta, el
  sitemap y dos enlaces.
