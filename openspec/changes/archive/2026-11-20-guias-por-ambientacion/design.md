# Design

## Context

Las novelas se guardan por mundo (`data/novels/<mundo>/`) y los videojuegos
tienen `setting`, con identificadores como `forgotten_realms` o `dark_sun`.
Los libros no tenían el mundo como dato: en AD&D lo daba la sección de TSR
Archive al generarlos, y en 3.5 las secciones del inventario.

## Goals / Non-Goals

**Goals:**

- Un solo identificador por mundo en todo el sitio.
- Guías que se actualizan solas al añadir libros, novelas o juegos.

**Non-Goals:**

- Clasificar el merchandising ni los libros de terceros de «Otros juegos de
  rol»: se puede añadir después con el mismo campo.
- Textos largos por mundo: cada guía lleva una entradilla breve y el resto
  sale de los datos.

## Decisions

- **`settings` es una lista**, porque algunos libros recorren varios mundos
  (Die Vecna Die: Greyhawk, Ravenloft y Planescape). Sin el campo, el libro
  no es de ningún mundo concreto (reglas generales, aventuras del
  multiverso como Vecna: Eve of Ruin).
- **La lista de mundos vive en el código** (`WORLDS`) y los esquemas la
  repiten; un test exige que coincidan y que novelas y videojuegos solo usen
  identificadores de ella.
- **Mundos nuevos** que solo existen en 5E (Exandria, Ravnica, Theros,
  Strixhaven) y en ediciones anteriores (Al-Qadim, Kara-Tur, Lankhmar)
  entran en la misma lista.
- **Se hace en dos PR**: datos primero y guías después, para revisar la
  clasificación antes de publicarla.
