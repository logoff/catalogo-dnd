# Tasks

## 1. Modelo de audiolibros

- [x] 1.1 Formato `audiobook` y campos `narrators` y `duration` en
      `novel.jsonschema` y en `src/types/novel.ts`, con nombre «Audiolibro»
      en `novelTranslations.ts`; verificación: tests de validación
      (audiolibro válido, narrador en un formato que no es audiolibro).
- [x] 1.2 Ficha: narrador y duración en la fila de la edición y botón
      «Comprar en Audible»; verificación: tests en
      `NovelDetailPage.test.tsx`.

## 2. Casa del Libro en libros de rol y merchandising

- [x] 2.1 Tienda `casa_del_libro` en `product.jsonschema`,
      `merchandise.jsonschema` y el orden de botones; verificación: tests
      de esquema y de orden (Amazon primero).
- [x] 2.2 Enlaces de Casa del Libro en las 41 publicaciones de libros de
      rol en castellano y en el merchandising en castellano; verificación:
      `just check`.

## 3. Cobertura de enlaces

- [x] 3.1 Script `affiliate-coverage.mjs` y receta `just
affiliate-coverage` con archivo de excepciones; verificación: lista
      los productos sin enlace actuales.
- [x] 3.2 Completar Amazon en libros de rol, merchandising y novelas sin
      enlace, y Juegos de la Mesa Redonda en libros de rol; anotar en
      excepciones lo que no está a la venta; verificación: el informe solo
      deja excepciones.
- [x] 3.3 Instant Gaming en los videojuegos de PC que vende; verificación:
      el informe solo deja excepciones.

## 4. Datos de audiolibros

- [x] 4.1 Buscar en Amazon.es los audiolibros de las novelas (inglés y
      castellano), por mundo y empezando por Dragonlance y Drizzt, con
      ASIN, narrador, fecha, duración y portada; verificación: `just check`
      y una ficha con audiolibro revisada en el navegador.

## 5. Documentación

- [x] 5.1 Skills `add-novel`, `add-product`, `add-merchandise` y
      `add-videogame` (dónde buscar audiolibros y los enlaces de cada
      tienda) y `CLAUDE.md`; verificación: revisión del texto.

Notas de la aplicación: Amazon.es no vende ningún audiolibro en
castellano de estas novelas; entraron 428 en inglés (casi todos de Audible
Studios). Se dejaron fuera los títulos repetidos entre novelas que no se
pueden asignar con seguridad (_Brimstone Angels_, _Shadowbane_, _Sword of
the Gods_, _Unbroken Chain_, _I, Strahd_ y los libros infantiles
«Dungeons & Dragons»). Juegos de la Mesa Redonda no vende ninguno de los 45
libros de rol sin enlace e Instant Gaming ninguno de los 15 juegos; quedan
como excepciones del informe.

## Workflow follow-up

- Archivar el cambio con `/opsx:archive` cuando todas las tareas estén
  hechas.
