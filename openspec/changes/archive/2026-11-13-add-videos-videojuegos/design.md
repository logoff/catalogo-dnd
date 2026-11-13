# Design

## Context

Ver `proposal.md` para la motivación y `specs/videogame-videos/spec.md`
para los requisitos.

Estado actual que condiciona el enfoque:

- Las fichas viven en `data/videogames/games/<década>/<slug>.json` con
  el esquema `data/schemas/videogame.jsonschema`. El campo `images` solo
  guarda la portada, en `public/images/videogames/<slug>/0.jpg`, y
  `videogameLoader.test.ts` comprueba que cada imagen existe en
  `public/`.
- `VideogameDetail.tsx` pinta la cabecera (portada con `ImageLightbox`)
  y después secciones con el componente local `Section`.
- Cada ficha se prerenderiza y luego se hidrata: el primer render tiene
  que ser igual en servidor y navegador.
- Los datos estructurados ya se emiten en línea con
  `<script type="application/ld+json">` (ver `Breadcrumbs.tsx`).
- La página legal promete que el sitio no usa cookies ni sigue al
  lector; las analíticas (Umami) no usan cookies.
- `test.yml` corre en cada PR y en cada push a `main`; `deploy.yml`
  solo en `main`.

## Goals / Non-Goals

**Goals:**

- Ninguna petición a YouTube o Google hasta que el lector pulsa
  reproducir.
- Que una ficha con vídeos siga pesando casi lo mismo que hoy: solo se
  añaden las miniaturas, con carga diferida.
- Que añadir un vídeo sea editar un JSON y ejecutar un script.

**Non-Goals:**

- Reproductor propio, listas de reproducción o vídeos en el listado.
- Comprobación de que el canal es oficial de forma automática: es un
  criterio editorial que se aplica al dar de alta el vídeo.
- Capturas de pantalla, que irán en otro cambio.

## Decisions

### Datos: lista `videos` en la ficha

```json
"videos": [
  {
    "youtube": "1T22wNvoNiU",
    "kind": "trailer",
    "title": "Baldur's Gate 3 - Official Launch Trailer",
    "channel": "Larian Studios",
    "date": "2023-08-03"
  }
]
```

- `youtube`: identificador de 11 caracteres (`^[A-Za-z0-9_-]{11}$`), no
  la URL entera, para no tener que normalizar variantes (`youtu.be`,
  `shorts/`, parámetros de tiempo).
- `kind`: `trailer`, `announcement`, `launch` o `expansion`. Se deja
  sitio para añadir `gameplay` en el futuro sin cambiar nada más.
- `title`: el título original del vídeo, tal como aparece en YouTube.
- `channel`: nombre del canal, para revisar a ojo que es oficial y
  mostrarlo en la ficha («Larian Studios»).
- `date`: fecha de publicación, que `VideoObject` exige como
  `uploadDate`.
- El esquema pone `maxItems: 3` y `additionalProperties: false`. JSON
  Schema no puede exigir identificadores únicos dentro de objetos, así
  que eso lo comprueba un test de `videogameLoader.test.ts`.

Alternativa descartada: guardar la URL completa. Es más legible, pero
obliga a validar y normalizar formatos que YouTube cambia.

### Miniaturas: descargadas una vez y guardadas en local

La ruta se deriva del identificador, sin campo propio:
`public/images/videogames/<slug>/video-<youtube>.jpg`. Un script
(`scripts/download-video-thumbnails.mjs`, receta
`just video-thumbnails`) recorre las fichas y descarga las que falten
de `i.ytimg.com`: primero `maxresdefault.jpg` (1280×720, no siempre
existe) y, si no, `hqdefault.jpg` (480×360, siempre existe, con bandas
negras que se recortan al mostrarla en 16:9 con `object-cover`).
`videogameLoader` añade la ruta derivada a `VideogameWithMeta` y un test
exige que el archivo exista, como ya se hace con las portadas.

Alternativas descartadas:

- Pedir la miniatura a `i.ytimg.com` desde la ficha: contacta con
  Google antes del clic, justo lo que se quiere evitar.
- Descargarlas durante el build: haría la build dependiente de la red y
  de YouTube. Mejor fallar en un test al subir la ficha que en el
  despliegue.

### Componente de vídeo con vista previa

Componente nuevo `YouTubeVideo` en `src/components/videogames/`:

```text
estado inicial (servidor y navegador)       tras el clic
+--------------------------------+          +--------------------------------+
| <a href="youtube.com/watch?v=">|  click   | <iframe                        |
|   <img miniatura local 16:9>   | -------> |   youtube-nocookie.com/embed/  |
|   (>) botón reproducir         | (JS:     |   <id>?autoplay=1>             |
| </a>                           |  evita   |                                |
| título · canal                 |  navegar)| título · canal                 |
+--------------------------------+          +--------------------------------+
```

