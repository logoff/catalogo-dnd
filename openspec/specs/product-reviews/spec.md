# product-reviews Specification

## Purpose

Define qué reseñas de medios reputados se guardan de cada libro de 5E,
cómo se muestran en su ficha sin agregarlas en una nota común y cómo se
vigila que sus enlaces sigan vivos.

## Requirements

### Requirement: Solo libros

Las reseñas SHALL poder añadirse únicamente a productos cuyas
publicaciones sean libros (`type: book`), de 2014 o de 2024.

#### Scenario: Reseña en un libro

- **WHEN** un libro de 2014 o de 2024 lleva reseñas
- **THEN** los tests del proyecto pasan

#### Scenario: Reseña en un accesorio o una caja

- **WHEN** un producto cuyas publicaciones son accesorios o cajas lleva
  reseñas
- **THEN** los tests del proyecto fallan

### Requirement: Todos los libros con reseña

Cada libro de 2014 y de 2024 SHALL tener al menos una reseña. La regla
se aplica también a los libros antiguos y a los menores. Quedan exentos
los anunciados que aún no se han publicado en inglés y, durante 90 días
desde su lanzamiento en inglés, los recién publicados, porque las
reseñas tardan en salir.

#### Scenario: Libro publicado sin reseñas

- **WHEN** un libro publicado en inglés hace más de 90 días no tiene
  ninguna reseña
- **THEN** los tests del proyecto fallan indicando el libro

#### Scenario: Libro recién publicado

- **WHEN** un libro salió en inglés hace menos de 90 días y no tiene
  reseñas
- **THEN** los tests del proyecto pasan

#### Scenario: Libro anunciado

- **WHEN** un libro tiene la fecha en inglés en el futuro o no tiene
  fecha
- **THEN** puede no tener reseñas sin que los tests fallen

### Requirement: Lista cerrada de medios

Cada reseña SHALL ser de un medio de la lista de medios aceptados. La
lista guarda de cada medio su nombre, su web, su idioma y, si pone
nota, la escala de la nota.

#### Scenario: Medio que no está en la lista

- **WHEN** una reseña apunta a un medio que no está en la lista
- **THEN** los tests del proyecto fallan

#### Scenario: Medio nuevo

- **WHEN** se añade un medio a la lista con su nombre, web e idioma
- **THEN** sus reseñas pueden añadirse a los libros

### Requirement: Datos de cada reseña

Cada reseña SHALL guardar el medio, la URL de la reseña, su idioma, su
fecha y un resumen propio en castellano. El autor y la nota son
opcionales. Un libro SHALL no tener dos reseñas con la misma URL.

#### Scenario: Reseña sin resumen

- **WHEN** una reseña no tiene resumen
- **THEN** los tests del proyecto fallan

#### Scenario: Reseña repetida

- **WHEN** un libro tiene dos reseñas con la misma URL
- **THEN** los tests del proyecto fallan

### Requirement: Nota en la escala del medio

Si una reseña tiene nota, la nota SHALL estar en la escala del medio,
entre cero y su máximo. Un medio sin escala no puede tener reseñas con
nota.

#### Scenario: Nota fuera de escala

- **WHEN** una reseña de un medio con escala sobre 10 tiene un 12
- **THEN** los tests del proyecto fallan

#### Scenario: Nota en un medio sin escala

- **WHEN** una reseña de un medio que no pone nota tiene nota
- **THEN** los tests del proyecto fallan

### Requirement: Reseñas de la edición en castellano

Una reseña SHALL poder marcarse como reseña de la edición en castellano,
para las que valoran la traducción o la edición española. La marca solo
se permite si el libro tiene una edición en castellano.

#### Scenario: Reseña de la traducción

- **WHEN** una reseña de un medio español valora la traducción del libro
- **THEN** puede marcarse como reseña de la edición en castellano

#### Scenario: Marca en un libro sin edición en castellano

- **WHEN** una reseña está marcada como de la edición en castellano y el
  libro no tiene edición en castellano
- **THEN** los tests del proyecto fallan

### Requirement: Sección de reseñas en la ficha

La ficha de un libro con reseñas SHALL mostrar una sección «Reseñas».
De cada reseña muestra el nombre del medio, el idioma, la nota con su
escala si la hay, el autor y la fecha si constan, el resumen y un
enlace a la reseña original. Las fichas sin reseñas no muestran la
sección.

#### Scenario: Libro con una reseña con nota

- **WHEN** un libro tiene una reseña de Wargamer en inglés con un 9
  sobre 10
- **THEN** la ficha muestra «Wargamer», que está en inglés, la nota
  «9/10», el resumen y un enlace a la reseña

#### Scenario: Reseña sin nota

- **WHEN** una reseña no tiene nota
- **THEN** la ficha la muestra sin nota y sin hueco ni texto de
  sustitución

#### Scenario: Libro sin reseñas

- **WHEN** un libro no tiene reseñas
- **THEN** la ficha no muestra la sección «Reseñas»

#### Scenario: Reseña de la edición en castellano

- **WHEN** una reseña está marcada como de la edición en castellano
- **THEN** la ficha indica que la reseña trata de la edición en
  castellano

### Requirement: Enlaces externos

El enlace a cada reseña SHALL abrirse en una pestaña nueva, sin pasar
el `referrer` ni dar acceso a la página de origen.

#### Scenario: Pulsar en una reseña

- **WHEN** el lector pulsa el enlace de una reseña
- **THEN** la reseña se abre en una pestaña nueva con
  `rel="noopener noreferrer"`

### Requirement: Sin nota agregada

El sitio SHALL no calcular ni mostrar medias, notas normalizadas ni
recuentos de puntuación a partir de las reseñas. Tampoco SHALL emitir
las reseñas como `Review` ni `AggregateRating` en los datos
estructurados.

#### Scenario: Libro con varias reseñas con nota

- **WHEN** un libro tiene reseñas con notas de varios medios
- **THEN** la ficha muestra cada nota por separado y ninguna media

#### Scenario: HTML prerenderizado

- **WHEN** se genera el HTML de la ficha de un libro con reseñas
- **THEN** no contiene ningún `Review` ni `AggregateRating` de
  schema.org

### Requirement: Reseñas en el HTML prerenderizado

La sección «Reseñas» SHALL estar en el HTML prerenderizado de la ficha,
para que se lea sin JavaScript.

#### Scenario: Ficha prerenderizada

- **WHEN** se hace la build de producción
- **THEN** el HTML de la ficha de un libro con reseñas contiene el
  nombre de cada medio y el enlace a cada reseña

### Requirement: Vigilancia de enlaces

El proyecto SHALL tener una comprobación que avisa de las reseñas cuyo
enlace ya no responde. La comprobación no bloquea la build y se
ejecuta en la integración continua.

#### Scenario: Enlace roto

- **WHEN** la URL de una reseña devuelve un error 404 o 410
- **THEN** la comprobación avisa indicando el libro y la URL, y termina
  sin error

#### Scenario: Sin red

- **WHEN** la comprobación no puede conectarse a internet
- **THEN** da un único aviso y termina sin error
