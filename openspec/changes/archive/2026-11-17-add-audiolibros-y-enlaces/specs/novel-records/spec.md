# Spec Delta

## MODIFIED Requirements

### Requirement: Exclusiones del alcance

La sección SHALL dejar fuera como fichas propias los relatos y novelas
cortas publicados solo dentro de antologías o revistas, las antologías,
los librojuegos, poemas, ensayos, cómics, novelas gráficas, audiolibros
como fichas aparte, novelas de juegos que no son D&D y ficción de fans.
Las antologías oficiales de relatos SHALL recogerse como libros
relacionados según la capacidad `novel-anthologies`, sin ficha propia, y
los audiolibros, como ediciones de su novela.

#### Scenario: Librojuego de Endless Quest

- **WHEN** se propone un libro de _Endless Quest_
- **THEN** no entra en la sección

#### Scenario: Novela corta de una antología

- **WHEN** una novela corta solo salió dentro de una antología
- **THEN** no tiene ficha propia, y se llega a ella a través de la
  antología que la contiene

#### Scenario: Antología oficial de relatos

- **WHEN** se propone una antología oficial como _Realms of Valor_
- **THEN** no tiene ficha propia, pero consta como antología relacionada
  con sus series

#### Scenario: Audiolibro de una novela

- **WHEN** una novela con ficha tiene audiolibro
- **THEN** consta como edición de esa novela, no como ficha aparte

### Requirement: Qué cuenta como edición

En cualquier idioma, SHALL contar como edición distinta cada publicación
con ISBN propio, o, sin ISBN, con editorial, formato o portada distintos;
las reimpresiones sin ISBN nuevo no SHALL constar como ediciones. Los
audiolibros SHALL constar como edición con formato audiolibro solo si se
venden en Amazon.es, con su narrador o narradores.

#### Scenario: Reimpresión con la misma portada e ISBN

- **WHEN** una novela tiene diez reimpresiones con el mismo ISBN
- **THEN** consta una sola edición

#### Scenario: Ebook

- **WHEN** una novela tiene edición en ebook con ISBN propio
- **THEN** consta como edición con formato ebook

#### Scenario: Ebook a la venta en Kindle

- **WHEN** la ficha Kindle de Amazon.es indica el ISBN de una edición ebook
- **THEN** esa edición lleva el enlace de compra a la ficha Kindle

#### Scenario: Audiolibro en Audible

- **WHEN** una novela tiene audiolibro a la venta en Amazon.es
- **THEN** consta como edición con formato audiolibro, su idioma, su
  narrador, su fecha y el enlace a la ficha de Amazon.es

#### Scenario: Audiolibro que no se vende en Amazon.es

- **WHEN** un audiolibro solo se vende fuera de Amazon.es
- **THEN** no consta como edición