- El estado inicial es un enlace real a `youtube.com/watch?v=<id>` con
  la miniatura y un icono de reproducir. Sin JavaScript, el enlace
  funciona; con JavaScript, el clic se intercepta y cambia el estado a
  «reproduciendo». Como el estado inicial es fijo, no hay diferencias
  entre servidor y navegador al hidratar.
- El `iframe` lleva `title` con el título del vídeo, `allow="autoplay;
encrypted-media; picture-in-picture; fullscreen"`, `allowFullScreen`
  y `referrerPolicy="strict-origin-when-cross-origin"`: YouTube rechaza
  los embebidos sin cabecera `Referer` (error 153).
- Al pasar a reproducir se mueve el foco al `iframe` para que quien usa
  teclado no lo pierda.
- La sección «Vídeos» va después de la cabecera y antes de
  «Ediciones», en una rejilla de una columna en móvil y dos en
  escritorio. Usa el mismo `Section` que el resto de la ficha.

Alternativas descartadas: `lite-youtube-embed` u otra librería. Son
pocas líneas, y una librería de web components complica la hidratación
y no aporta la miniatura local.

### Datos estructurados

`VideogameDetail` emite un `<script type="application/ld+json">` con un
`VideoObject` por vídeo: `name`, `description` (el título y el juego),
`thumbnailUrl` (miniatura local con `SITE_URL`), `uploadDate`,
`contentUrl` (`youtube.com/watch?v=…`) y `embedUrl`
(`youtube-nocookie.com/embed/…`). Se pinta igual en servidor y
navegador, así que entra en el HTML prerenderizado.

### Comprobación de disponibilidad

Script `scripts/check-videos.mjs` y receta `just check-videos`:

- Por cada vídeo pide
  `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json`,
  que no necesita clave de API.
- `200`: disponible; si `author_name` no coincide con `channel`, avisa
  (puede que se haya colado un vídeo de otro canal).
- `401` o `403`: el vídeo existe pero no se puede empotrar; avisa.
- `404` u otro error: retirado o privado; avisa.
- Fallo de red: un único aviso de que no se ha podido comprobar.
- Si se ejecuta en Actions (`GITHUB_ACTIONS=true`), cada aviso sale como
  `::warning file=<ficha>::<mensaje>`, que GitHub muestra como anotación
  en la ejecución y en la PR. El script siempre termina con código 0.
- En `test.yml`, un paso nuevo después de los tests con
  `continue-on-error: true` como red de seguridad.

Alternativa descartada: la API de datos de YouTube. Necesita una clave y
un secreto más, y `oembed` basta para saber si el vídeo se puede ver y
empotrar.

### Página legal

Un párrafo en el apartado de privacidad: los vídeos de las fichas no se
cargan hasta que el lector los reproduce; al hacerlo, el navegador se
conecta con YouTube en su modo de privacidad mejorada, y se aplica la
política de privacidad de Google. La frase «Este sitio no usa cookies»
sigue siendo cierta para el propio sitio.

### Carga de datos por lotes

Igual que en `add-videojuegos`: primero los juegos de 2020 y 2010, que
son los que tienen vídeos oficiales casi seguro, y después los de 2000
y anteriores, donde lo normal es que no haya ninguno (las
remasterizaciones sí suelen tenerlo). Cada lote termina con
`just check` y `just check-videos`.

## Risks / Trade-offs

- [Vídeos retirados o hechos privados con el tiempo] → La comprobación
  de `test.yml` lo señala en cada PR sin bloquear; basta con quitar el
  vídeo de la ficha y su miniatura.
- [Canales oficiales que reorganizan o borran su catálogo al cerrar o
  vender un estudio] → Mismo tratamiento; si no queda ningún vídeo
  oficial, la sección desaparece sola.
- [`autoplay` tras el clic no siempre funciona en móvil, que puede pedir
  un segundo toque] → Aceptable: el reproductor ya está cargado y se ve
  el botón de YouTube.
- [Las miniaturas aumentan el repositorio] → Unas 120 imágenes JPEG de
  100–250 KB, entre 15 y 30 MB. Si pesa demasiado, convertirlas a WebP
  con `sharp` en el script de descarga.
- [Avisos que nadie lee] → Las anotaciones aparecen en la PR; la skill
  `novedades` también ejecuta `just check-videos` al revisar.
- [Hay juegos antiguos sin canal oficial vivo] → Es el comportamiento
  esperado: sin vídeo oficial, no hay vídeos.

## Migration Plan

El campo es opcional, así que el esquema, el componente y los scripts
pueden publicarse antes de cargar ningún vídeo. Para deshacer, basta con
retirar la sección de la ficha; los datos pueden quedarse sin efecto.

## Open Questions

- Si además de en cada PR conviene ejecutar `just check-videos` de forma
  programada (por ejemplo, semanal) para detectar vídeos retirados en
  épocas sin cambios. Se puede añadir después sin tocar nada más.
