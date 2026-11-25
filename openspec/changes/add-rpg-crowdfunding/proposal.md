# Proposal

## Why

Buena parte del rol español de la familia de D&D (retroclones, juegos OSR
pequeños, libros de aventuras) nace en campañas de micromecenazgo en
Verkami o Kickstarter, y en «Otros juegos de rol» faltan varios de esos
juegos (issue #160). Además de darlos de alta, conviene contar de dónde salió
cada libro y avisar en `/novedades` mientras la campaña está abierta, que es
cuando se puede conseguir, y no solo cuando llega a las tiendas.

## What Changes

- Cada edición de un libro de rol puede llevar la campaña de micromecenazgo
  con la que se financió o se está financiando: plataforma (lista cerrada:
  Verkami, Kickstarter, Gamefound, BackerKit, Lanzanos, Ulule), enlace y
  fecha de cierre. Solo campañas conseguidas o abiertas.
- La ficha del libro muestra la campaña: «En campaña en Verkami hasta el…»
  si sigue abierta y «Financiado en Verkami» si ya cerró, como enlace aparte
  que no es una tienda ni lleva afiliado.
- La descarga gratuita de una edición deja de estar limitada a Codex de la
  Marca: vale cualquier copia gratuita y legal de la editorial o del autor,
  como los PDF de Vieja Escuela, Magia & Acero o Trasgos y Mazmorras.
- `/novedades` añade el bloque «En micromecenazgo» con las campañas
  abiertas, de la que cierra antes a la que cierra después. Como la página se
  genera cada día, una campaña sale del bloque al cerrar.
- Carga de los juegos españoles que faltaban: Axis Mundi, Vieja Escuela,
  Kaylos OSR y Helvéczia como sistemas; El Mazmorrón (libros de aventuras para
  D&D 5E), Magia y Acero (en Swords & Wizardry) y Más allá de Corny Groń (en
  Knave) como libros, y Eirendor (basado en la 5E) y Trasgos y Mazmorras
  (retroclón de AD&D) como sistemas con sus libros.
- Las traducciones al castellano que faltan de sistemas OSR que ya están en el
  catálogo (Labyrinth Lord, Mörk Borg, Old-School Essentials, la línea de
  Knave…) van en otro cambio.

## Capabilities

### New Capabilities

- `rpg-crowdfunding`: la campaña de micromecenazgo de las ediciones de los
  libros de rol, cómo se muestra en la ficha y cómo se anuncia en
  `/novedades` mientras está abierta.

### Modified Capabilities

- `rpg-books`: la descarga gratuita vale para cualquier copia gratuita y
  legal de la editorial o del autor, no solo Codex de la Marca.

## Impact

- Datos: `data/schemas/rpg-book.jsonschema` (campo `crowdfunding` en la
  edición), sistemas y libros nuevos en `data/rol/` y filas nuevas en
  `data/rol/inventory.md`.
- Código: `src/types/rpg.ts`, `RpgBookPage.tsx`, `scripts/releases.mjs`
  (campañas abiertas), el plugin `virtual:releases` y `ReleasesPage.tsx`, y
  un módulo virtual con la fecha del build para la ficha.
- Documentación: skill `add-rpg` y `CLAUDE.md`.
