# Design

## Context

Ver `proposal.md` para la motivación y las specs `screen-*` para los requisitos.

La sección se parece más a los videojuegos que a las novelas: son pocas fichas
(de 20 a 40 entre oficiales y no oficiales), con estrenos por país y medio
parecidos a los lanzamientos por plataforma, y con vídeos de YouTube. Ya
existen piezas reutilizables:

- `src/components/videogames/YouTubeVideo.tsx`: miniatura local y reproductor
  de `youtube-nocookie.com` al pulsar.
- `scripts/download-video-thumbnails.mjs` y `scripts/check-videos.mjs`, que
  recorren los vídeos con `allVideos()` de `scripts/videogames.mjs`.
- `scripts/download-novel-covers.mjs`: descarga, WebP y miniatura.
- `scripts/feed.mjs`, `scripts/generate-sitemap.mjs` y `scripts/prerender.mjs`,
  que reciben una sección nueva como las anteriores.
- `src/utils/stores.ts`: Amazon ya añade la etiqueta a cualquier URL de
  amazon.es.

## Goals / Non-Goals

**Goals:**

- Un solo esquema para películas, series y documentales, oficiales o no.
- Reutilizar el reproductor, las miniaturas y la vigilancia de vídeos sin
  duplicarlos.
- Relaciones con novelas y merchandising sin tocar sus esquemas.

**Non-Goals:**

- Índice virtual ni trozos aparte como en novelas: con este volumen no compensa.
- Desglose por temporadas o episodios.
- Fuentes de datos con API de pago o licencia comercial (TMDb).

## Decisions

### Datos en `data/screen/<tipo>/<slug>.json`

Carpetas `films/`, `series/`, `documentaries/` y `episodes/`, con el esquema
`data/schemas/screen.jsonschema` y la lista maestra `data/screen/inventory.md`.
Un documental en forma de serie va en `documentaries/` con el tipo documental y
sus temporadas. Alternativa descartada: separar oficial y no oficial por
carpetas, porque una obra puede cambiar de grupo (por ejemplo, si consigue
licencia) y así basta con cambiar un campo.

Campos principales:

- `slug`, `kind` (`film` | `series` | `documentary` | `episode`, este con
  `parent_series`), `official` (booleano) y
  `unofficial_reason` (obligatorio si `official` es `false`, prohibido si es
  `true`, con `if/then` en el esquema).
- `title`, `title_es`, `description` (sinopsis propia), `status` (`released` |
  `announced`).
- `series`: `start_year`, `end_year` y `seasons`, solo si hay temporadas.
- `releases[]`: `country` (`us` | `es` | otro código ISO), `medium` (`cinema` |
  `tv` | `streaming` | `home_video`), `date`, `network`.
- `physical_editions[]`: `format` (`dvd` | `bluray` | `uhd`), `year`,
  `spanish_audio`, `spanish_subtitles` y `purchase_links` con la lista cerrada
  de tiendas (de momento solo `amazon`).
- `posters[]`: `language` (`en` | `es` | `pt`: el idioma original o el
  castellano), `image`, `source` (página de origen).
- `trailers[]`: `youtube`, `language` (como en los carteles), `title`,
  `channel` y `date`, con un máximo de 3. Un estreno en YouTube cuenta como
  `streaming` con la cadena en `network`.
- `external`: `imdb` (patrón `https://www.imdb.com/title/tt\d+/`),
  `filmaffinity` (patrón `https://www.filmaffinity.com/es/film\d+.html`) y
  `wikidata` (QID, no se muestra; sirve para contrastar los otros dos).
- `related_novels`, `related_merchandise` y `related_videogames`: slugs.

### Relaciones guardadas en un solo lado

Las relaciones se guardan solo en la ficha de la obra, y el cargador calcula el
sentido inverso (`worksRelatedToNovel(slug)` y `worksRelatedToMerchandise(slug)`).
Las fichas de novela y merchandising lo consultan, porque el cargador de la
sección va en el bundle principal. Alternativa descartada: añadir
`related_screen` a `novel.jsonschema` y `merchandise.jsonschema`, que duplica
los datos y obliga a mantenerlos sincronizados. Un test comprueba que cada slug
relacionado existe.

