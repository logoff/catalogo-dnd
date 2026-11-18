# Proposal

## Why

Quien llega a la ficha de un libro desde Google suele querer saber si
merece la pena comprarlo, y el catálogo solo le da los datos de la
edición. Sí hay medios que reseñan los libros de D&D con criterio, y
algunos ponen nota (Wargamer, por ejemplo, lo hace con casi todos desde
2021). En cambio, no hay ningún agregador tipo Metacritic que los
reúna. Una sección con las reseñas de medios reputados, identificados
con claridad y enlazados, responde a esa pregunta sin inventar una
métrica.

## What Changes

- Campo opcional `reviews` en los productos (no en cada publicación).
  Cada reseña lleva el medio, la URL, el idioma, el autor, la fecha, la
  nota en la escala del propio medio si la tiene y un resumen propio en
  castellano. No se copia texto del medio.
- Un indicador opcional en cada reseña para las que valoran la edición
  en castellano o su traducción.
- Lista cerrada de medios aceptados en `data/review-outlets.json`, con
  el nombre, la web, el idioma y la escala de la nota. Un test exige que
  cada reseña apunte a un medio de la lista y que la nota quepa en su
  escala.
- Sección «Reseñas» en la ficha de producto. Solo aparece si hay
  reseñas. Muestra cada medio con su nombre, el enlace a la reseña, su
  idioma y su nota tal cual («9/10», «4/5»). **No hay media ni nota
  agregada**, y las notas no se emiten como `AggregateRating` ni
  `Review` en los datos estructurados.
- Receta `just check-reviews`, que avisa de reseñas con enlace roto. Se
  ejecuta en Actions sin bloquear, como `check-videos`. Otra receta,
  `just reviews-coverage`, lista los libros que aún no tienen reseñas.
- Skill nueva `add-review`, para buscar y dar de alta las reseñas de un
  libro o de un lote. La skill `novedades` buscará también reseñas
  nuevas de los libros recién publicados.
- Carga inicial: los 55 libros de 5E (41 de 2014 y 14 de 2024) con al
  menos una reseña cada uno, también las aventuras y los suplementos
  antiguos de 2014. Wargamer es la fuente principal. Para los libros
  que no tengan reseña en los medios generalistas se recurre a medios
  especializados en rol con redacción propia. Al terminar la carga, un
  test exige que ningún libro se quede sin reseña.

Fuera de alcance: accesorios, cajas, videojuegos, merchandising y
novelas; notas de usuarios (RPGGeek, Goodreads, Amazon); medias o notas
normalizadas; reseñas propias del sitio.

## Capabilities

### New Capabilities

- `product-reviews`: qué reseñas de medios se guardan de cada libro y de
  qué medios, cómo se muestran en la ficha sin agregarlas y cómo se
  vigila que sus enlaces sigan vivos.

### Modified Capabilities

Ninguna. No hay specs de la ficha de producto, y lo demás de la ficha
no cambia.

## Impact

- **Datos:** `data/schemas/product.jsonschema` (campo `reviews`),
  esquema y lista nuevos para los medios
  (`data/schemas/review-outlets.jsonschema`,
  `data/review-outlets.json`) y los JSON de
  `data/{2014,2024}/products/01_books/`.
- **Código:** tipos en `src/types/index.ts`, `ProductDetailPage.tsx`
  y un componente nuevo de reseñas en `src/components/products/`.
  También tests de datos en `dataLoader.test.ts`.
- **Build y CI:** `scripts/check-reviews.mjs`, una receta en el
  `justfile` y un paso no bloqueante en `.github/workflows/test.yml`.
- **Herramientas:** skill nueva `.claude/skills/add-review`, la skill
  `novedades`, `CLAUDE.md` y el README.
- **Externo:** ninguna API ni clave. La comprobación solo hace
  peticiones HTTP a las URLs de las reseñas.
