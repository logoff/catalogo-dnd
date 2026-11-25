# Design

## Context

Hoy hay dos clases de búsqueda (ver proposal.md, «Why»):

- `SearchBar` (cabecera y portada) escribe en `productStore.searchQuery` y
  navega a `/catalogo?q=`; `productFilters.matchesSearch` busca en código,
  título, autores, ISBN y editorial de los libros de 5E y 2024. `/catalogo`
  no tiene campo propio: depende de la caja de la cabecera.
- Cada listado tiene su `SearchField` y su propia función: videojuegos y
  merchandising comparan título, título en castellano (y fabricante) con
  `normalize`; novelas, cómics y rol usan un `searchText` ya normalizado que
  se calcula al construir su índice (títulos y autores o editoriales, sin
  ISBN).

Libros, videojuegos y merchandising están en el bundle principal (stores de
Zustand). Novelas, cómics y rol están en trozos aparte
(`virtual:novels-index`, `virtual:comics-index`, `virtual:rpg-index`) que se
cargan con `loadNovelIndex`, `loadComicIndex` y `loadRpgIndex`. Las ediciones
anteriores y las licencias salen de `virtual:rpg-index` (`isDndEdition`,
`systemPath`, `bookPath`).

El prerenderizado genera un HTML por cada URL del sitemap y `main.tsx`
hidrata; el primer render tiene que coincidir en servidor y navegador. En
Cloudflare Pages una ruta sin HTML propio recibe `index.html` (la portada).

## Goals / Non-Goals

**Goals:**

- Una sola función pura de búsqueda, con tests, que sirva para todas las
  secciones y devuelva grupos ya ordenados.
- No añadir peso al bundle principal: los índices pesados solo se piden en
  `/buscar`.

**Non-Goals:**

- Índice de búsqueda precalculado aparte (tipo Lunr o Pagefind) ni
  búsqueda en el servidor.
- Cambiar cómo filtran los listados de cada sección, salvo que ganan el
  ISBN al reutilizar el mismo `searchText`.

## Decisions

### 1. Un adaptador por sección y una búsqueda común

`src/utils/siteSearch.ts` define `SearchEntry` (sección, título, título en
castellano, URL, miniatura, dato secundario como año o edición, y
`searchText` normalizado) y una función por sección que convierte sus datos
en entradas. `searchSite(query, entries)` filtra con `includes` sobre el
texto normalizado, agrupa por sección en el orden de la spec y ordena dentro
de cada grupo: primero los títulos (original o castellano) que empiezan por
el texto y después el resto, cada parte por título con `localeCompare('es')`.

Alternativa descartada: llamar a las funciones de filtro de cada sección.
Cada una tiene sus campos y su normalización (`productFilters` ni quita
tildes), y el resultado no sería coherente.

### 2. ISBN dentro del `searchText` de los índices

Los constructores de novelas, cómics y rol añaden los ISBN-13 de sus
ediciones (y de los recopilatorios o tomos que tengan) a `searchText`. Así
el índice ya trae lo necesario y los buscadores de esas secciones también
encuentran por ISBN. Coste estimado: unos 15 bytes por edición, unas
decenas de KB sin comprimir en total entre los tres índices. Para libros,
videojuegos y merchandising, que están en memoria enteros, el adaptador
construye su `searchText` con los mismos campos.

Alternativa descartada: un módulo virtual `virtual:search-index` con todo.
Duplicaría datos que ya están en los índices y obligaría a mantener dos
derivaciones.

### 3. Carga de los índices al abrir `/buscar`

`SearchPage` pide los tres índices en paralelo al montarse y, mientras
llegan, muestra ya los grupos de lo que está en memoria y un aviso discreto
de que faltan secciones por cargar. Las cachés de cada loader evitan
repetir la descarga al volver a la página.

### 4. Hidratación y prerenderizado

`/buscar` se prerenderiza como página vacía (campo sin texto y sin
resultados) para que Cloudflare no sirva la portada en esa ruta. El texto de
`q` se lee después de hidratar (estado que se rellena en un `useEffect`), de
modo que servidor y navegador pintan lo mismo en el primer render. Como el
prerender toma las URLs del sitemap y `/buscar` no debe ir en él, el script
de prerenderizado recibe una lista corta de rutas extra que se generan pero
no se anuncian. `MetaTags` gana una opción `noindex` que añade
`<meta name="robots" content="noindex">`.

### 5. Caja de búsqueda

`SearchBar` deja de usar `productStore`: guarda su texto local y, tras la
espera de 300 ms que ya tiene, navega a `/buscar?q=` (con `replace` si ya
está en `/buscar`, para no llenar el historial de una entrada por letra).
También navega al pulsar Intro. En `/buscar` la caja de la cabecera muestra
el texto actual. El campo de la propia página usa el mismo comportamiento.

`/catalogo` añade un `SearchField` al principio de su panel de filtros,
enlazado a `productStore.searchQuery`; `useUrlFilters` ya lee y escribe
`?q=`.

### 6. Presentación

Cada grupo usa el título de bloque de `headingClass` con el nombre de la
sección y el recuento. Cada resultado es una fila compacta: miniatura si
la hay, título original y, debajo, el de castellano con `SpanishMark`, y un
dato secundario (edición, plataforma, año, sistema…). Sin tarjetas grandes:
la página tiene que poder mostrar muchos resultados de un vistazo, también
en móvil. Ocho por grupo y un botón «Ver los N restantes».

## Risks / Trade-offs

- [Búsquedas de una o dos letras devuelven cientos de fichas] → El límite
  de ocho por grupo mantiene la página manejable; no hace falta un mínimo
  de caracteres.
- [El ISBN en `searchText` hace que «978» coincida con todo] → Aceptable:
  nadie busca «978»; un número de tres cifras sigue encontrando títulos que
  lo contienen.
- [Al pasar el buscador a `/buscar` se pierde el filtrado inmediato de
  `/catalogo` desde la cabecera] → El panel del catálogo gana su propio
  campo y los enlaces antiguos `/catalogo?q=` siguen funcionando.
- [Una ruta prerenderizada fuera del sitemap se olvida en futuras
  revisiones] → La lista de rutas extra vive junto al prerender, con un
  comentario, y un test comprueba que `/buscar` no está en el sitemap.

## Migration Plan

Sin migración de datos. Se despliega como el resto; para revertir basta con
volver a la versión anterior (los enlaces `/catalogo?q=` siguen valiendo en
ambas).