### Cargador en el bundle principal

`src/services/screenLoader.ts` con `import.meta.glob` eager, como
`videogameLoader.ts`, que enriquece en `ScreenWorkWithMeta` (año de estreno,
estreno en España, cartel preferido, miniaturas, `hasSpanish`). Alternativa
descartada: el sistema de índice virtual de las novelas, pensado para cientos de
fichas.

### Vídeos compartidos entre secciones

`YouTubeVideo.tsx` pasa a `src/components/common/` con un tipo de vídeo común
(`youtube`, `title`, `channel`, `published`, `thumbnail` y `language`
opcional). Las miniaturas de los tráileres van en
`public/images/screen/<slug>/video-<id>.jpg`. Un módulo `scripts/screen.mjs`
expone `allTrailers()`, y `download-video-thumbnails.mjs` y `check-videos.mjs`
recorren videojuegos y obras.

### Carteles con un script propio

`just screen-posters <slug> <idioma>=<url>…` descarga cada cartel, lo convierte
a WebP con miniatura `-thumb.webp` en `public/images/screen/<slug>/` y lo anota
en la ficha, reutilizando la conversión de `download-novel-covers.mjs`. Solo
fuentes oficiales: distribuidora, web oficial, kit de prensa o carátula de la
edición física en la tienda.

### Distinción de lo no oficial con el sistema de diseño

La insignia «No oficial» usa el componente de insignia existente con el tono
neutro (`muted`/`line`), no el acento rojo, que en el sitio significa compra,
castellano y elemento activo. No hay colores nuevos.

### Datos estructurados

`Movie` para películas y documentales sueltos, y `TVSeries` para las series (y
los documentales con temporadas), con `name`, `alternateName` (título en
España), `datePublished`, `image`, `sameAs` (IMDb, FilmAffinity) y `trailer`
(`VideoObject`). Sin `AggregateRating`.

### Fuentes para el inventario

- Wikipedia en inglés (_Dungeons & Dragons in popular culture_, páginas de cada
  obra) para el listado inicial.
- Wikidata para los identificadores de IMDb (P345) y FilmAffinity (P480).
- FilmAffinity y las carátulas de las ediciones para los títulos y fechas en
  España.
- IMDb solo como enlace (sus condiciones impiden extraer datos).

Cada entrada del inventario no oficial anota en una frase por qué cumple el
criterio, para revisar los casos dudosos (por ejemplo, _The Legend of Vox
Machina_ entra porque nace de una campaña de D&D).

### Skill `add-screen`

Igual que `add-videogame`: investigar, rellenar la ficha, descargar carteles y
miniaturas, actualizar el inventario y pasar los tests.

## Risks / Trade-offs

- [Títulos y fechas en España mal recordados o con variantes] → Contrastar con
  FilmAffinity y la carátula de la edición española; si no se confirma, no se
  guarda `title_es`.
- [Las películas de 2005 y 2012 o las obras no oficiales pueden no tener
  tráiler en un canal oficial] → La ficha va sin tráileres, como los
  videojuegos.
- [Derechos de los carteles] → Solo fuentes oficiales, tamaño reducido y para
  identificar la obra, como las portadas de los libros.
- [El criterio de no oficial deja casos en el límite] → Se decide caso por caso
  en el inventario con su motivo escrito; ante la duda, no entra.
- [Mover `YouTubeVideo.tsx` toca la ficha de videojuegos] → Los tests de
  `VideogameDetailPage` deben seguir pasando sin cambios de comportamiento.
- [Pocas ediciones físicas en Amazon para obras antiguas o no oficiales] →
  `affiliate-coverage` las lista; si no se venden, la ficha lo indica.

## Migration Plan

Sección nueva sin migración de datos. Se publica en una PR con todas las fichas
oficiales y las no oficiales que haya dado tiempo a completar; el resto queda
como pendiente en el inventario. Para deshacerlo basta con revertir la PR.

## Open Questions

- Si Prime Video u otra plataforma aceptan la solicitud de afiliado, se añade
  la tienda al esquema y a `stores.ts` en un cambio aparte.
