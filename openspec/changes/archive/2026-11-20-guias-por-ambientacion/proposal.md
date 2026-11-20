# Proposal

## Why

El catálogo ya tiene casi todo lo publicado de D&D: los libros de todas las
ediciones, las novelas y los videojuegos. Pero quien busca un mundo concreto
(Reinos Olvidados, Ravenloft, Dragonlance…) tiene que recorrer cuatro
secciones. Una guía por ambientación que lo reúna todo es contenido de
referencia que no existe en castellano y lleva a todas las fichas (#112).

## What Changes

- Un campo común `settings` en los libros de 5E y 5.5E y en los de rol, con
  los mismos identificadores de mundo que las novelas y los videojuegos, y
  una lista única de mundos con sus nombres (`src/utils/worlds.ts`).
- Clasificación de los libros: los de AD&D por la ambientación de TSR
  Archive, los de D&D básico de Mystara, los de 3.0, 3.5 y 4E por secciones
  del inventario y título, y los 81 productos de 5E y 5.5E a mano.
- Una guía por mundo en `/guias/ambientacion/:mundo`, generada desde los
  datos, con sus libros por edición, sus novelas (con enlace a su orden de
  lectura si lo hay) y sus videojuegos, y un grupo «Ambientaciones» en
  `/guias`.

## Capabilities

### New Capabilities

- `world-guides`: el campo de ambientación y las guías por mundo.

### Modified Capabilities

Ninguna.

## Impact

- Esquemas `product.jsonschema` y `rpg-book.jsonschema` (campo opcional).
- Unos 610 archivos de datos con el campo nuevo.
- Una página nueva, su ruta, el sitemap y la lista de guías.
