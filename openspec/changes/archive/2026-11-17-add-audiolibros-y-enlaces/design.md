# Design

## Context

- Las ediciones de novela tienen `format` (`hardcover`, `paperback`,
  `mass_market`, `ebook`, `web`); el botón de Kindle se deduce de
  `format: ebook` con tienda `amazon`.
- `casa_del_libro` solo existe en `novel.jsonschema`; productos y
  merchandising admiten `amazon`, `generacion_x` y `juegos_mesa_redonda`.
- Cobertura actual: libros de rol 72/81 con Amazon y 36 con JMR;
  videojuegos 11/77 con Instant Gaming; merchandising 41/52 con Amazon;
  novelas 579/619 con Amazon y 63 con Casa del Libro.
- Amazon.es vende los audiolibros de Audible con ficha propia (ASIN
  `B0…`), y entran en el programa de Amazon con la misma etiqueta.

## Goals / Non-Goals

**Goals:**

- Audiolibros como ediciones, reutilizando portadas, botones y tests.
- Usar todas las tiendas aceptadas en todas las secciones donde vendan.

**Non-Goals:**

- Tiendas nuevas (Nextory, El Corte Inglés, Biblio.es, Todos tus libros)
  hasta que acepten la afiliación.
- Audiolibros de las antologías (se pueden añadir después con el mismo
  formato).

## Decisions

1. **Formato `audiobook`** en `NovelFormat`, con campos opcionales
   `narrators` (lista) y `duration` (minutos), solo válidos con ese
   formato (`if/then` en el esquema). Sin ISBN normalmente; la clave de
   portada es `<idioma>-<año>-audiobook`. Alternativa descartada: una
   tienda `audible` aparte, porque Audible no tiene programa propio en
   España y el enlace es de Amazon.es.
2. **Botón «Comprar en Audible»**: `PurchaseButton` muestra «Audible» si
   la edición es `audiobook`, igual que hoy hace con Kindle.
3. **Búsqueda de audiolibros**: en Amazon.es, categoría Audible, por
   título y autor de cada novela, en el navegador del usuario (como los
   enlaces de Kindle). Se anota ASIN, narrador, fecha y duración, y la
   portada de la ficha de Amazon.
4. **Casa del Libro en productos y merchandising**: se añade al enum de
   `product.jsonschema` y `merchandise.jsonschema`; se busca cada ISBN
   en la web de Casa del Libro como en las novelas, y su botón va detrás
   del de Amazon.
5. **Instant Gaming**: búsqueda por título de cada juego de PC; solo
   ediciones de PC con clave para Steam o GOG.
6. **Informe de cobertura**: script `scripts/affiliate-coverage.mjs`
   (receta `just affiliate-coverage`) que lista por sección y tienda las
   fichas sin enlace; las que se revisan y no están a la venta se anotan
   en un archivo de excepciones para que no vuelvan a salir.

## Risks / Trade-offs

- [Volumen de búsquedas: unas 600 novelas en Audible] → se busca por lotes
  con el mismo patrón de `fetch` en el navegador; primero las series más
  populares.
- [Audiolibros con varios ASIN (región, versión abreviada)] → solo la
  versión completa a la venta en Amazon.es.
- [Casa del Libro paga con retraso (semáforo naranja en Awin)] → su botón
  va siempre detrás del de Amazon.
