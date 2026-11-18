# Tasks

## 1. Modelo de datos y validación

- [x] 1.1 Añadir a `dataLoader.test.ts` la validación con Ajv de todos
      los productos contra `data/schemas/product.jsonschema` y corregir
      los datos o el esquema que no pasen; verificar con `just test` en
      verde sin añadir todavía ninguna reseña
- [x] 1.2 Crear `data/schemas/review-outlets.jsonschema` y
      `data/review-outlets.json` con los medios iniciales del diseño
      (`id`, `name`, `url`, `language`, `scale` opcional); verificar
      con un test que valida el archivo y exige `id` únicos
- [x] 1.3 Añadir el campo `reviews` a `product.jsonschema` (`outlet`,
      `url`, `language`, `date`, `summary` de hasta 400 caracteres,
      `author`, `score` y `spanish_edition` opcionales, sin propiedades
      extra) y el tipo `Review` en `src/types/index.ts`; verificar con
      tests de que una reseña válida pasa y que una sin `summary` o con
      una propiedad desconocida falla
- [x] 1.4 Añadir los tests de reglas cruzadas: medio existente, nota
      dentro de la escala, ningún medio sin escala con nota, URL única
      por libro, `spanish_edition` solo con edición en castellano y
      reseñas solo en productos de `type: book`; verificar que cada
      test falla con un producto de prueba incorrecto y pasa con los
      datos reales

## 2. Ficha

- [x] 2.1 Crear `src/components/products/ProductReviews.tsx` según el
      diseño (medio, idioma, nota `score/scale`, autor, fecha, resumen,
      marca de edición en castellano, enlace con
      `target="_blank" rel="noopener noreferrer"`, orden de más reciente
      a más antigua); verificar con tests de componente para una reseña
      con nota, una sin nota y sin autor, una de la edición en
      castellano y el orden
- [x] 2.2 Montarla en `ProductDetailPage.tsx` entre la descripción y
      las ediciones, solo si hay reseñas; añadir al _PHB_ de 2024 su
      reseña de Wargamer como ficha piloto; verificar con un test de
      página con y sin reseñas, y que ningún texto de la página contiene
      una media
- [x] 2.3 Verificar tras `just build` que `dist/producto/2024/phb.html`
      contiene «Wargamer», «9/10» y el enlace a la reseña, y que no hay
      ningún `Review` ni `AggregateRating`; comprobar en `just dev` que
      se ve bien en escritorio y en móvil

## 3. Herramientas

- [x] 3.1 Crear `scripts/reviews.mjs` (`allReviews()`) y
      `scripts/check-reviews.mjs` con la receta `just check-reviews`
      según el diseño (GET con `User-Agent` de navegador, tiempo límite,
      pocas peticiones a la vez, aviso solo con 404/410 o redirección a
      la portada, 403/429/5xx como no comprobadas, aviso único sin red,
      `::warning` en Actions, salida siempre 0); verificar con la ficha
      piloto y con una URL inventada en una ficha temporal
- [ ] 3.2 Añadir el paso `node scripts/check-reviews.mjs` a
      `.github/workflows/test.yml` con `continue-on-error: true`;
      verificar en la PR que el workflow termina en verde
- [x] 3.3 Crear `scripts/reviews-coverage.mjs` y la receta
      `just reviews-coverage` (libros sin reseñas por edición y
      categoría); verificar que lista 54 libros con la ficha piloto
- [x] 3.4 Crear la skill `.claude/skills/add-review/SKILL.md` (punto de
      partida en `reviews-coverage`, orden de búsqueda, criterio de
      medios y cómo añadir uno, resumen propio sin citas, nota, fecha
      original, `spanish_edition`, cierre con `just check` y
      `just check-reviews`); verificar leyendo la skill que cubre cada
      campo del esquema
- [x] 3.5 Añadir a la skill `novedades` el apartado de reseñas de los
      libros publicados en los últimos tres meses; verificar leyendo la
      skill
- [x] 3.6 Documentar `reviews`, `review-outlets.json`, las dos recetas y
      la skill en `CLAUDE.md` y el README; verificar con `just check`
      (markdownlint y Prettier)

## 4. Carga de reseñas

- [x] 4.1 Lote de 2024 (14 libros) con la skill `add-review`; verificar
      con `just check`, `just check-reviews` sin avisos y
      `just reviews-coverage` sin ningún libro del lote (los que no
      tengan reseña en un medio aceptado se deciden con el usuario
      antes de cerrar el lote)
- [x] 4.2 Lote de 2014: reglas básicas y suplementos (11 libros);
      verificar igual que 4.1
- [x] 4.3 Lote de 2014: escenarios (7 libros); verificar igual que 4.1
- [x] 4.4 Lote de 2014: aventuras (23 libros); verificar igual que 4.1
- [x] 4.5 Revisar las reseñas en castellano y marcar con
      `spanish_edition` las que valoran la edición española; verificar
      con `just test` y viendo una ficha marcada en `just dev`
- [x] 4.6 Activar el test de cobertura (todo libro publicado en inglés
      tiene al menos una reseña; quedan exentos los anunciados y los
      publicados hace menos de 90 días);
      verificar que pasa con los datos reales, que falla quitando las
      reseñas de un libro y que `just reviews-coverage` sale vacío

## Workflow follow-up

- Abrir la PR con las comprobaciones y, tras la revisión y el
  despliegue, archivar `add-resenas-libros`.
