# Proposal

## Why

Con los vídeos, las fichas de videojuegos ya enseñan cómo se mueve un
juego, pero muchos juegos, sobre todo los antiguos, no tienen ningún
vídeo oficial. Unas capturas oficiales dejan ver de un vistazo cómo es
cada juego, también los de los años 80 y 90, que suelen tenerlas en
sus páginas de GOG y Steam. Es la segunda parte de lo explorado en el
cambio de vídeos, donde se decidió guardarlas en local.

## What Changes

- Campo nuevo `screenshots` en las fichas de videojuegos: hasta seis
  capturas por juego, cada una con su imagen local y la página oficial
  de donde sale.
- Solo capturas de fuentes oficiales: la página del juego en Steam o
  GOG, su web oficial o el kit de prensa de la editora o la
  desarrolladora. Nada de capturas de usuarios, medios o wikis.
- Las capturas se guardan en el propio sitio en WebP, a tamaño
  ampliado y en miniatura, para que la ficha no pida nada a terceros.
- Sección «Capturas» en la ficha, con una cuadrícula de miniaturas;
  al pulsar una se abre en grande en el visor que ya usan las
  portadas, con navegación entre capturas y por teclado. La sección
  solo aparece si el juego tiene capturas.
- Receta `just` que descarga capturas de una página de Steam o de
  URLs dadas, las convierte y las anota en la ficha.
- La página legal menciona las capturas junto a portadas y logotipos.
- La skill `add-videogame` busca capturas al dar de alta un juego.
- Carga de capturas en las fichas existentes, por lotes de décadas.

Fuera de alcance: capturas en el listado de videojuegos, capturas de
fans o de mods, ilustraciones y arte conceptual, y capturas de los
libros del catálogo.

## Capabilities

### New Capabilities

- `videogame-screenshots`: qué capturas oficiales se guardan de cada
  juego, de dónde pueden salir y cómo se muestran en la ficha.

### Modified Capabilities

Ninguna: `videogame-videos` no cambia, y las specs de
`add-videojuegos` (incluido el requisito de imagen pública local) siguen
sin archivar; este cambio no modifica la portada.

## Impact

- **Datos:** `data/schemas/videogame.jsonschema` (campo `screenshots`),
  fichas de `data/videogames/games/` y capturas en
  `public/images/videogames/<slug>/`.
- **Código:** tipos de videojuego, `videogameLoader.ts`,
  `VideogameDetail.tsx`, un componente nuevo de galería,
  `ImageLightbox.tsx` (textos alternativos propios) y `LegalPage.tsx`.
- **Scripts:** script nuevo de descarga y conversión con `sharp`, que ya
  es dependencia del proyecto, y receta en el `justfile`.
- **Repositorio:** unos 40 MB más de imágenes con todas las fichas
  cargadas.
- **Herramientas:** skill `add-videogame`, `CLAUDE.md` y README.
