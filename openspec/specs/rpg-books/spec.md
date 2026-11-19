# rpg-books Specification

## Purpose

Define qué libros de otros juegos de rol entran en la sección según el
alcance, qué datos se guardan de cada uno con sus ediciones en inglés y en
castellano, y qué muestra su ficha.

## Requirements

### Requirement: Alcance de los libros

La sección SHALL incluir todo libro publicado en castellano de un sistema de
la sección y, de lo que solo está en inglés, los libros principales (básicos
y caja de inicio) de los sistemas grandes y el catálogo impreso principal de
las editoriales de 5E destacadas, empezando por Kobold Press. El contenido solo
digital de plataformas comunitarias queda fuera.

#### Scenario: Suplemento en castellano

- **WHEN** un suplemento de cualquier sistema de la sección se publicó en
  castellano
- **THEN** entra en la sección con sus ediciones en inglés y en castellano

#### Scenario: Suplemento solo en inglés

- **WHEN** un suplemento de un sistema grande solo está en inglés
- **THEN** no entra en la sección

#### Scenario: Básico solo en inglés

- **WHEN** el libro básico de un sistema grande solo está en inglés
- **THEN** entra en la sección marcado como principal

#### Scenario: Libro de Kobold Press solo en inglés

- **WHEN** un libro impreso de Kobold Press para 5E solo está en inglés
- **THEN** entra en la sección, aunque no sea un libro básico

### Requirement: Datos del libro

Cada libro SHALL guardar su sistema, su título original, su tipo de una lista
cerrada (básico, caja de inicio, suplemento, aventura, ambientación u otro),
si es principal y una fuente oficial de la editorial o, solo si no existe,
de una tienda. SHALL poder guardar el título en castellano.

#### Scenario: Sistema inexistente

- **WHEN** un libro indica un sistema que no tiene ficha
- **THEN** los tests del proyecto fallan

#### Scenario: Libro solo en inglés no principal

- **WHEN** un libro no tiene edición en castellano, no está marcado como
  principal y no es de una editorial destacada
- **THEN** los tests del proyecto fallan

### Requirement: Ediciones por idioma

Un libro SHALL poder tener varias ediciones, cada una con su idioma (inglés o
castellano), su editorial, su fecha, su ISBN si lo tiene, su portada y sus
enlaces de compra. Solo SHALL constar una edición en castellano cuando una
fuente la confirme.

#### Scenario: Traducción de otra editorial

- **WHEN** un libro de Paizo lo publica en castellano otra editorial
- **THEN** cada edición muestra su propia editorial y su fecha

### Requirement: Descripción propia

Cada libro SHALL tener una descripción propia en castellano de qué trae y
para quién es, sin copiar textos de tiendas ni de la editorial.

#### Scenario: Libro sin descripción

- **WHEN** un libro no tiene descripción
- **THEN** los tests del proyecto fallan

### Requirement: Licencia propia del libro

Un libro SHALL heredar las licencias de su sistema y SHALL poder indicar otra
cuando no la use, por ejemplo un libro de terceros que solo se declara
compatible. La licencia indicada SHALL tener ficha.

#### Scenario: Libro solo compatible

- **WHEN** un libro de terceros para 5E no usa ninguna licencia abierta
- **THEN** su ficha lo indica en lugar de mostrar la licencia del sistema

### Requirement: URLs de compra limpias

Los enlaces de compra SHALL guardarse sin parámetros de afiliado y solo a
tiendas que el sitio ya conoce; el afiliado se añade al construir el enlace.

#### Scenario: Enlace con afiliado en los datos

- **WHEN** un enlace de compra lleva un parámetro de afiliado
- **THEN** los tests del proyecto fallan

### Requirement: Ficha del libro

El sitio SHALL tener una ficha por libro en `/rol/:sistema/:libro`, con su
portada, su descripción, su sistema y su licencia enlazados, sus ediciones
por idioma y sus botones de compra con el aviso de afiliado junto a ellos.

#### Scenario: Libro con edición en castellano a la venta

- **WHEN** un visitante abre la ficha de un libro con edición en castellano
  a la venta
- **THEN** ve primero la edición en castellano, con sus botones de compra y
  el aviso de afiliado

#### Scenario: Libro de otro sistema en la URL

- **WHEN** un visitante abre `/rol/:sistema/:libro` con un libro que no es
  de ese sistema
- **THEN** ve la página de no encontrado

### Requirement: Inventario maestro

El proyecto SHALL tener un inventario de las licencias, los sistemas y los
libros de la sección, con su fuente, y cada ficha SHALL figurar en él y al
revés.

#### Scenario: Ficha fuera del inventario

- **WHEN** existe la ficha de un libro que no está en el inventario
- **THEN** los tests del proyecto fallan

### Requirement: Prerenderizado y metadatos de los libros

Cada ficha de libro SHALL prerenderizarse, entrar en el sitemap y tener
título, descripción e imagen para compartir propios.

#### Scenario: Ficha en el sitemap

- **WHEN** se genera el build
- **THEN** el sitemap incluye `/rol/:sistema/:libro` de cada libro
