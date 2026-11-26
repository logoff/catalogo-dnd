# Proposal

## Why

D&D tiene películas, series y documentales que no recoge ningún sitio en
castellano con sus títulos en España, sus fechas de estreno aquí y sus
ediciones con audio en castellano. El catálogo ya los cita de pasada
(novelizaciones, precuelas, merchandising de _Honor entre ladrones_), pero no
tienen ficha. Además, hay obras sin licencia que tratan de D&D (documentales,
películas sobre el juego) que la gente busca y conviene separar con claridad de
lo oficial. Las ediciones físicas venden en Amazon, lo que ayuda a llegar a las
ventas que exige Amazon Afiliados.

## What Changes

- Sección nueva de **cine y series** (`/cine-y-series`) con películas, series y
  documentales de D&D, cada uno con su ficha.
- Dos grupos claramente separados en el listado y en la ficha:
  - **Oficial**: obras con licencia de TSR, Wizards of the Coast o Hasbro.
  - **No oficial**: obras sin esa licencia cuyo tema principal es D&D (el
    juego, sus creadores, sus jugadores o una campaña). Que los personajes
    jueguen una partida no basta. Cada una explica por qué no es oficial.
- Cada ficha recoge: tipo (película, serie o documental), título original y
  título en España, sinopsis propia en castellano (nunca copiada), carteles en
  inglés y en castellano, hasta tres tráileres oficiales de YouTube con su
  idioma, estrenos en EE. UU. y en España (cines, televisión, streaming o
  directo a vídeo), ediciones físicas con audio y subtítulos en castellano y
  enlaces a IMDb y FilmAffinity.
- Las series se tratan como una sola ficha con su fecha de inicio y de fin, sin
  desglose por temporadas ni episodios.
- Enlaces de afiliado solo donde se cobra: Amazon para las ediciones físicas.
- Relación en los dos sentidos con las novelas, el merchandising y los
  videojuegos del catálogo.
- Inventario maestro, skill para dar de alta fichas y aviso en Actions de los
  tráileres retirados.
- Enlace en la cabecera, tarjeta en la portada y entrada en el feed.

Fuera de alcance: Prime Video y otras plataformas de streaming (solo entran si
su programa de afiliados se acepta), TMDb como fuente de datos (su API exige
licencia comercial), notas de agregadores (Rotten Tomatoes, Metacritic),
desglose por episodios, obras en las que D&D solo aparece en alguna escena y
vídeos de partidas en directo o pódcast.

## Capabilities

### New Capabilities

- `screen-records`: qué obras entran (oficiales y no oficiales con su
  criterio), qué datos se guardan de cada una y cómo se validan.
- `screen-listing`: el listado de la sección, con la separación entre oficial
  y no oficial, filtros, orden y su lugar en la navegación.
- `screen-detail-page`: la ficha de cada obra con sus datos, carteles,
  estrenos, ediciones, enlaces de referencia y contenido relacionado.
- `screen-trailers`: qué tráileres se guardan, su idioma, su miniatura local,
  la reproducción bajo demanda y la vigilancia de los retirados.

### Modified Capabilities

- `home-page`: la portada enlaza también a la sección nueva con su tarjeta y su
  recuento.
- `affiliate-links`: Amazon se enlaza en la sección nueva para las ediciones
  físicas.
- `novel-detail-page`: el contenido relacionado incluye películas y series.
- `merchandise-detail-page`: el contenido relacionado incluye películas y
  series.

## Impact

- Datos nuevos en `data/screen/` con su esquema JSON, inventario y tests de
  validación, como en el resto de secciones.
- Fichas de novela y merchandising: muestran las obras relacionadas (la
  relación se guarda solo en la ficha de la obra).
- Cargador, páginas y rutas nuevas; sitemap, prerenderizado y feed.
- Reutiliza el reproductor de YouTube y los scripts de miniaturas e imágenes de
  los videojuegos y las novelas.
- Cabecera, portada, `CLAUDE.md` y README.
