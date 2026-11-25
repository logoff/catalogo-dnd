# Proposal

## Why

El buscador de la cabecera y de la portada («Buscar libros…») solo busca en
los libros de reglas de 5E y 2024 y lleva a `/catalogo?q=`. Lo demás del
catálogo (ediciones anteriores, videojuegos, merchandising, novelas, cómics,
otros juegos de rol y licencias) no aparece: buscando «fiends» no sale
_Fiends & Foes_, que está en merchandising. Parece que no lo tenemos, aunque
la ficha existe. Con siete secciones, el buscador que más se ve tiene que
buscar en todas.

## What Changes

- Página nueva `/buscar?q=` con los resultados de **todas** las secciones,
  agrupados por sección y en un orden fijo: libros de 5E y 2024, ediciones
  anteriores de D&D, videojuegos, merchandising, novelas, cómics, otros
  juegos de rol y licencias.
- Busca, sin distinguir tildes ni mayúsculas, en el título original, el
  título en castellano, los autores o la editorial o fabricante y el ISBN de
  cada ficha.
- El buscador de la cabecera (escritorio y menú móvil) y el de la portada
  llevan a `/buscar?q=` y se llaman «Buscar en el catálogo». El atajo de la
  cabecera en tableta, que hoy abre `/catalogo`, abre `/buscar`.
- Cada grupo muestra los primeros resultados con su recuento y un botón para
  ver el resto en la misma página. Si no hay resultados, se dice y se
  enlazan las secciones.
- `/catalogo` tiene su propio campo de búsqueda en el panel de filtros, como
  el resto de listados, y sigue aceptando `?q=`.
- `/buscar` no se indexa (`noindex`) y no va en el sitemap.
- Fuera de alcance: búsqueda difusa o con faltas de ortografía, sugerencias
  mientras se escribe, buscar en las descripciones y en guías o páginas de
  novedades, y añadir `?q=` a los listados de las demás secciones.

## Capabilities

### New Capabilities

- `site-search`: búsqueda global en todas las secciones del catálogo
  (página `/buscar`, qué campos se buscan, cómo se agrupan y se muestran los
  resultados, y el buscador de la cabecera que lleva a ella).

### Modified Capabilities

- `home-page`: la cabecera de la portada pasa de «un buscador de libros» a
  un buscador de todo el catálogo.

## Impact

- Código: `SearchBar` y `Header`, `HomePage`, `AppRoutes` (ruta nueva),
  página nueva de resultados, panel de filtros de `/catalogo`, funciones de
  búsqueda en `src/utils/` y los índices de novelas, cómics y rol (añadir los
  ISBN a su texto de búsqueda).
- Rendimiento: los índices de novelas, cómics y rol solo se descargan al
  abrir `/buscar`; crecen un poco por los ISBN.
- Prerenderizado: `/buscar` se prerenderiza vacío para que hidrate sin
  diferencias; no entra en el sitemap.
- Sin datos nuevos ni cambios en los esquemas JSON.
