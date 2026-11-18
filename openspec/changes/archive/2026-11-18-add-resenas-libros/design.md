# Design

## Context

- Los productos son JSON en `data/{2014,2024}/products/`, que se cargan
  con `import.meta.glob` en `dataLoader.ts` y se pintan en
  `ProductDetailPage.tsx` + `ProductDetail.tsx`. La ficha de producto
  aún no emite JSON-LD. Las de novelas y videojuegos sí lo hacen.
- `product.jsonschema` existe, pero ningún test valida los productos
  contra él. Los loaders de merchandising, novelas y videojuegos sí lo
  hacen con Ajv, que ya es dependencia del proyecto.
- `check-videos.mjs` es el modelo de vigilancia: lee los datos con un
  helper (`videogames.mjs`), avisa con `::warning` en Actions, termina
  siempre con 0 y está en `test.yml` con `continue-on-error`.
- `affiliate-coverage.mjs` es el modelo de un listado de huecos para
  cargar datos por lotes.
- Ver proposal.md para la motivación y el alcance, y
  `specs/product-reviews/spec.md` para los requisitos.

## Goals / Non-Goals

**Goals:**

- Un modelo de datos pequeño y validado por tests, que deje fuera las
  reseñas mal formadas o de medios no aceptados.
- Que dar de alta reseñas sea un trabajo repetible por lotes desde una
  skill, con un listado de los libros que aún no tienen ninguna.

**Non-Goals:**

- Logotipos de los medios: el nombre en texto basta y evita problemas
  de marca y de peso.
- Extraer reseñas o notas de forma automática: la selección y el
  resumen son trabajo editorial.
- Ordenar o filtrar el catálogo por reseñas.

## Decisions

### Forma de los datos

En el producto, junto a `description`:

```json
"reviews": [
  {
    "outlet": "wargamer",
    "url": "https://www.wargamer.com/dnd/2024-players-handbook-review",
    "language": "english",
    "date": "2024-08-29",
    "author": "Mollie Russell",
    "score": 9,
    "summary": "Más accesible que nunca para quien empieza…",
    "spanish_edition": true
  }
]
```

- `language` reutiliza los valores `english` / `castellano` de las
  publicaciones.
- `spanish_edition` solo se escribe cuando es `true`.
- `summary` es un texto propio de 1 a 3 frases, con un máximo de 400
  caracteres en el esquema. Así se escribe un resumen y no un extracto
  del medio.
- `date` es la fecha de publicación original de la reseña (formato
  `date`). Si el medio solo muestra la fecha de actualización, la skill
  explica cómo deducir la original (URL de las imágenes, archivo de la
  web) y, si no se puede, usar la de actualización.
- Va en el producto y no en la publicación: una reseña valora el
  contenido del libro, que es el mismo en todas sus ediciones. La marca
  `spanish_edition` cubre la excepción.

Alternativa descartada: reseñas por publicación. Obliga a repetir la
misma reseña en la edición normal y en la de portada alternativa, y no
aporta nada.

### Medios en un archivo aparte

`data/review-outlets.json` es un array de
`{ id, name, url, language, scale? }`, con su esquema en
`data/schemas/review-outlets.jsonschema`. `scale` es el máximo de la
nota (10, 5, 100). Si no hay `scale`, el medio no pone nota numérica.
Las notas con letra (la «B» de EN World) no se guardan como nota: el
resumen puede mencionarla.

El archivo hace que «reputado» sea una decisión tomada una sola vez.
Además, el nombre y la escala se escriben en un único sitio. La lista
inicial sale de la carga: Wargamer, Gamereactor, GamesRadar+, IGN,
TechRadar, EN World, Polygon, Dicebreaker, Bell of Lost Souls,
GamingTrend y, en castellano, Vidaextra, 3DJuegos y los que aparezcan
con análisis de verdad.

Criterio de entrada, que se documenta en la skill: medio editorial con
redacción y firma, y una reseña que analiza el libro y da un veredicto.
Quedan fuera los foros (incluidos los hilos de EN World), los vídeos y
las notas de usuarios.

Todos los libros deben tener reseña. Para conseguirlo sin abrir la
puerta a cualquier blog, la búsqueda va en dos escalones (lo documenta
la skill):

1. **Medios generalistas de juegos y cultura**: Wargamer, Polygon,
   Dicebreaker, GamesRadar+, IGN, Gizmodo/io9, Nerdist, CBR y similares.
   Cubren bien los libros desde ~2017 y los grandes de antes.
2. **Medios especializados en rol con trayectoria y redacción
   propia**: EN World (sus reseñas publicadas como artículo), RPG.net
   (sección de reseñas), Bell of Lost Souls, Geek Native, Tribality,
   GeekDad, Bleeding Cool, Sly Flourish y similares. Son la vía para las
   aventuras y los suplementos de 2014-2016, que casi no tuvieron
   cobertura generalista.

Un medio del segundo escalón entra en la lista si lleva años publicando
reseñas de rol firmadas y no es la web de una sola persona sin otros
autores. La excepción son las firmas de referencia del sector, como Sly
Flourish. Si de un libro solo hay reseñas que no cumplen esto, la skill
lo anota en el informe del lote y lo deja pendiente para decidirlo con
el usuario. No se rebaja el criterio en silencio.

### Validación

- Se añade a `dataLoader.test.ts` la validación con Ajv de todos los
  productos contra `product.jsonschema`. Si algún dato actual no pasa,
  se corrige en la misma tarea. Si el esquema está mal, se ajusta.
