# Design

## Context

- Las reseñas de los libros de rol ya existen (spec `product-reviews`):
  - `$defs/review` en `product.jsonschema`;
  - la lista de medios `data/review-outlets.json` con su esquema;
  - `getReviewOutlet()` y `getAllReviewOutlets()` en `dataLoader.ts`;
  - las reglas cruzadas (medio, escala, URL única) como función de test
    en `dataLoader.test.ts`;
  - `ProductReviews.tsx` para la ficha;
  - `scripts/reviews.mjs` y `check-reviews.mjs`.
- Las novelas son cientos de fichas y no van en el bundle principal:
  cada ficha es un trozo aparte y un plugin de `vite.config.ts` genera
  un índice ligero para el listado. `novelLoader.test.ts` valida las
  fichas con Ajv (`ajv.addSchema(novelSchema)`).
- Cada novela enlaza su ficha de ISFDB en `source`. ISFDB lista las
  reseñas publicadas: en una muestra de 30 novelas, 8 tenían alguna,
  casi todas en revistas de papel de 1987-1990.
- hawes.com publica en PDF la lista semanal de superventas de **tapa
  dura** del NYT de 1985 a 2026 (`/AAAA/AAAA-MM-DD.pdf`), con el título,
  el autor y la editorial de cada libro. Las listas de bolsillo no están
  ahí.
- Ver proposal.md para la motivación y `specs/novel-reviews/spec.md`
  para los requisitos.

## Goals / Non-Goals

**Goals:**

- Un único modelo de reseña para libros de rol y novelas, con las mismas
  reglas y el mismo componente.
- Que la ficha de novela no cargue los datos de los productos por usar
  la lista de medios.
- Encontrar todas las novelas de D&D que entraron en la lista de tapa
  dura del NYT de forma sistemática, no de memoria.

**Non-Goals:**

- Filtros u orden del listado de novelas por reseñas o superventas: el
  índice ligero no cambia.
- Buscar de forma sistemática las listas de bolsillo, que no tienen un
  archivo público equivalente.

## Decisions

### Esquema de reseña compartido

`$defs/review` sale de `product.jsonschema` a un esquema propio,
`data/schemas/review.jsonschema` (`$id: /schemas/review`), y los dos
esquemas lo referencian con `$ref`. Los tests de productos y de novelas
lo añaden a su instancia de Ajv con `addSchema`.

Alternativa descartada: copiar la definición en `novel.jsonschema`. Se
desincronizarían con el primer campo nuevo.

### Medios en un módulo propio

`getReviewOutlet()` y `getAllReviewOutlets()` pasan a
`src/services/reviewOutlets.ts`, que solo importa
`data/review-outlets.json`. `dataLoader.ts` deja de exportarlos y los
llamantes importan del módulo nuevo. Así la ficha de novela no arrastra
el `import.meta.glob` de todos los productos.

### Reglas cruzadas como función común

La función de test `reviewProblems` sale de `dataLoader.test.ts` a
`src/utils/reviewRules.ts` como función pura
(`reviewProblems(id, reviews, outletLookup)`). Comprueba el medio, la
escala, la nota sin escala y la URL repetida. Los tests de productos
siguen comprobando además las reglas propias de los libros (solo
`type: book`, `spanish_edition` con edición en castellano y la
cobertura). Los de novelas usan la misma función sin esas reglas.

### Componente compartido

`ProductReviews.tsx` y su test pasan a
`src/components/common/MediaReviews.tsx`, sin cambios de
comportamiento. `ProductDetailPage.tsx` y `NovelDetail.tsx` lo usan.
En la ficha de novela va después de los datos principales y antes de
«Ediciones en castellano», como en los libros de rol.

### Marca de superventas

```json
"bestseller": {
  "list": "hardcover",
  "date": "1992-09-27",
  "source": "https://www.hawes.com/1992/1992-09-27.pdf"
}
```

- `list`: `hardcover` o `paperback`.
- `date`: la fecha de la lista (domingo) de la primera semana.
- `source`: URL obligatoria.
- Va en la novela, no en la edición: es la obra la que fue superventas.

Se muestra en la cabecera de la ficha, junto a los datos principales,
como «Superventas de The New York Times» con el mes y el año y la
lista entre paréntesis. El texto enlaza a `source` en una pestaña nueva.
Componente pequeño propio, `NovelBestseller.tsx`.

### Búsqueda en las listas de Hawes

Un script de un solo uso (fuera del repo):

1. Descarga cada PDF semanal de 1985 a 2026 (unos 2.200) a una carpeta
   temporal, con una petición por segundo para no cargar el servidor.
2. Extrae el texto con `pdftotext` y se queda con las entradas cuya
   editorial es TSR, Wizards of the Coast o Wizards.
3. Agrupa por título y da la primera semana de cada uno.
4. Cruza los títulos con las fichas, normalizando mayúsculas y
   artículos.

Cada coincidencia se revisa a mano antes de escribirla, porque Wizards
también publica libros que no son novelas de D&D, como los de Magic.

Para las de bolsillo, la fuente es la lista del archivo del NYT que
citan los artículos de Wikipedia (`nytimes.com/…/paperback-best-sellers-…`),
o en su defecto otra fuente citable con lista y fecha. Como no hay un
archivo completo de esas listas, la fecha es la primera semana
documentada, que puede no ser la primera real. Sin fecha comprobable, no
hay marca.

### Reseñas: medios y carga

Se usa la lista de medios de los libros de rol, con el mismo criterio
(medio editorial con firma y una reseña que da veredicto) y añadiendo
los de literatura fantástica que aparezcan: Publishers Weekly, Kirkus,
Black Gate, SF Site, Fantasy Book Review, Grimdark Magazine… Las fuentes
para encontrarlos, por orden:

1. las reseñas online que liste ISFDB en la ficha de cada novela;
2. Reactor (antes Tor.com), con su relectura de la Dragonlance;
3. búsqueda web por título para la lista prioritaria.

La carga empieza por la lista prioritaria del proposal y se para ahí: no
hay test de cobertura.

### Scripts

`scripts/reviews.mjs` gana `allNovelReviews()` y `allReviews()` pasa a
devolver las de libros y novelas, con la ruta de cada JSON.
`check-reviews.mjs` no cambia. `reviews-coverage.mjs` usa `allBooks()` y
sigue siendo solo de libros.

## Risks / Trade-offs

- [Pocas novelas tendrán reseña] → Es lo esperado y lo que se decidió. La
  sección solo aparece cuando hay reseñas.
- [Hawes es un archivo privado de las listas del NYT y podría
  desaparecer] → `check-reviews` no lo vigila, pero el PDF es solo la
  fuente de un dato histórico que no cambia. Si cae, se cambia el enlace
  por el archivo del NYT o por Wikipedia.
- [Homónimos en la búsqueda en las listas (un libro de Magic de
  Wizards)] → Revisión manual de cada coincidencia con el autor.
- [Las novelas de bolsillo superventas quedan sin marca si no hay fuente
  citable] → Se prefiere no marcar a marcar sin pruebas.
- [Mover el componente y los medios rompe imports] → Lo detectan
  TypeScript y los tests en la misma tarea.

## Migration Plan

Campos opcionales: no hace falta migrar. El refactor (esquema común,
módulo de medios y componente) va primero y se comprueba con los tests
de los libros de rol antes de tocar las novelas.
