# Spec Delta

## Purpose

Define qué novelas oficiales de D&D entran en la sección de novelas y qué
datos verificables se guardan de cada una, de su serie y de sus ediciones
en inglés y en castellano.

## ADDED Requirements

### Requirement: Alcance de novelas

La sección SHALL incluir toda novela oficial de Dungeons & Dragons
publicada en inglés con licencia de TSR o Wizards of the Coast, de
cualquier año y mundo de campaña: novelas, novelas juveniles e
infantiles, novelas publicadas solo en ebook o solo en la web de Wizards
o de su autor, novelas cortas y relatos publicados como libro o ebook
independiente, y las guías narrativas de Dragonlance (_Bertrem's Guide_).

#### Scenario: Novela de Dragonlance de 1984

- **WHEN** se propone _Dragons of Autumn Twilight_
- **THEN** entra en la sección, en el mundo Dragonlance

#### Scenario: Novela solo en ebook

- **WHEN** una novela oficial se publicó solo en formato electrónico
- **THEN** entra en la sección

#### Scenario: Novela corta publicada sola

- **WHEN** una novela corta se publicó como libro independiente
- **THEN** entra en la sección

#### Scenario: Relato publicado solo como ebook

- **WHEN** un relato de Salvatore se vendió como ebook independiente
- **THEN** entra en la sección

#### Scenario: Novela publicada solo en la web

- **WHEN** una novela solo se publicó en la web de Wizards
- **THEN** entra en la sección, con su edición web y sin enlaces de compra

### Requirement: Exclusiones del alcance

La sección SHALL dejar fuera los relatos y novelas cortas publicados
solo dentro de antologías o revistas, las antologías, los librojuegos, poemas, ensayos, cómics,
novelas gráficas, audiolibros como fichas aparte, novelas de juegos que
no son D&D y ficción de fans.

#### Scenario: Librojuego de Endless Quest

- **WHEN** se propone un libro de _Endless Quest_
- **THEN** no entra en la sección

#### Scenario: Novela corta de una antología

- **WHEN** una novela corta solo salió dentro de una antología
- **THEN** no entra en la sección

### Requirement: Inventario maestro

Todas las novelas de la sección SHALL figurar en un inventario maestro,
y toda ficha publicada SHALL figurar en él y al revés.

#### Scenario: Ficha fuera del inventario

- **WHEN** existe la ficha de una novela que no está en el inventario
- **THEN** los tests del proyecto fallan

#### Scenario: Inventario con ficha inexistente

- **WHEN** el inventario indica una ficha que no existe
- **THEN** los tests del proyecto fallan

### Requirement: Datos de la novela

Cada novela SHALL guardar su título original, sus autores, su mundo de
campaña de una lista cerrada, la fecha de su primera edición en inglés y
una fuente que confirme que es oficial. MAY guardar el título en
castellano.

#### Scenario: Novela sin fuente

- **WHEN** una novela no indica ninguna fuente
- **THEN** los tests del proyecto fallan

#### Scenario: Mundo que no está en la lista

- **WHEN** una novela indica un mundo de campaña que no está en la lista
- **THEN** los tests del proyecto fallan

### Requirement: Fuentes válidas

La fuente de una novela o de una edición SHALL ser, por este orden de
preferencia: la página de la editorial o de Wizards (o su copia en el
Internet Archive), la base de datos oficial de ISBN del país de la
edición y, solo si no hay ninguna, una base bibliográfica reconocida.

#### Scenario: Novela descatalogada de los noventa

- **WHEN** ni la editorial ni Wizards conservan página de la novela, ni
  archivada
- **THEN** la fuente puede ser una base bibliográfica reconocida

### Requirement: Serie y orden de lectura

Una novela SHALL poder pertenecer a una serie, con su número dentro de
ella, y cada serie SHALL tener nombre original, nombre en castellano si
existe y mundo de campaña.

#### Scenario: Novela de una trilogía

- **WHEN** _Homeland_ es la primera novela de _The Dark Elf Trilogy_
- **THEN** su ficha indica esa serie y el número 1

#### Scenario: Serie inexistente

- **WHEN** una novela indica una serie que no está definida
- **THEN** los tests del proyecto fallan

#### Scenario: Número repetido

- **WHEN** dos novelas de la misma serie tienen el mismo número
- **THEN** los tests del proyecto fallan

### Requirement: Ediciones en inglés

Cada edición en inglés que confirme una fuente SHALL constar con su
editorial, fecha, formato, ISBN si lo tiene e indicación del país de
publicación, y una novela SHALL tener al menos una edición en inglés.

#### Scenario: Novela sin edición en inglés

- **WHEN** una novela no tiene ninguna edición en inglés
- **THEN** los tests del proyecto fallan

#### Scenario: Novela con varias ediciones en inglés

- **WHEN** una novela salió en rústica en 1988, en tapa dura en una
  reedición de 2005, en ebook y en una edición británica
- **THEN** constan las cuatro ediciones, cada una con su editorial, año,
  formato e ISBN

### Requirement: Qué cuenta como edición

En cualquier idioma, SHALL contar como edición distinta cada publicación
con ISBN propio, o, sin ISBN, con editorial, formato o portada distintos;
las reimpresiones sin ISBN nuevo y los audiolibros no SHALL constar como
ediciones.

#### Scenario: Reimpresión con la misma portada e ISBN

- **WHEN** una novela tiene diez reimpresiones con el mismo ISBN
- **THEN** consta una sola edición

#### Scenario: Ebook

- **WHEN** una novela tiene edición en ebook con ISBN propio
- **THEN** consta como edición con formato ebook

#### Scenario: Ebook a la venta en Kindle

- **WHEN** la ficha Kindle de Amazon.es indica el ISBN de una edición ebook
- **THEN** esa edición lleva el enlace de compra a la ficha Kindle

### Requirement: Ediciones en castellano

Cada edición en castellano que confirme una fuente SHALL constar con su
título, editorial, fecha, ISBN si lo tiene e indicación de si se publicó
en España; sin fuente que la confirme no SHALL constar ninguna.

#### Scenario: Novela traducida dos veces

- **WHEN** una novela salió en castellano en Timun Mas y años después en
  otra editorial
- **THEN** constan las dos ediciones en castellano, cada una con su
  editorial y su año

#### Scenario: Novela nunca traducida

- **WHEN** no hay fuente de ninguna edición en castellano
- **THEN** la novela solo tiene ediciones en inglés y cuenta como no
  traducida

### Requirement: Recopilatorios

Un recopilatorio que reúne varias novelas en un volumen (en inglés o en
castellano) SHALL guardarse una sola vez, en su serie, con su idioma,
título, editorial, fecha, ISBN si lo tiene y las novelas que contiene,
cada una de las cuales SHALL existir.

#### Scenario: Trilogía en un volumen

- **WHEN** las tres novelas de una trilogía se reeditaron juntas en un
  volumen
- **THEN** el recopilatorio consta una vez en la serie con las tres
  novelas que contiene, y no como edición de cada novela

#### Scenario: Recopilatorio con una novela inexistente

- **WHEN** un recopilatorio indica una novela que no tiene ficha
- **THEN** los tests del proyecto fallan

### Requirement: ISBN válidos

Los ISBN guardados SHALL ser ISBN-13 con dígito de control correcto (los
ISBN-10 antiguos se convierten) y no SHALL repetirse entre ediciones ni
recopilatorios.

#### Scenario: ISBN mal copiado

- **WHEN** un ISBN tiene el dígito de control incorrecto
- **THEN** los tests del proyecto fallan

### Requirement: Descripción propia

Cada novela SHALL tener una descripción propia en castellano de dos
párrafos, sin destripar el final ni copiar textos de la editorial o de
tiendas: de qué trata y dónde encaja en su serie y su mundo.

#### Scenario: Novela sin descripción

- **WHEN** una novela no tiene descripción de dos párrafos
- **THEN** los tests del proyecto fallan

### Requirement: Portadas locales

Cada novela SHALL tener la portada de al menos una edición servida desde
el propio sitio, salvo las publicadas solo en la web, que MAY no tenerla;
cada edición MAY tener la suya.

#### Scenario: Novela web sin portada

- **WHEN** una novela publicada solo en la web no tiene portada
- **THEN** los tests pasan y la novela se muestra con una portada genérica

#### Scenario: Portada inexistente

- **WHEN** una novela o una edición referencia una portada que no existe
  en el sitio
- **THEN** los tests del proyecto fallan

### Requirement: URLs de compra limpias

Los enlaces de compra SHALL guardarse sin parámetros de afiliado y solo
a tiendas que el sitio ya conoce; el afiliado se añade al construir el
enlace.

#### Scenario: Enlace con afiliado en los datos

- **WHEN** un enlace de compra guardado lleva un parámetro de afiliado
- **THEN** los tests del proyecto fallan

### Requirement: Relación con el resto del catálogo

Una novela SHALL poder enlazar a libros, videojuegos y artículos de
merchandising del catálogo, y cada enlace SHALL apuntar a una ficha que
exista.

#### Scenario: Novela de un videojuego

- **WHEN** una novela enlaza a un videojuego que no tiene ficha
- **THEN** los tests del proyecto fallan
