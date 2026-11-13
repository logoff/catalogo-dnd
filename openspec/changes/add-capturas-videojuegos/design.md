# Design

## Context

Ver `proposal.md` para la motivación y
`specs/videogame-screenshots/spec.md` para los requisitos.

Estado actual que condiciona el enfoque:

- El campo `images` de cada ficha solo guarda la portada
  (`public/images/videogames/<slug>/0.jpg`), que la cabecera pinta con
  `LazyImage` y abre en `ImageLightbox`.
- `ImageLightbox` recibe una lista de rutas, navega con flechas y cierra
  con Escape, pero pone siempre el texto alternativo genérico
  «Imagen N».
- Los vídeos (`add-videos-videojuegos`) ya siguen el patrón que se quiere
  repetir: datos en la ficha, imagen local derivada, script de descarga
  en `scripts/` con receta `just`, sección propia en
  `VideogameDetail.tsx` y test que exige que cada imagen exista.
- `sharp` ya es dependencia (lo usa `scripts/prerender.mjs`).
- 24 fichas enlazan a Steam y 19 a GOG. La API de Steam
  (`store.steampowered.com/api/appdetails?appids=<id>&filters=screenshots`)
  devuelve las capturas que sube la editora, a 1920×1080.

## Goals / Non-Goals

**Goals:**

- Ficha sin peticiones a terceros, como con los vídeos.
- Peso contenido: una ficha con seis capturas solo descarga las
  miniaturas hasta que el lector abre una.
- Añadir capturas a una ficha con un solo comando.

**Non-Goals:**

- Generar las imágenes durante el build: el servidor de desarrollo y los
  tests tienen que ver las mismas imágenes que producción.
- Pie de foto o descripción por captura.
- Detección automática de si una fuente es oficial: es un criterio
  editorial al dar de alta las capturas.

## Decisions

### Datos: lista `screenshots` con imagen y fuente

```json
"screenshots": [
  {
    "image": "/images/videogames/baldurs-gate-3/screenshot-1.webp",
    "source": "https://store.steampowered.com/app/1086940/"
  }
]
```

- `image`: ruta de la captura ampliada, con el patrón
  `^/images/videogames/[a-z0-9-]+/screenshot-\d+\.webp$`.
- `source`: página oficial de donde sale (la ficha de Steam o GOG, la
  web oficial o el kit de prensa), no la URL de la imagen, que suele
  cambiar.
- La miniatura no se guarda en los datos: se deriva cambiando
  `.webp` por `-thumb.webp`. `videogameLoader` añade `thumbnail` a cada
  captura en `VideogameWithMeta`, como hace con los vídeos.
- El esquema pone `maxItems: 6` y `additionalProperties: false`. Las
  capturas repetidas las detecta un test de `videogameLoader.test.ts`.

Alternativa descartada: guardar solo el número de captura y derivar la
ruta. La ruta explícita es más fácil de revisar y sigue el estilo de
`images`.

### Imágenes: WebP a dos tamaños, generadas al descargar

Un script `scripts/download-screenshots.mjs` (receta
`just screenshots <slug> [fuente…]`) descarga cada captura, la convierte
con `sharp` y la guarda en `public/images/videogames/<slug>/`:

- `screenshot-N.webp`: ancho máximo 1280 px, calidad 80 (unos 100–150
  KB).
- `screenshot-N-thumb.webp`: 400 px de ancho, calidad 75 (unos 15–25
  KB).

Formas de uso:

- `just screenshots <slug> --steam`: toma el `appid` del enlace de
  Steam de la ficha, pide a la API de Steam sus capturas y se queda con
  las seis primeras (el orden de la página de Steam lo elige la
  editora). Anota `source` con la página de Steam.
- `just screenshots <slug> --source <página> <url-imagen>…`: para GOG,
  webs oficiales y kits de prensa, con URLs elegidas a mano.

El script añade las entradas a la ficha a continuación de las que haya,
sin pasar de seis, y numera los archivos a partir del siguiente libre.

Alternativas descartadas:

- Generar las versiones con `sharp` en el build, como las vistas
  previas de `prerender.mjs`: el servidor de desarrollo no las tendría y
  habría que guardar igualmente los originales, más pesados.
- Guardar los JPEG originales: unas cinco veces más peso para una
  diferencia que no se aprecia en la ficha.

### Galería y visor

Componente nuevo `ScreenshotGallery` en `src/components/videogames/`:

```text
+------------------------------------------------+
| Capturas                                       |
|  [mini 1] [mini 2] [mini 3]      2 col. movil  |
|  [mini 4] [mini 5] [mini 6]      3 escritorio  |
+------------------------------------------------+
        | clic o Enter en una miniatura
        v
  ImageLightbox(images = capturas ampliadas, initialIndex = i,
                alt = "<juego>: captura i de n")
```

- Cada miniatura es un `<button>` con la imagen dentro (`loading="lazy"`,
  relación 16:9 con `object-cover`), así que se activa con ratón,
  Enter o espacio sin código extra.
- Texto alternativo: «<título del juego>: captura N de M», igual en la
  miniatura y en el visor.
- Se reutiliza `ImageLightbox` añadiéndole una prop opcional
  `alts?: string[]`; si no se pasa, mantiene «Imagen N», así que la
  portada no cambia.
- La sección va después de «Vídeos» y antes de «Ediciones», con el
  mismo `Section` que el resto de la ficha.
- La galería no lleva datos estructurados: Schema.org no aporta nada
  útil para capturas de una ficha que no es un producto en venta.

Alternativa descartada: meter las capturas en la cabecera junto a la
portada, en el mismo `images`. Mezclaría la portada que identifica el
juego con material de otro tipo y descolocaría la cabecera con seis
imágenes más.

### Página legal

En el apartado de propiedad intelectual, la frase sobre los videojuegos
pasa a incluir las capturas: proceden de las páginas oficiales de cada
juego (tiendas, webs y kits de prensa) y se muestran solo para darlo a
conocer.

### Carga de datos por lotes

- Primero los juegos con enlace a Steam, con `--steam`.
- Después los de GOG sin Steam (sobre todo los clásicos de SSI y los
  relanzamientos de SNEG), eligiendo a mano las capturas de su página.
- Al final los que no se venden: web oficial o kit de prensa si
  existen; si no, sin capturas.

Cada lote termina con `just check`.

## Risks / Trade-offs

- [Las capturas de Steam a veces son arte promocional, no capturas del
  juego] → Revisar las seis primeras al cargar cada lote y quitar las
  que no sean capturas reales.
- [Peso del repositorio] → Con unos 60 juegos y seis capturas, unos
  40 MB. Si fuera mucho, bajar a cuatro capturas o reducir la calidad;
  el script lo centraliza.
- [Capturas de juegos cerrados u online, que no tienen tienda] →
  Normalmente sin capturas; aceptable, como con los vídeos.
- [Derechos de imagen] → Solo material promocional oficial, con la
  fuente anotada y la mención en la página legal; el formulario de
  contacto para retiradas ya existe.

## Migration Plan

El campo es opcional: el esquema, la galería y el script pueden
publicarse antes de cargar capturas. Para deshacer basta con quitar la
sección de la ficha.
