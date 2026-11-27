# releases-page Specification

## Purpose

Define la página de novedades: qué lanzamientos de todas las secciones
muestra, cómo los agrupa y filtra, cómo se mantiene al día sin intervención
y cómo se mide.

## Requirements

### Requirement: Qué es una novedad

La página `/novedades` SHALL reunir las ediciones de todas las secciones del
catálogo: libros de 5E y 5.5E, videojuegos, merchandising, novelas, otros
juegos de rol y ediciones anteriores de D&D, en inglés y en castellano. Cada
entrada SHALL llevar el título de la edición, su fecha, la sección, el
idioma y un enlace a su ficha. Las ediciones de una misma ficha con la misma
fecha y el mismo título (formatos distintos) SHALL contar como una sola
entrada.

#### Scenario: Una novela en dos formatos

- **WHEN** una novela sale en castellano en tapa blanda y en ebook el mismo
  día
- **THEN** la página muestra una sola entrada para esa edición

#### Scenario: Edición en castellano

- **WHEN** una entrada es de una edición en castellano
- **THEN** lo indica con la marca de castellano del sistema de diseño

### Requirement: Recién salido

La página SHALL mostrar las ediciones publicadas en los últimos 90 días,
contando hasta el día de la última actualización del sitio, agrupadas por
mes de la más reciente a la más antigua y, dentro de cada mes, por fecha.
Las ediciones con fecha de mes sin día SHALL contar desde el día 1 de ese
mes. Las que solo tienen el año NO SHALL aparecer en este bloque.

#### Scenario: Lanzamiento de hace dos semanas

- **WHEN** un libro salió en inglés hace 14 días
- **THEN** aparece en «Recién salido», en el grupo de su mes

#### Scenario: Lanzamiento antiguo

- **WHEN** una edición salió hace 120 días
- **THEN** no aparece en la página

### Requirement: Próximamente

La página SHALL mostrar las ediciones con fecha posterior al día de la última
actualización, agrupadas por mes de la más próxima a la más lejana, y aparte
los productos anunciados sin fecha o solo con un año posterior al actual. Si
no hay ninguna, el bloque NO SHALL mostrarse.

#### Scenario: Anunciado sin fecha

- **WHEN** un libro de 5.5E está anunciado en inglés sin fecha
- **THEN** aparece en «Próximamente», en el apartado de anunciados sin
  fecha

#### Scenario: Solo el año

- **WHEN** una edición en castellano tiene como fecha solo el año siguiente
- **THEN** aparece entre los anunciados con ese año como fecha

#### Scenario: Nada anunciado

- **WHEN** no hay ediciones futuras ni anunciadas
- **THEN** la página no muestra el bloque «Próximamente»

### Requirement: Filtro por idioma

La página SHALL permitir ver todas las entradas, solo las de castellano o
solo las de inglés, con un control segmentado. El primer render SHALL
mostrar todas, tanto en el servidor como en el navegador.

#### Scenario: Solo castellano

- **WHEN** se elige «Castellano»
- **THEN** solo quedan las entradas de ediciones en castellano y los meses
  que se quedan vacíos desaparecen

### Requirement: Actualización diaria

El sitio SHALL volver a publicarse una vez al día aunque no cambien los
datos, para que una edición pase de «Próximamente» a «Recién salido» el día
de su fecha y desaparezca a los 90 días sin intervención manual.

#### Scenario: Llega la fecha

- **WHEN** una edición tenía fecha futura y llega ese día
- **THEN** tras la publicación diaria aparece en «Recién salido» y no en
  «Próximamente»

### Requirement: Acceso y descubrimiento

La página SHALL enlazarse desde el menú principal, desde la portada y desde
el sitemap, y anunciar el feed Atom de novedades. Su título y su descripción
SHALL decir que reúne las novedades de D&D en inglés y en castellano.

#### Scenario: Desde el menú

- **WHEN** se abre el menú principal en escritorio o en móvil
- **THEN** hay un enlace a `/novedades`

### Requirement: Medición

Cada enlace de una entrada SHALL lanzar un evento de Umami con la sección y
el idioma de la entrada, para medir qué se visita desde la página.

#### Scenario: Clic en una entrada

- **WHEN** se pulsa una entrada de una novela en castellano
- **THEN** se registra el evento con la sección «novelas» y el idioma
  «castellano»
