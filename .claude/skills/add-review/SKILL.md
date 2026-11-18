---
name: add-review
description: Buscar y añadir reseñas de medios reputados a los libros de D&D de 2014 y 2024 del catálogo, con su nota si la tienen y un resumen propio en castellano. Usa esta skill cuando el usuario quiera añadir reseñas, completar las de un libro o cargar un lote.
argument-hint: "[código o título del libro, o un lote: 2024, 2014 aventuras…]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch
---

# Añadir reseñas a los libros

Las reseñas van en el campo `reviews` de cada libro
(`data/{2014,2024}/products/01_books/`). Los medios aceptados están en
`data/review-outlets.json`. La spec es `product-reviews` (en
`openspec/specs/` o, mientras no se haya archivado la change, en
`openspec/changes/add-resenas-libros/specs/`).

## Argumentos

`$ARGUMENTS`

Sin argumentos, o con un lote, parte de `just reviews-coverage`: lista
los libros publicados que aún no tienen reseñas. **Todo libro publicado
en inglés tiene que acabar con al menos una reseña**, también las
aventuras y los suplementos antiguos de 2014. Un test lo exige a los
libros publicados hace más de 90 días.

## 1. Dónde buscar

Busca en dos escalones, por este orden:

1. **Medios generalistas**: Wargamer primero (reseña casi todos los
   libros desde 2021 y pone nota sobre 10). Después Polygon,
   Dicebreaker, GamesRadar+, IGN, Gamereactor, TechRadar, GamingTrend,
   Gizmodo/io9, Nerdist, CBR y similares.
2. **Medios especializados en rol** con trayectoria y redacción propia:
   EN World (sus reseñas publicadas como artículo, no los hilos del
   foro), RPG.net (sección de reseñas), Bell of Lost Souls, Geek Native,
   Tribality, GeekDad, Bleeding Cool, Sly Flourish y similares. Son la vía
   para los libros de 2014-2016, que casi no tuvieron cobertura
   generalista.

En castellano, Vidaextra, 3DJuegos y los que hagan **análisis** de
verdad. Las notas de prensa y los «primeras impresiones» de una
noticia no cuentan.

WebSearch con «`<título en inglés> review`» y «`<título> review site:<medio>`».
Las páginas se leen con WebFetch o, mejor, con `curl` y un `User-Agent` de
navegador: así se obtienen también los metadatos (`datePublished`,
`author`). Si un medio carga con JavaScript o bloquea, usa Chrome.

## 2. Qué medio vale

Un medio entra si:

- es editorial, con redacción y artículos firmados, y
- la pieza analiza el libro y da un veredicto, con nota o sin ella.

Quedan fuera los foros, los vídeos, las notas de usuarios (RPGGeek,
Goodreads, Amazon) y la web de una sola persona sin más autores. La
excepción son las firmas de referencia del sector, como Sly Flourish.

**Medio nuevo:** añádelo a `data/review-outlets.json` con `id` (en
minúsculas, con guiones), `name` tal como se escribe el medio, `url` de
la portada, `language` y `scale` (el máximo de la nota: 10, 5, 100)
**solo si el medio pone nota numérica**. Las notas con letra (la «B» de
EN World) no son escala: se mencionan en el resumen, si acaso.

Si de un libro solo hay reseñas que no cumplen estos criterios, **no
rebajes el criterio en silencio**: anótalo en el informe para que el
usuario decida.

## 3. Cuántas por libro

Las mejores de cada libro, normalmente de 1 a 4. Antes que acumular
varias reseñas que dicen lo mismo, prefiere variedad de medios, una con
nota y, si existe, una en castellano.

## 4. Campos

```json
{
  "outlet": "wargamer",
  "url": "https://www.wargamer.com/dnd/2024-players-handbook-review",
  "language": "english",
  "date": "2024-08-01",
  "author": "Mollie Russell",
  "score": 9,
  "summary": "Se sigue jugando como la quinta edición…"
}
```

- **`outlet`**: el `id` del medio en `data/review-outlets.json`.
- **`url`**: la de la reseña, limpia (sin parámetros de seguimiento ni
  `#anclas`).
- **`language`**: el de la reseña (`english` o `castellano`).
- **`date`**: la fecha de publicación **original**. Muchos medios
  muestran solo la de actualización: busca `datePublished` o
  `article:published_time` en el HTML. Si no aparece, sirven la ruta de
  las imágenes (`/2024/08/`) o el Internet Archive. Si no hay forma de
  saberla, usa la de actualización.
- **`author`**: la firma, si la hay.
- **`score`**: la nota tal cual la da el medio, en su escala (8, 4.5,
  85). Solo si el medio tiene `scale`. Nunca la conviertas ni la
  redondees.
- **`summary`**: **resumen propio en castellano**, de 1 a 3 frases y un
  máximo de 400 caracteres. Léete la reseña entera antes de escribirlo.
  Recoge el veredicto: qué destaca, qué critica y para quién es. **No
  copies ni traduzcas frases del medio, y no pongas citas entre
  comillas.**
- **`spanish_edition`**: `true` solo si la reseña valora la edición en
  castellano o su traducción. Exige que el libro tenga edición en
  castellano. Si no aplica, omite el campo.

El campo `reviews` va justo después de `description`.

## 5. Informar antes de tocar nada

Presenta al usuario una tabla por libro: medio, nota, fecha, enlace y el
resumen propuesto. Añade los libros sin ninguna reseña válida, con lo que
has encontrado y por qué no vale. **No cambies los datos hasta que el
usuario confirme.**

## 6. Aplicar y comprobar

1. Escribe las reseñas en los JSON y formatea con
   `npx prettier --write <archivos>`.
2. `just check`: valida el esquema, el medio, la escala de la nota, las
   URLs repetidas y la marca `spanish_edition`.
3. `just check-reviews`: no debe avisar de ningún enlace roto.
4. `just reviews-coverage`: los libros del lote ya no deben aparecer.

Después abre un PR siguiendo el estilo habitual del repositorio (breve:
qué se hace, qué queda, comprobaciones).
