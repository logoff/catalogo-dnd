# Proposal

## Why

Las fichas de videojuegos solo enseñan la portada, y para hacerse una
idea de cómo es un juego el lector tiene que salir del sitio a buscar
un tráiler. Casi todos los juegos modernos tienen vídeos oficiales en
YouTube, y empotrarlos hace la ficha más útil sin renunciar a la
promesa de la página legal: el sitio no usa cookies ni carga servicios
de terceros sin que el lector lo pida.

## What Changes

- Campo nuevo `videos` en las fichas de videojuegos: hasta tres vídeos
  de YouTube por juego (tráiler, anuncio, lanzamiento o expansión), con
  su título, canal y una miniatura guardada en local.
- Solo vídeos de canales oficiales: editora, desarrolladora, plataforma
  (PlayStation, Xbox, Nintendo) o Wizards of the Coast / D&D. Si un
  juego no tiene ninguno, no lleva vídeos. Los gameplays de terceros
  quedan fuera por ahora.
- Sección «Vídeos» en la ficha, aparte de la portada, que solo aparece
  si el juego tiene vídeos. Cada vídeo se muestra como una miniatura
  local con un botón de reproducir; el reproductor de
  `youtube-nocookie.com` solo se carga al pulsarlo.
- Datos estructurados `VideoObject` en el HTML prerenderizado.
- Receta `just` que comprueba que cada vídeo sigue disponible en
  YouTube y avisa en GitHub Actions sin bloquear la build.
- La página legal explica que, al reproducir un vídeo, se conecta con
  YouTube.
- La skill `add-videogame` busca vídeos oficiales al dar de alta un
  juego y la skill `novedades` vigila tráileres nuevos.
- Carga de vídeos en las fichas existentes, por lotes de décadas.

Fuera de alcance: capturas de pantalla (irán en un cambio posterior),
gameplays y vídeos de fans o medios, otras plataformas de vídeo y
vídeos en el listado de videojuegos.

## Capabilities

### New Capabilities

- `videogame-videos`: qué vídeos oficiales se guardan de cada juego,
  cómo se muestran en la ficha sin cargar YouTube hasta que el lector
  lo pide, y cómo se vigila que sigan disponibles.

### Modified Capabilities

Ninguna: el proyecto aún no tiene specs en `openspec/specs/` (las de
`add-videojuegos` siguen sin archivar) y el resto de la ficha no
cambia.

## Impact

- **Datos:** `data/schemas/videogame.jsonschema` (campo `videos`),
  fichas de `data/videogames/games/` y miniaturas en
  `public/images/videogames/<slug>/`.
- **Código:** tipos de videojuego, `VideogameDetail.tsx` y un
  componente nuevo de vídeo con vista previa; `LegalPage.tsx`;
  metadatos de la ficha.
- **Build y CI:** script nuevo de comprobación de vídeos, receta en el
  `justfile` y un paso no bloqueante en `.github/workflows/test.yml`.
- **Herramientas:** skills `add-videogame` y `novedades`, `CLAUDE.md` y
  README.
- **Externo:** ninguna clave de API; la comprobación usa el endpoint
  público `oembed` de YouTube.
