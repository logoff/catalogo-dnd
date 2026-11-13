---
name: add-merchandise
description: Añadir un artículo de merchandising oficial de D&D al catálogo (libros licenciados que no son de reglas, figuras y juguetes, juegos de mesa y cartas). Usa esta skill cuando el usuario quiera dar de alta merchandising, completar un artículo del inventario o rellenar un lote.
argument-hint: "[título o número del inventario]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch
---

# Añadir un artículo de merchandising

La lista maestra está en `data/merchandising/inventory.md`: todo
artículo que se añada debe estar ahí. Si no está, consulta al usuario si
entra según el alcance de `merchandise-records` (spec en
`openspec/specs/` o, mientras no se haya archivado la change, en
`openspec/changes/add-merchandising/specs/`).

## Argumentos

`$ARGUMENTS`

## Reglas de los datos

- **Solo licencia oficial y desde 2014.** Nada de productos de fans ni
  imitaciones, aunque se vendan en Amazon con «D&D» en el título.
- **Fuera:** libros de reglas, novelas y cómics, dados, ropa y
  complementos.
- **Nada inventado.** Cada dato sale de una fuente que se pueda citar.
  Si no se encuentra, el campo se omite. La fuente es la página oficial
  del fabricante o de Wizards (también su copia en el Internet Archive si
  el producto está descatalogado; muchas webs, como las de WizKids o
  Funko, necesitan Chrome porque cargan con JavaScript). Solo si no
  existe ninguna, vale la ficha del producto en Amazon o en un
  distribuidor.
- **Todo lo que sale entra, aunque solo se venda en inglés:** así se ve
  qué llega a España y qué no.
- **Ediciones por idioma.** Una edición por idioma (`english`,
  `castellano`); los artículos sin texto (figuras, LEGO) llevan una
  edición sin idioma. Cada edición en castellano lleva `spain`: `true`
  si se publicó en España, `false` si solo fuera (por ejemplo, las
  ediciones de DK en español para Estados Unidos).
- **Una ficha por libro, por juego (las expansiones que se venden aparte
  tienen ficha propia) y por línea u ola de figuras**, no por variante.
  Si un juego tiene muchas expansiones o está descatalogado, pueden ir
  en su misma ficha, en `expansions` (título y fecha), como en
  _Dragonfire_.
  Las líneas con decenas de sets, como Icons of the Realms, van en una
  sola ficha con los sets en la descripción.
- **URLs de compra limpias**, sin parámetros de afiliado (el afiliado se
  añade en el build) y solo a tiendas del esquema: `amazon`,
  `generacion_x` y `juegos_mesa_redonda`. En Amazon, la forma
  `https://www.amazon.es/dp/<código>/`; en libros el código es el
  ISBN-10.

## Grupos y tipos

| Grupo (`group`) | Tipos (`kind`)                                                |
| --------------- | ------------------------------------------------------------- |
| `books`         | `cookbook`, `craft_book`, `art_book`, `guide_book`            |
| `figures`       | `funko`, `lego`, `figure`, `plush`, `collectible_miniature`   |
| `games`         | `board_game`, `card_game`                                     |

## Fuentes recomendadas

- **Licencia, fecha y fabricante:** web del fabricante (Penguin Random
  House, LEGO, Funko, Hasbro, WizKids…), Wizards y D&D Beyond.
- **Edición en castellano:** Planeta (Minotauro) para libros; DK en
  español; para juegos, catálogos de Hasbro España y distribuidoras.
- **Enlace de Amazon e imagen:** `https://www.amazon.es/dp/<código>/`.
  La búsqueda de Amazon.es da el código, y la imagen principal sale del
  atributo `data-old-hires` de la página del producto.

Comprueba con `curl` que las URLs de compra responden y que el título de
la página corresponde al producto (y al idioma: hay ediciones francesas y
alemanas con códigos parecidos).

## Pasos

1. **Buscar el artículo en el inventario** y anotar grupo, tipo y si hay
   edición en castellano.
2. **Reunir los datos** con las fuentes de arriba.
3. **Descargar las imágenes** en
   `public/images/merchandising/<slug>/0.jpg` (la principal primero; la
   portada en castellano o más fotos con `1`, `2`…). Revísalas.
4. **Escribir el JSON** en `data/merchandising/items/<grupo>/<slug>.json`.
   El nombre del archivo es el slug, en kebab-case. Esquema:
   `data/schemas/merchandise.jsonschema`. Obligatorios: `slug`, `title`,
   `group`, `kind`, `manufacturer`, `description`, `source`, `editions` e
   `images`. Si tiene relación con un libro o un videojuego del
   catálogo, añade `related_products` o `related_videogames`.
5. **Descripción propia de dos párrafos** separados por `\n\n`: qué es y
   qué trae; para quién es y si está en castellano en España. Sin
   copiar textos de tiendas ni del fabricante. Pide al usuario que la
   revise.
6. **Marcar la ficha en el inventario**: cambia `pendiente` por el slug
   en la columna «Ficha» y actualiza la fuente si la has cambiado.
7. **Verificar** con `just check` (los tests validan el esquema, la
   carpeta del grupo, la descripción, las imágenes, las URLs, las
   relaciones y la coherencia con el inventario) y, si hace falta, mira
   la ficha con `just dev` en `/merchandising/<slug>`.

## Ejemplos

- `data/merchandising/items/books/heroes-feast.json`: libro con edición
  en inglés y en castellano publicada en España.
- `data/merchandising/items/figures/lego-ideas-21348-red-dragons-tale.json`:
  juguete con una edición sin idioma.
