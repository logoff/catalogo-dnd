# Design

## Context

Las ediciones de los libros de rol ya tienen un enlace que no es de compra,
`free_download` (Codex de la Marca), que la ficha pinta como botón secundario.
`/novedades` sale de `virtual:releases`, que calcula con `scripts/releases.mjs`
y con «hoy» en hora de Madrid fijado en el build; `deploy.yml` despliega cada
día. Ver proposal.md para el motivo.

## Goals / Non-Goals

**Goals:**

- Un solo campo por edición, sin estados que haya que mantener a mano: abierta
  o cerrada se deduce de la fecha de cierre.
- Que servidor y navegador pinten lo mismo en la ficha.

**Non-Goals:**

- Campañas en otras secciones (cómics, merchandising): se añadirán si hace
  falta.
- Seguir el dinero recaudado o el estado de entrega.
- Llevar las campañas al feed Atom.

## Decisions

### 1. Campo `crowdfunding` en la edición

`{ platform, url, end }`, con `platform` en una lista cerrada y `end` como
fecha completa. Las campañas fallidas no se recogen, así que una cerrada se
muestra como financiada. Alternativa descartada: un estado explícito
(`in_campaign`, `funded`), que habría que cambiar a mano cada vez que cierra
una campaña.

### 2. Fecha de referencia: la del build

La ficha compara `end` con la fecha del build en hora de Madrid, la misma que
usa `virtual:releases`, servida por un módulo virtual mínimo
(`virtual:build-date`). Comparar con la fecha del navegador haría que el HTML
prerenderizado y el primer render no coincidieran. Con el despliegue diario,
el desfase máximo es de un día.

### 3. Novedades

`campaignEntries(data, today)` en `scripts/releases.mjs` recorre las
ediciones de los libros de rol con campaña abierta y devuelve nombre, ruta,
contexto (el juego), plataforma, enlace y fecha de cierre. `virtual:releases`
añade la lista `campaigns` y `ReleasesPage` la pinta antes de «Próximamente».

### 4. Juegos de la carga

- Axis Mundi (retroclón de B/X), Vieja Escuela (retroclón minimalista) y
  Helvéczia (d20 de la 3.ª edición) son OSR; Kaylos OSR, con sistema propio de
  d6 inspirado en Cairn, es NSR (derivación `inspiration`).
- El Mazmorrón son libros de aventuras «para D&D o cualquier juego de
  fantasía»: cuelgan de `dnd-5e-2014` como libros de terceros, con la
  aclaración en la descripción.
- Magia y Acero es la adaptación al castellano de White Box FMAG: libro de
  `swords-and-wizardry`. Más allá de Corny Groń se vende en la línea de Knave
  de Outremer: libro de `knave`.
- Los libros que solo se venden en Lulu o en la tienda de la editorial van con
  excepción de afiliado, como el resto de la sección.

## Risks / Trade-offs

- [Fecha de cierre sin publicar en la campaña] → Se toma la de la página o
  sus actualizaciones; si no se sabe, no se pone la campaña.
- [Libros sin edición impresa a la venta después de la campaña] → Entran si
  la campaña es de libro impreso; la regla OSR de edición impresa se cumple.
