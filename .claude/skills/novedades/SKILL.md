---
name: novedades
description: Poner al día las fechas de las novedades de D&D en inglés y, sobre todo, en castellano. Usa esta skill cuando el usuario pida revisar novedades, lanzamientos, fechas en castellano o si ha salido algo nuevo.
argument-hint: "[título o código concreto, opcional]"
---

# Poner al día las novedades

El objetivo es que los datos (y con ellos la guía «¿Cuándo sale en
castellano?» y las fichas) reflejen lo último anunciado. En inglés es
fácil; en castellano la información está dispersa y hay que contrastarla.

Si hay argumentos, céntrate en ese producto: `$ARGUMENTS`

## 1. Qué hay que vigilar

Ejecuta `just novedades`. Lista, para la línea 2024:

- anunciados en inglés sin fecha;
- fechas futuras en inglés y en castellano (pueden moverse);
- libros, cajas y accesorios sin edición en castellano.

Además, busca productos anunciados que **aún no estén en el catálogo**.

## 2. Inglés

Fuentes oficiales, en este orden:

1. **D&D Beyond**: anuncios en <https://www.dndbeyond.com/posts> y fichas
   del marketplace.
2. **WPN**: <https://wpn.wizards.com/en/products>. Cada ficha indica la
   fecha de lanzamiento. El listado se carga con JavaScript: ábrelo con
   Chrome; las fichas sueltas se pueden leer con WebFetch.

Las webs de fans y los calendarios recopilados (EN World, DnDFan,
Wargamer…) sirven para saber qué buscar, no como fuente de una fecha.

## 3. Castellano

No hay un listado oficial único. Prueba estas fuentes, por orden de
fiabilidad:

1. **WPN en español**: las ediciones en castellano tienen su propia ficha
   en `https://wpn.wizards.com/es/products/...` con «Fecha de
   lanzamiento». Las fichas se leen con WebFetch o `curl`, pero el
   listado necesita Chrome. Para encontrarlas, busca
   `site:wpn.wizards.com/es` junto al título en castellano o en inglés.
   Ojo: WPN en español también muestra las ediciones **inglesas** con la
   interfaz en castellano; comprueba que la ficha sea de la edición en
   castellano (título traducido, idioma).
2. **Amazon.es**: las ediciones en castellano suelen aparecer antes en
   reserva. Son de Wizards si el ISBN empieza por **978-0-7869** y el
   idioma es español. Usa Chrome.
3. **Tiendas españolas**: Generación X y Juegos de la Mesa Redonda abren
   reservas con fecha. Sus buscadores usan JavaScript: usa Chrome.
4. **Noticias**: WebSearch con «<título> castellano fecha» o «Wizards of
   the Coast castellano <título>». Akiba Station suele publicar los
   anuncios de Wizards en español.
5. **El usuario**: le llegan fechas por grupos de Telegram. Si no
   encuentras nada, pregúntale.

Reddit no se puede consultar con las herramientas: está bloqueado.

## 4. Cuándo dar un dato por bueno

- **Fecha o título oficial** (Wizards, WPN, D&D Beyond): válido.
- **Solo tiendas**: válido si al menos dos coinciden. Si solo hay una,
  propónlo al usuario indicando que es provisional y deja que decida.
- **Título en castellano**: nunca lo traduzcas tú. Solo vale el que
  aparezca en una fuente oficial o en una tienda con el ISBN de Wizards.
- Si las fuentes no coinciden, no elijas: enséñale ambas al usuario.

## 5. Informar antes de tocar nada

Presenta al usuario una tabla con lo encontrado: producto, dato actual,
dato nuevo y enlace a la fuente. Incluye también lo que has buscado sin
encontrar nada, para que sepa que está revisado. **No cambies los datos
hasta que el usuario confirme.**

## 6. Aplicar los cambios

- **Fecha nueva o corregida**: edita el `date` de la publicación en su
  JSON (la ruta sale en `just novedades`).
- **Edición en castellano nueva**: añade una publicación con
  `language: "castellano"` al producto existente, siguiendo las
  convenciones de la skill `add-product` (campos, ISBN como número,
  imágenes en `public/images/products/2024/<código>/`).
- **Producto nuevo**: usa la skill `add-product`.

Después ejecuta `just check` y `npm run build`, y abre un PR siguiendo el
estilo habitual del repositorio (breve: qué se hace, qué queda,
comprobaciones). La guía «¿Cuándo sale en castellano?» se actualiza sola
a partir de los datos.

Cuando entre una fecha en castellano nueva, recuérdale al usuario que es
buen momento para volver a compartir la guía.
