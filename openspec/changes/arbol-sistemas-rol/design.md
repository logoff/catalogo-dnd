# Design

## Context

Hay 19 sistemas, de D&D original (1974) a Starfinder 2E (2025). Cada uno
tiene fecha y una lista `derived_from` con el sistema padre y el tipo de
relación. Llegan al navegador en `virtual:rpg-index`, que `/rol/*` ya
precarga antes de hidratar.

## Goals / Non-Goals

**Goals:**

- Un árbol legible en escritorio y usable en móvil, generado solo desde los
  datos, sin colocar nada a mano.
- Que añadir un sistema o una derivación lo coloque solo.

**Non-Goals:**

- Librerías de grafos o de diagramas: el árbol es pequeño y un SVG propio
  basta.
- Mostrar los libros: el árbol es de sistemas.

## Decisions

- **Una fila por sistema, por orden de fecha, y columnas como líneas
  evolutivas.** Con el tiempo en el eje horizontal las etiquetas chocan
  cuando dos sistemas salen el mismo año (D&D básico y AD&D en 1977). Con
  una fila por sistema nunca se solapan y el orden de arriba abajo sigue
  siendo cronológico. Las décadas se marcan a la izquierda.
- **Columnas por herencia.** Un sistema ocupa la columna de su primer padre
  si nadie ha continuado aún esa línea; si no, la primera columna libre. La
  línea oficial de D&D va siempre en la primera columna.
- **Tipo de relación por el trazo, no por el color.** El rojo del sistema de
  diseño está reservado (acción, castellano, activo, foco), así que las
  derivaciones se distinguen por trazo continuo, discontinuo, grueso o de
  puntos, con su leyenda. Las ediciones oficiales de D&D llevan borde de
  texto y las demás, borde suave.
- **Lógica pura aparte** (`src/utils/rpgTree.ts`) con tests, y la página
  solo dibuja.
- **Móvil:** el SVG mantiene su ancho y su contenedor se desplaza en
  horizontal, sin desbordar la página.

## Risks / Trade-offs

- Con muchos más sistemas el árbol crecería hacia abajo, una fila por
  sistema. Con decenas sigue siendo legible.