- Las reglas que el esquema no puede expresar van como tests aparte:
  medio existente, nota dentro de la escala, ningún medio sin escala con
  nota, URL única por libro, `spanish_edition` solo con edición en
  castellano, y reseñas solo en productos de `type: book`.

### Presentación

Un componente `ProductReviews.tsx` en `src/components/products/`. Va en
`ProductDetailPage.tsx` tras la descripción y antes de las ediciones,
porque responde a la misma pregunta que la cabecera: qué es y si merece
la pena.

```text
Reseñas
+-----------------------------------------------------------+
| Wargamer                                  9/10            |
| En inglés · Mollie Russell · 29 ago 2024                  |
| Más accesible que nunca para quien empieza...             |
| Leer la reseña en Wargamer ->                             |
+-----------------------------------------------------------+
| Vidaextra                     Edición en castellano       |
| En castellano · 2 abr 2025                                |
| ...                                                       |
+-----------------------------------------------------------+
```

- Orden: de la más reciente a la más antigua. Es estable y no premia a
  ninguna nota.
- La nota se muestra como `score/scale` con el mismo peso en todas, sin
  colores de semáforo, que sugerirían una comparación entre escalas.
- El enlace usa `target="_blank" rel="noopener noreferrer"`, igual que
  los enlaces externos de `ProductDetail.tsx`.
- La fecha se formatea con `formatDate` de `@/utils/formatters`.
- No usa `window` ni nada del navegador, así que se prerenderiza igual
  que el resto de la ficha.

Se descarta añadir JSON-LD `Review`. Las normas de Google para los
fragmentos de reseñas no aceptan reseñas copiadas o agregadas de otros
sitios, y una penalización manual pesa más que cualquier ganancia.

### Vigilancia: `check-reviews`

`scripts/reviews.mjs` exporta `allReviews()`, que lee los JSON de
productos con `fs`, igual que `videogames.mjs`. Lo usan dos scripts:

- `scripts/check-reviews.mjs` (`just check-reviews`): hace una petición
  `GET` a cada URL con un `User-Agent` de navegador, un tiempo límite y
  pocas peticiones a la vez. **Solo avisa con 404 y 410**, y cuando la
  redirección acaba en la portada del medio (la ruta final es `/`). Los
  403 y 429 (Cloudflare, límites de peticiones) y los 5xx no se dan por
  rotos: se cuentan como «no comprobadas» en el resumen final. Termina
  siempre con 0, y un fallo de red da un único aviso, igual que
  `check-videos`.
- `scripts/reviews-coverage.mjs` (`just reviews-coverage`): lista los
  libros sin reseñas, agrupados por edición y categoría. Es el punto de
  partida de la skill para los lotes.

Alternativa descartada: hacer `HEAD`. Muchos medios responden 405 o 403
a `HEAD`, y se generarían avisos falsos.

### Skills

- **`add-review`** (nueva, `.claude/skills/add-review/SKILL.md`), para
  un libro o un lote. Parte de `just reviews-coverage`, busca primero en
  Wargamer y después en el resto de medios de la lista, y lee cada
  reseña antes de resumirla. Documenta el criterio de medios, cómo
  añadir uno nuevo, la regla de no copiar frases (resumen propio en
  castellano, sin comillas del medio), cómo anotar la nota y la marca
  `spanish_edition`. Termina con `just check` y `just check-reviews`.
- **`novedades`**: un apartado nuevo. Para los libros publicados en los
  últimos tres meses, busca reseñas nuevas con la misma pauta que
  `add-review` y ejecuta `just check-reviews`.

## Risks / Trade-offs

- [Libros de 2014 sin reseña en los medios generalistas, sobre todo
  aventuras antiguas y libros menores] → Se busca en el segundo escalón
  de medios especializados. Los casos que ni así se resuelvan se
  deciden uno a uno con el usuario. El test de cobertura se activa al
  final de la carga, cuando `reviews-coverage` esté vacío, para no
  bloquear los lotes intermedios.
- [El test de cobertura depende de la fecha de hoy: el día que sale un
  libro, fallaría en cualquier PR sin que nadie haya tocado nada] → Los
  libros publicados hace menos de 90 días quedan exentos. Ese margen
  coincide con el repaso de reseñas de los últimos tres meses que hace
  la skill `novedades`.
- [El resumen se acerca demasiado al texto del medio] → La skill exige
  redactarlo después de leer la reseña entera, sin citas. El límite de
  400 caracteres impide copiar párrafos.
- [Wargamer y otros medios bloquean las peticiones automáticas con
  Cloudflare] → `check-reviews` solo avisa con 404 o 410. Lo dudoso no
  se cuenta como roto.
- [Las reseñas cambian de URL al rediseñar el medio] → Las detecta
  `check-reviews` cuando la redirección va a la portada. Las que
  redirigen a la nueva URL siguen funcionando.
- [Un medio que deja de ser fiable] → Se quita de la lista, y los tests
  señalan todas sus reseñas para retirarlas.
- [Validar todos los productos con el esquema destapa errores
  antiguos] → Se corrigen en la tarea de validación, antes de añadir
  ninguna reseña.

## Migration Plan

Es un campo opcional, así que no hay migración. Se despliega como
siempre (PR → Cloudflare Pages). Si hay que dar marcha atrás, basta con
revertir la PR: los datos no dependen de nada más.
