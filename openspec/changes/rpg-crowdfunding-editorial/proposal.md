# Proposal

## Why

Muchas editoriales españolas (Nosolorol, The Hills Press…) financian sus
libros en mecenazgos o preventas en su propia tienda, no en Verkami ni en
Kickstarter. Para anotar esas campañas y fechar con ellas las ediciones en
castellano, la lista cerrada de plataformas necesita esa opción. Al cargar todo
lo publicado en castellano de los juegos OSR (issue #160), Dolmenwood de
Nosolorol es el primer caso.

## What Changes

- La lista cerrada de plataformas de micromecenazgo añade «mecenazgo de la
  editorial», con el enlace a la página de la campaña en su tienda.
- La ficha lo muestra como «Financiado en el mecenazgo de la editorial» o «En
  campaña en el mecenazgo de la editorial hasta…».
- Carga de lo publicado en castellano que faltaba de los juegos OSR, también lo
  agotado: la línea de Old-School Essentials de The Hills Press, los zines
  impresos y las campañas de Verkami de los libros que ya estaban.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `rpg-crowdfunding`: la lista cerrada de plataformas incluye el mecenazgo en
  la tienda de la propia editorial.

## Impact

- `data/schemas/rpg-book.jsonschema`, `src/types/rpg.ts`,
  `src/utils/crowdfunding.ts` y `scripts/releases.mjs`.
- Datos de `data/rol/` y skill `add-rpg`.
