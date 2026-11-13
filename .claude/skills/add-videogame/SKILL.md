---
name: add-videogame
description: Añadir un videojuego oficial de D&D al catálogo. Usa esta skill cuando el usuario quiera dar de alta un videojuego, completar uno del inventario o rellenar un lote de fichas de videojuegos.
argument-hint: "[título o slug del inventario]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch
---

# Añadir un videojuego al catálogo D&D

El usuario quiere dar de alta uno o varios videojuegos. La lista maestra
está en `data/videogames/inventory.md`: todo juego que se añada debe
estar ahí (si no está, consulta al usuario si entra según el alcance de
`openspec/specs/videogame-records/spec.md` o, mientras no se haya
archivado la change, de `openspec/changes/add-videojuegos/specs/`).

## Argumentos

`$ARGUMENTS`

## Reglas de los datos

- **Nada inventado.** Cada dato sale de una fuente que se pueda citar.
  Si no se encuentra, el campo se omite.
- **Castellano por lanzamiento.** `spanish` solo se pone cuando una
  fuente confirma el castellano. Sin ese dato, o con todo a `false`, el
  lanzamiento figura como «solo en inglés»: no hay estado «sin
  confirmar». Una traducción de fans va en `note` y nunca cuenta.
- **Ediciones y DLC dentro del juego.** Enhanced/Definitive Edition y
  relanzamientos son lanzamientos con `edition`; las expansiones van en
  `expansions`, salvo las que se vendieron como juego independiente.
- **Notas solo de las fuentes admitidas:** Metacritic, OpenCritic,
  Meristation, Vandal, 3DJuegos, IGN, GameSpot, PC Gamer, Eurogamer,
  GameSpy y Computer Gaming World. Solo la cifra, la escala y el enlace.
  MobyGames no es fuente de notas.
- **URLs de compra limpias**, sin parámetros de afiliado: el afiliado se
  añade en el build (`src/utils/stores.ts`). No enlazar a tiendas que no
  estén en el enum `store` del esquema.
- **Vídeos solo de canales oficiales:** la editora, la desarrolladora,
  una plataforma donde salió (PlayStation, Xbox, Nintendo) o Wizards of
  the Coast / D&D. Nada de medios (GameSpot, IGN…), creadores de
  contenido ni fans, aunque suban el mismo tráiler. Si no hay ningún
  vídeo oficial, el juego no lleva `videos`. Como mucho tres: el tráiler
  principal y, si los hay, el de anuncio, el de lanzamiento o el de una
  expansión.
- **Capturas solo de fuentes oficiales:** la página del juego en Steam o
  GOG, su web oficial o el kit de prensa de la editora o la
  desarrolladora. Nada de capturas de usuarios, medios, MobyGames ni
  wikis. Si no hay ninguna fuente oficial, el juego no lleva
  `screenshots`. Como mucho seis, y solo capturas reales del juego, no
  arte promocional ni logotipos.

## Fuentes recomendadas

| Dato | Dónde mirar |
| --- | --- |
| Fechas, plataformas, desarrolladora y editora | Infobox de Wikipedia en inglés (`action=raw`), web oficial, MobyGames |
| Castellano de lo que se vende hoy | API de Steam: `https://store.steampowered.com/api/appdetails?appids=<id>&l=english` (`supported_languages`; un `*` marca voces) y la ficha de GOG |
| Castellano de juegos antiguos | Caja o manual español, medios españoles de la época |
| Dónde se vende | API de GOG `https://catalog.gog.com/v1/catalog?query=like:<título>&countryCode=ES` y búsqueda de Steam `https://store.steampowered.com/api/storesearch/?term=<título>&cc=ES` |
| Notas | Metacritic, OpenCritic y los medios admitidos |
| Portada | Imagen de la infobox de Wikipedia (API `prop=imageinfo`) o `library_600x900.jpg` de Steam |
| Capturas | Página de Steam (`just screenshots <slug> --steam` las toma de su API) o capturas de la ficha de GOG, la web oficial o el kit de prensa |
| Vídeos | Canal de YouTube de la editora o la desarrolladora (enlazado desde la web oficial), nota de prensa del lanzamiento y página de Steam; canal y título exactos con `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=<id>` (`author_name`, `title`) y fecha en la página del vídeo (`"uploadDate"`) |

## Pasos

1. **Buscar el juego en el inventario** y anotar su década y su
   estado (a la venta, cerrado, anunciado).
2. **Reunir los datos** con las fuentes de arriba. Comprueba con `curl`
   que las URLs de tienda responden.
3. **Descargar la portada** en `public/images/videogames/<slug>/0.<ext>`
   (la portada primero; más imágenes con `1`, `2`…).
4. **Buscar vídeos oficiales** según las reglas de arriba. Cada uno va en
   `videos` con `youtube` (el identificador de 11 caracteres, no la URL),
   `kind` (`trailer`, `announcement`, `launch` o `expansion`), `title`
   (el título original), `channel` (igual que el `author_name` del
   oEmbed) y `date` (`AAAA-MM-DD`). Después, `just video-thumbnails`
   descarga sus miniaturas y `just check-videos` comprueba que se pueden
   empotrar y que el canal coincide.
5. **Escribir el JSON** en `data/videogames/games/<década>s/<slug>.json`
   (por ejemplo `1990s/baldurs-gate.json`). El nombre del archivo es el
   slug, en kebab-case. Esquema: `data/schemas/videogame.jsonschema`.
   Campos obligatorios: `slug`, `title`, `description`, `developers`,
   `publishers`, `genres` y `releases`.
6. **Añadir capturas** con el JSON ya escrito. Si tiene enlace a Steam,
   `just screenshots <slug> --steam` descarga las seis primeras de su
   página; si no, `just screenshots <slug> --source <página oficial>
   <url imagen>…` con las que elijas. El script las convierte a WebP
   (ampliada y miniatura) y las anota en `screenshots` con su fuente.
   Revisa las imágenes y quita las que no sean capturas del juego
   (borra la entrada y sus dos archivos).
7. **Descripción propia de dos párrafos** separados por `\n\n`: qué es
   el juego y en qué mundo y reglas se basa; para quién es, cómo se
   juega hoy y si está en castellano. Sin copiar textos de tiendas ni
   reseñas. Pide al usuario que la revise.
8. **Marcar la ficha en el inventario**: cambia `pendiente` por el slug
   en la columna «Ficha».
9. **Verificar** con `just check` (los tests validan el esquema, la
   descripción, las imágenes, las miniaturas de los vídeos, las capturas, las URLs y
   la coherencia con el inventario) y, si hace falta, mira la ficha con `just dev` en
   `/videojuego/<slug>`.

## Ejemplo

`data/videogames/games/2020s/baldurs-gate-3.json` es la ficha de
referencia: lanzamientos por plataforma con su castellano, notas con
plataforma, enlaces de compra en el lanzamiento de PC, tráiler de
lanzamiento del canal de Larian (`videos`), capturas de Steam
(`screenshots`) y libro relacionado (`related_products`).
