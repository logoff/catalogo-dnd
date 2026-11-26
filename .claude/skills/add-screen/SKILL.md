---
name: add-screen
description: Añadir películas, series, documentales o episodios de D&D (oficiales o no oficiales) a la sección «Cine y series», con sus títulos y estrenos en España, carteles, tráileres oficiales, ediciones físicas y enlaces a IMDb y FilmAffinity. Usa esta skill cuando el usuario quiera dar de alta una película o serie, completar una obra del inventario o cargar un lote.
argument-hint: "[título de la obra o «pendientes»]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch
---

# Añadir una obra de cine y series

La lista maestra está en `data/screen/inventory.md`: toda obra que se
añada debe estar ahí. Si no está, consulta al usuario si entra según el
criterio de `screen-records` (spec en `openspec/specs/` o, mientras no se
haya archivado la change, en
`openspec/changes/add-cine-y-series/specs/`).

## Argumentos

`$ARGUMENTS`

## Criterio

- **Oficial** (`official: true`): con licencia de TSR, Wizards of the
  Coast o Hasbro, en acción real o animación, estrenada en cines,
  televisión, streaming o directamente en vídeo, o anunciada
  oficialmente (`status: "announced"`).
- **No oficial** (`official: false`): sin esa licencia, pero D&D es el
  tema principal (el juego, sus creadores, sus jugadores o una campaña
  de D&D). Que los personajes jueguen una partida no basta. Lleva
  `unofficial_reason`: una frase propia que diga por qué no es oficial y
  qué relación tiene con D&D.
- **Fuera:** vídeos de partidas en directo y pódcast (Critical Role,
  Dimension 20…), obras de teatro y documentales anunciados que no se han
  estrenado (salvo los oficiales).
- **Tipos** (`kind`) y carpeta: `film` (`films/`), `series` (`series/`,
  con `series.start_year`, `end_year` si terminó y `seasons`),
  `documentary` (`documentaries/`) y `episode` (`episodes/`, con
  `parent_series`; solo un episodio de D&D dentro de una serie que no lo
  es, o uno estrenado por separado).

## Reglas de los datos

- **Nada inventado.** Cada dato sale de una fuente que se pueda citar. Si
  no se encuentra, el campo se omite.
- **Sinopsis propia** en castellano, en dos párrafos separados por
  `\n\n`: de qué trata; y qué es (quién la hizo, dónde se estrenó, para
  quién es). Nunca texto copiado de IMDb, FilmAffinity, la distribuidora
  ni la Wikipedia. Pide al usuario que la revise.
- **Títulos:** `title` es el original; `title_es`, el de España, solo si
  se confirma (FilmAffinity España, la carátula de la edición española,
  la plataforma en España). El de Hispanoamérica no vale.
- **Estrenos** (`releases`): país (`us`, `es`…), medio (`cinema`, `tv`,
  `streaming`, `home_video`), fecha (año, año y mes o completa) y, si se
  conoce, la cadena o plataforma en `network`. Un estreno en YouTube
  cuenta como `streaming` con el canal en `network`.
- **Ediciones físicas** (`physical_editions`): solo las editadas en
  España (DVD, Blu-ray, 4K), con `spanish_audio` y `spanish_subtitles`
  confirmados en la ficha de la tienda o en blu-ray.com (si no se pueden
  confirmar, la edición no entra). Enlace de compra solo a Amazon, con la
  forma `https://www.amazon.es/dp/<ASIN>/`, sin parámetros.
- **Ninguna plataforma de streaming** (Prime Video, Netflix…) mientras su
  programa de afiliados no esté aceptado.
- **Enlaces externos** (`external`): `imdb`
  (`https://www.imdb.com/title/tt…/`), `filmaffinity`
  (`https://www.filmaffinity.com/es/film….html`) y `wikidata` (el QID,
  que no se muestra y sirve para contrastar los otros dos).
- **Relaciones** (`related_novels`, `related_merchandise`,
  `related_videogames`): slugs de fichas que existan. Solo se guardan
  aquí; las fichas de novela y merchandising las muestran solas.

## Fuentes recomendadas

- **Identificadores:** Wikidata (IMDb es P345, FilmAffinity es P480). La
  API `wbgetentities` y el SPARQL responden sin problema.
- **Títulos y estrenos en España:** la Wikipedia en castellano (ficha de
  la obra, `action=raw`), FilmAffinity (bloquea las consultas
  automáticas: ábrela con Chrome) y la carátula de la edición española.
- **Ediciones físicas:** Amazon.es (con Chrome, porque bloquea `curl`:
  la búsqueda da el ASIN en `data-asin`) y blu-ray.com para el audio y
  los subtítulos.
- **Tráileres:** solo de canales oficiales (estudio, productora,
  distribuidora en EE. UU. o en España, cadena o plataforma de estreno,
  Wizards). La búsqueda de YouTube se puede leer de `ytInitialData`; el
  canal y el título se confirman con el oEmbed
  (`https://www.youtube.com/oembed?format=json&url=…`) y la fecha con el
  `datePublished` de la página del vídeo. Si hay uno en castellano de la
  distribuidora española, va con `language: "es"`. Como mucho tres.
- **Carteles:** primero fuentes oficiales (distribuidora, web oficial, kit
  de prensa). Si no hay, valen otras webs conocidas: el castellano, de
  SensaCine (`og:image` de la ficha, se descarga con `curl`); el original,
  del cartel de la ficha de la Wikipedia en inglés (el archivo del campo
  `image` de la ficha, en `upload.wikimedia.org`, con su página `File:`
  como fuente). FilmAffinity y Amazon no dejan descargar sus imágenes
  fuera del navegador, y la de Amazon suele ser la foto en 3D de la caja.
  Un cartel apaisado o un rótulo no sirven: mejor sin cartel.

## Pasos

1. **Buscar la obra en el inventario** y anotar tipo, si es oficial y lo
   que ya se sabe.
2. **Reunir los datos** con las fuentes de arriba.
3. **Escribir el JSON** en `data/screen/<carpeta>/<slug>.json`. El nombre
   del archivo es el slug, en kebab-case. Esquema:
   `data/schemas/screen.jsonschema`. Obligatorios: `slug`, `kind`,
   `official`, `title`, `description` y `status`.
4. **Carteles:** `just screen-posters <slug> --source <página>
<idioma>=<url>…` los descarga, los convierte a WebP con miniatura y
   los anota. Revisa la imagen.
5. **Tráileres:** añádelos a `trailers` y descarga sus miniaturas con
   `just video-thumbnails`; `just check-videos` confirma el canal.
6. **Marcar la ficha en el inventario**: cambia `pendiente` por el slug en
   la columna «Ficha» y corrige el título en España si se ha confirmado.
7. **Verificar** con `just check` (los tests validan el esquema, la
   carpeta, el slug, los carteles, las miniaturas, las relaciones, las
   URLs y la coherencia con el inventario) y mira la ficha con `just dev`
   en `/cine-y-series/<slug>`.

## Ejemplos

- `data/screen/films/dungeons-and-dragons-honor-among-thieves.json`:
  película oficial con estrenos, ediciones físicas, cartel, tráileres en
  castellano y en inglés y relaciones.
- `data/screen/series/dungeons-and-dragons-1983.json`: serie terminada
  con su estreno en España.
- `data/screen/documentaries/secrets-of-blackmoor.json`: documental no
  oficial con su motivo.
