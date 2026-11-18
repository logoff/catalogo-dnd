# novel-reviews Specification

## Purpose

Define qué reseñas de medios y qué marca de superventas de The New York
Times lleva cada novela, de qué fuentes salen, cómo se muestran en su
ficha y cómo se vigilan sus enlaces.

## Requirements

### Requirement: Reseñas de medios aceptados

Una novela SHALL poder llevar reseñas de los medios de la lista de medios
aceptados, la misma que usan los libros de rol. Cada reseña guarda el
medio, la URL, el idioma, la fecha y un resumen propio en castellano. El
autor y la nota, en la escala del medio, son opcionales. Una novela no
puede tener dos reseñas con la misma URL.

#### Scenario: Reseña de un medio de la lista

- **WHEN** una novela tiene una reseña de un medio de la lista con su
  resumen
- **THEN** los tests del proyecto pasan

#### Scenario: Medio que no está en la lista

- **WHEN** una reseña de una novela apunta a un medio que no está en la
  lista
- **THEN** los tests del proyecto fallan

#### Scenario: Nota fuera de escala

- **WHEN** una reseña tiene una nota mayor que la escala de su medio, o
  una nota de un medio sin escala
- **THEN** los tests del proyecto fallan

### Requirement: Reseñas sin cobertura obligatoria

Las reseñas de novelas SHALL ser opcionales: una novela sin reseña en un
medio aceptado no lleva reseñas, y ningún test exige que las tenga.

#### Scenario: Novela sin reseñas

- **WHEN** una novela publicada hace años no tiene ninguna reseña
- **THEN** los tests del proyecto pasan y su ficha no muestra la sección
  «Reseñas»

### Requirement: Solo reseñas enlazables

Cada reseña de novela SHALL tener una URL pública donde se pueda leer.
Las reseñas publicadas solo en revistas de papel sin una copia legítima
en línea no se guardan.

#### Scenario: Reseña de una revista de papel

- **WHEN** la única reseña de una novela es de una revista de papel de
  los años 80 sin copia legítima en línea
- **THEN** la novela no lleva esa reseña

### Requirement: Sin valoraciones de usuarios

El sitio SHALL no mostrar valoraciones ni medias de usuarios de ninguna
fuente (Goodreads, Amazon, StoryGraph, Open Library, ISFDB…) en las
novelas, ni emitir las reseñas como `Review` o `AggregateRating` en los
datos estructurados.

#### Scenario: HTML de una novela con reseñas

- **WHEN** se genera el HTML de la ficha de una novela con reseñas
- **THEN** no contiene ninguna valoración de usuarios ni ningún `Review`
  o `AggregateRating` de schema.org

### Requirement: Marca de superventas

Una novela que entró en la lista de superventas de The New York Times
SHALL guardar la fecha de la primera semana en la lista, la lista (tapa
dura o bolsillo) y una fuente que lo demuestre. La fuente es el PDF de
esa lista semanal en hawes.com y, si no está ahí, otra fuente citable
que nombre la lista y la fecha.

#### Scenario: Novela en la lista de tapa dura

- **WHEN** una novela aparece en la lista de tapa dura del 27 de
  septiembre de 1992
- **THEN** su ficha guarda esa fecha, la lista de tapa dura y el enlace
  al PDF de esa semana

#### Scenario: Marca sin fuente

- **WHEN** una novela tiene la marca de superventas sin fuente
- **THEN** los tests del proyecto fallan

### Requirement: Reseñas y superventas en la ficha

La ficha de una novela con reseñas SHALL mostrar la sección «Reseñas»
igual que la de los libros de rol: medio, idioma, nota con escala si la
hay, autor, fecha, resumen y enlace en una pestaña nueva. Una novela con
la marca de superventas SHALL mostrar «Superventas de The New York
Times» con el mes y el año y un enlace a la fuente. Las dos cosas están
en el HTML prerenderizado.

#### Scenario: Novela con reseña y superventas

- **WHEN** una novela tiene una reseña y la marca de superventas
- **THEN** su ficha muestra la sección «Reseñas» y la marca con su fecha
  y enlace, también sin JavaScript

#### Scenario: Novela sin ninguna de las dos

- **WHEN** una novela no tiene reseñas ni marca de superventas
- **THEN** su ficha no muestra ninguna de las dos

### Requirement: Vigilancia de los enlaces

La comprobación de enlaces de reseñas SHALL incluir las reseñas de las
novelas, con los mismos criterios que las de los libros de rol: avisa de
404, 410, redirecciones a la portada y dominios que no responden, sin
bloquear la build.

#### Scenario: Reseña de novela con enlace roto

- **WHEN** la URL de una reseña de novela devuelve un 404
- **THEN** la comprobación avisa indicando la ficha de la novela y la URL
