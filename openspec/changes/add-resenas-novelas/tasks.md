# Tasks

## 1. Piezas comunes de las reseñas

- [x] 1.1 Sacar `$defs/review` de `product.jsonschema` a
      `data/schemas/review.jsonschema` y referenciarlo desde
      `product.jsonschema`; añadir el esquema a Ajv en
      `dataLoader.test.ts`; verificar con `just test` (los tests de
      reseñas de libros siguen pasando)
- [x] 1.2 Crear `src/services/reviewOutlets.ts` con
      `getReviewOutlet()` y `getAllReviewOutlets()`, quitarlos de
      `dataLoader.ts` y actualizar los imports; verificar con
      `just check`
- [x] 1.3 Mover las reglas cruzadas a `src/utils/reviewRules.ts`
      (`reviewProblems`) y usarlas desde `dataLoader.test.ts`, dejando
      allí las reglas propias de los libros; verificar con `just test` y
      con los tests de reglas existentes
- [x] 1.4 Mover `ProductReviews.tsx` y su test a
      `src/components/common/MediaReviews.tsx` y actualizar
      `ProductDetailPage.tsx`; verificar con `just check` y que
      `dist/producto/2024/phb.html` sigue mostrando sus reseñas tras
      `just build`

## 2. Datos de las novelas

- [x] 2.1 Añadir `reviews` (con `$ref` al esquema común) y `bestseller`
      (`list`, `date`, `source`, todos obligatorios, sin propiedades
      extra) a `novel.jsonschema` y los tipos de novela; añadir el
      esquema común a Ajv en `novelLoader.test.ts`; verificar con tests
      de que una novela con reseña y marca válidas pasa y que una marca
      sin `source` o con una lista desconocida falla
- [x] 2.2 Añadir a `novelLoader.test.ts` las reglas cruzadas de las
      reseñas de novelas con `reviewProblems`; verificar que fallan con
      una novela de prueba con medio inexistente, nota fuera de escala o
      URL repetida, y que pasan con los datos reales

## 3. Ficha de novela

- [x] 3.1 Mostrar `MediaReviews` en `NovelDetail.tsx` antes de
      «Ediciones en castellano», solo si hay reseñas; verificar con un
      test de componente con y sin reseñas
- [x] 3.2 Crear `NovelBestseller.tsx` («Superventas de The New York
      Times», mes y año, lista entre paréntesis, enlace a la fuente en
      pestaña nueva) y mostrarlo en la cabecera de la ficha; verificar con
      tests de componente para tapa dura, bolsillo y sin marca
- [x] 3.3 Tras `just build`, verificar que el HTML de una novela con
      reseña y marca contiene las dos, sin `Review` ni `AggregateRating`,
      y revisar la ficha en el navegador en escritorio y en móvil

## 4. Vigilancia y herramientas

- [x] 4.1 Ampliar `scripts/reviews.mjs` para que `allReviews()` incluya
      las reseñas de novelas, manteniendo `reviews-coverage` solo para
      libros; verificar con `just check-reviews` (cuenta las de novelas)
      y `just reviews-coverage` (sin cambios)
- [x] 4.2 Actualizar la skill `add-review` (novelas sin cobertura
      obligatoria, fuentes de ISFDB y Reactor, medios de literatura
      fantástica) y la skill `add-novel` (buscar reseñas y comprobar si
      fue superventas en Hawes); verificar leyendo las skills
- [x] 4.3 Documentar `reviews` y `bestseller` de las novelas en
      `CLAUDE.md` y el README; verificar con `just check`

## 5. Carga

- [x] 5.1 Recorrer las listas de tapa dura de Hawes de 1985 a 2026 con un
      script de un solo uso, cruzar las entradas de TSR y Wizards con las
      fichas, revisar cada coincidencia y añadir `bestseller`; verificar
      con `just test` y anotar en la PR cuántas novelas tienen la marca
- [x] 5.2 Buscar fuentes citables de superventas de bolsillo para las
      novelas con más probabilidad (Crónicas de la Dragonlance y primeras
      de Drizzt) y añadir solo las que tengan lista y fecha comprobables;
      verificar con `just test`
- [x] 5.3 Reseñas de la lista prioritaria (primeros libros de serie,
      Drizzt, Crónicas y Leyendas de la Dragonlance, novelas desde 2020)
      y reseñas online enlazadas desde ISFDB, añadiendo los medios nuevos
      a `data/review-outlets.json`; verificar con `just check`,
      `just check-reviews` sin avisos y la lista de novelas revisadas sin
      reseña válida en la PR

## Workflow follow-up

- Abrir la PR con las comprobaciones y, tras fusionar, archivar
  `add-resenas-novelas`.
