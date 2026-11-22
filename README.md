# Catálogo Dungeons & Dragons

[![Deploy](https://github.com/logoff/catalogo-dnd/actions/workflows/deploy.yml/badge.svg)](https://github.com/logoff/catalogo-dnd/actions/workflows/deploy.yml)

Te encuentras en el repositorio del **Catálogo Dungeons & Dragons**,
que ofrece una lista completa de todos los libros y accesorios publicados
en inglés y en castellano de Dungeons & Dragons de las ediciones
5E (2014) y 5.5E (2024), de todos los videojuegos oficiales de D&D,
con las plataformas, si están en castellano y dónde comprarlos, y del
merchandising con licencia oficial (libros de cocina y de arte, figuras,
LEGO y juegos de mesa), de las novelas oficiales de D&D en inglés con
todas sus ediciones en castellano y de otros juegos de rol de la familia
de D&D (Pathfinder, Tales of the Valiant, Daggerheart…) con sus licencias
abiertas.

**🌐 Consulta el catálogo en [catalogodnd.es](https://catalogodnd.es/)**

## Cómo poner en marcha el proyecto

### Requisitos

- [Node.js](https://nodejs.org/) 22+
- [just](https://just.systems/)
- [Docker](https://www.docker.com/) (opcional)

### Desarrollo local

```sh
just dev
```

Abrir <http://localhost:5173/>.

### Con Docker

```sh
just docker-run
```

Abrir <http://localhost:5173/>.

## Comandos disponibles

- `just dev` - Servidor de desarrollo
- `just build` - Construir para producción
- `just preview` - Previsualizar build
- `just docker-run` - Ejecutar con Docker
- `just deploy` - Publicar en Cloudflare Pages
- `just indexnow` - Avisar a Bing y otros buscadores (IndexNow) de todas las URLs del sitemap
- `just video-thumbnails` - Descargar las miniaturas que falten de los vídeos de los videojuegos
- `just check-videos` - Comprobar que los vídeos de los videojuegos siguen disponibles en YouTube
- `just check-scores` - Comprobar que las notas de Metacritic y OpenCritic de los videojuegos siguen al día
- `just screenshots <slug> --steam` - Descargar las capturas oficiales de un videojuego desde Steam (o `--source <página> <url>…` para otras fuentes)
- `just check-reviews` - Comprobar que los enlaces de las reseñas de libros y novelas siguen vivos
- `just reviews-coverage` - Listar los libros publicados que aún no tienen reseñas

## Reseñas de los libros

Los libros de 2014 y 2024 llevan en el campo `reviews` reseñas de medios
reputados: el medio, el enlace, el idioma, la fecha, el autor y la nota
en la escala del propio medio si la tiene, más un resumen propio en
castellano. La marca `spanish_edition` indica las que valoran la edición
en castellano o su traducción. Los medios aceptados, con su escala, están
en `data/review-outlets.json`, y los tests rechazan las reseñas de medios
que no están en la lista. La ficha muestra cada reseña por separado: no
se calcula ninguna media ni se emiten datos estructurados de valoración.
Las reseñas se dan de alta con la skill `add-review`.

`just check-reviews` avisa de las reseñas que ya no existen (404 o 410),
que redirigen a la portada del medio o cuyo dominio no responde. Los
bloqueos (403, 429) no se cuentan como enlaces rotos. En GitHub Actions
se ejecuta en cada PR, pero nunca hace fallar la build.

## Reseñas y superventas de las novelas

Las novelas pueden llevar reseñas de medios con el mismo formato y la
misma lista de medios que los libros de rol, pero solo las que tengan
una reseña enlazable: no hay cobertura obligatoria. Las que entraron en
la lista de superventas de The New York Times llevan `bestseller`, con la
primera semana, la lista (tapa dura o bolsillo) y la fuente; la ficha
muestra «Superventas de The New York Times» con su enlace. No se muestran
valoraciones de usuarios de ningún sitio.

## Vídeos de los videojuegos

Las fichas de videojuegos pueden llevar hasta tres vídeos oficiales de
YouTube en el campo `videos` (identificador, tipo, título, canal y
fecha). Solo entran vídeos de la editora, la desarrolladora, una
plataforma o Wizards of the Coast. Cada vídeo tiene su miniatura en
`public/images/videogames/<slug>/video-<id>.jpg`, que se descarga con
`just video-thumbnails`: la ficha muestra esa copia local y no carga el
reproductor de `youtube-nocookie.com` hasta que se pulsa reproducir.

`just check-videos` consulta el oEmbed de YouTube y avisa de los vídeos
retirados, no empotrables o de otro canal. En GitHub Actions se ejecuta
en cada PR y deja anotaciones, pero nunca hace fallar la build.

## Notas de los videojuegos

Las fichas de videojuegos muestran las notas de Metacritic y OpenCritic
de cada juego que tenga página en esos agregadores, como dato citado: la
cifra, el nombre del agregador y el enlace a su página. En Metacritic se
guarda la nota de la plataforma principal y, si difieren, las de otras
plataformas; las Enhanced Edition con página propia llevan su nota
aparte.

`just check-scores` lee la nota del JSON-LD de cada página y avisa si ya
no coincide con la guardada o si el enlace ha dejado de existir. En
GitHub Actions se ejecuta en cada PR, pero nunca hace fallar la build.

## Capturas de los videojuegos

Las fichas pueden llevar hasta seis capturas oficiales en el campo
`screenshots`, cada una con su imagen y la página de donde sale (Steam,
GOG, web oficial o kit de prensa). `just screenshots` las descarga, las
convierte con `sharp` a WebP en dos tamaños
(`public/images/videogames/<slug>/screenshot-N.webp` y
`screenshot-N-thumb.webp`) y las añade a la ficha. La ficha muestra las
miniaturas y abre la captura ampliada en el visor.

## Despliegue

Cada push a `main` construye el sitio y lo publica en el proyecto
`catalogodnd` de Cloudflare Pages, que sirve `catalogodnd.es`.
`catalogodnd.com` redirige al `.es` con una regla de Cloudflare. El
workflow necesita los secretos del repositorio `CLOUDFLARE_API_TOKEN`
(permiso _Cloudflare Pages: Edit_) y `CLOUDFLARE_ACCOUNT_ID`.

La antigua dirección `logoff.github.io/catalogo-dnd/` sirve una página
que redirige cada ruta al dominio nuevo. Se publica ejecutando a mano
el workflow _Redirección desde GitHub Pages_.

## Merchandising

La sección `/merchandising` reúne productos con licencia oficial de D&D
desde 2014 que no son de reglas: libros licenciados, figuras y juguetes,
y juegos de mesa y cartas. Cada artículo es un JSON en
`data/merchandising/items/<grupo>/<slug>.json` con sus ediciones por
idioma; las ediciones en castellano indican si se publicaron en España.
La lista maestra es `data/merchandising/inventory.md`, y la skill
`add-merchandise` explica cómo dar de alta artículos.

## Novelas

La sección `/novelas` reúne todas las novelas oficiales de D&D en inglés
(Dragonlance, Reinos Olvidados, Eberron…) con todas sus ediciones en
inglés y en castellano. Cada novela es un JSON en
`data/novels/<mundo>/<slug>.json`; las series y sus recopilatorios están
en `data/novels/series.json`. La lista maestra es
`data/novels/inventory.md`, la skill `add-novel` explica cómo dar de alta
novelas y `just novel-covers` descarga y convierte sus portadas.

## Otros juegos de rol

La sección `/rol` reúne juegos de la familia de D&D que no son de Wizards
of the Coast (Pathfinder, Starfinder, Tales of the Valiant, Daggerheart,
13th Age, Level Up), los juegos OSR y NSR (Old-School Essentials, Dungeon
Crawl Classics, Aventuras en la Marca del Este, Mörk Borg, Cairn…) con la
línea impresa de cada uno y libros de otras editoriales para 5E, con sus
ediciones en inglés y en castellano, y `/licencias` explica las licencias
abiertas (OGL, SRD, ORC…) que los relacionan. Los datos están en
`data/rol/`: licencias en `licenses/`, sistemas en `systems/` y libros en
`books/<sistema>/`. La lista maestra es `data/rol/inventory.md` y la skill
`add-rpg` explica cómo dar de alta licencias, sistemas y libros.

## Feed de novedades

El build genera `dist/feed.xml`, un feed Atom con las 50 últimas novedades
de todas las secciones (ediciones en inglés y en castellano con fecha de
día o de mes, sin las futuras). Lo hace `scripts/generate-feed.mjs` con la
lógica de `scripts/feed.mjs`; sus enlaces llevan
`utm_source=rss&utm_medium=feed&utm_campaign=novedades` para medirlo en
Umami. Se anuncia en el `<head>` y se enlaza en el pie de página.

## Enlaces de afiliado

Los botones de compra llevan ID de afiliado solo si están definidas
estas variables en el build. Si falta alguna, el enlace de esa tienda
se publica sin afiliado:

| Variable                                     | Uso                                             |
| -------------------------------------------- | ----------------------------------------------- |
| `VITE_AFFILIATE_AMAZON_TAG`                  | Tag de Amazon Afiliados                         |
| `VITE_AFFILIATE_ADTRACTION_CHANNEL`          | ID de canal en Adtraction (común a sus tiendas) |
| `VITE_AFFILIATE_GENERACION_X_PROGRAM`        | ID del programa de Generación X en Adtraction   |
| `VITE_AFFILIATE_JUEGOS_MESA_REDONDA_PROGRAM` | ID del programa de Juegos de la Mesa Redonda    |
| `VITE_AFFILIATE_GOG_PROGRAM`                 | ID del programa de GOG en Adtraction            |
| `VITE_AFFILIATE_INSTANT_GAMING_REFERRAL`     | Código de referido de Instant Gaming (`igr`)    |
| `VITE_AFFILIATE_AWIN_PUBLISHER`              | ID de publisher en Awin (común a sus tiendas)   |
| `VITE_AFFILIATE_FANATICAL_PROGRAM`           | ID del anunciante Fanatical en Awin             |
| `VITE_AFFILIATE_CASA_DEL_LIBRO_PROGRAM`      | ID del anunciante Casa del Libro en Awin        |
| `VITE_AFFILIATE_NEXTORY_PROGRAM`             | ID del programa de Nextory en Adtraction        |
| `VITE_AFFILIATE_NOSOLOROL_PROGRAM`           | ID del programa de NoSoloRol en Adtraction      |
| `VITE_AFFILIATE_DRIVETHRU_ID`                | ID de afiliado de DMsGuild y DriveThruRPG       |

En el despliegue se leen de los secretos del repositorio con el mismo
nombre sin el prefijo `VITE_`. En local se pueden poner en `.env`.

## Analítica

El sitio publicado mide visitas con [Umami](https://umami.is/). El
script se añade en el build solo si
están definidas las variables `VITE_UMAMI_URL` y
`VITE_UMAMI_WEBSITE_ID`. En el despliegue se leen de los secretos
del repositorio `UMAMI_URL` y `UMAMI_WEBSITE_ID`. En desarrollo local
no se envía nada.
