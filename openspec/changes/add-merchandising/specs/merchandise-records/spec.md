# Spec Delta

## Purpose

Define qué productos licenciados de D&D que no son de reglas entran en la
sección de merchandising y qué datos verificables se guardan de cada uno.

## ADDED Requirements

### Requirement: Alcance de productos licenciados

La sección SHALL incluir productos con licencia oficial de Dungeons &
Dragons publicados desde 2014 que pertenezcan a uno de tres grupos:
libros licenciados que no son de reglas, figuras y juguetes, y juegos de
mesa y cartas que no son de rol.

#### Scenario: Libro de cocina oficial

- **WHEN** un libro de cocina lleva la licencia oficial de D&D
- **THEN** entra en la sección, en el grupo de libros licenciados

#### Scenario: Juego de cartas oficial

- **WHEN** un juego de cartas con licencia de D&D no es un juego de rol
- **THEN** entra en la sección, en el grupo de juegos de mesa y cartas

### Requirement: Exclusiones del alcance

La sección SHALL dejar fuera los libros de reglas, las novelas y los
cómics, los dados, la ropa y los complementos, los productos sin
licencia oficial o hechos por fans y los publicados antes de 2014.

#### Scenario: Novela de Reinos Olvidados

- **WHEN** se propone una novela de Drizzt
- **THEN** no entra en la sección de merchandising

#### Scenario: Producto sin licencia

- **WHEN** un producto usa la temática de D&D sin licencia oficial
- **THEN** no entra en la sección

### Requirement: Grupo y tipo de cada artículo

Cada artículo SHALL indicar su grupo y un tipo de una lista cerrada:
libro de cocina, de manualidades, de arte o guía ilustrada; Funko, LEGO,
figura, peluche o miniatura de coleccionista; juego de mesa o juego de
cartas.

#### Scenario: Tipo que no está en la lista

- **WHEN** un artículo indica un tipo que no está en la lista
- **THEN** los tests del proyecto fallan

#### Scenario: Tipo que no corresponde al grupo

- **WHEN** un artículo del grupo de libros indica el tipo Funko
- **THEN** los tests del proyecto fallan

### Requirement: Datos del artículo

Cada artículo SHALL guardar su título original, el fabricante o la
editorial que tiene la licencia, la fecha de salida si se conoce y una
fuente oficial que confirme la licencia, y MAY guardar el título en
castellano.

#### Scenario: Artículo sin fuente de la licencia

- **WHEN** un artículo no indica una fuente oficial
- **THEN** los tests del proyecto fallan

### Requirement: Ediciones por idioma

Un artículo SHALL poder tener varias ediciones, cada una con su idioma
(inglés o castellano), su título, su editorial si cambia, su fecha y sus
enlaces de compra. Solo SHALL constar una edición en castellano cuando
una fuente la confirme, y cada edición en castellano SHALL indicar si se
publicó en España o solo fuera de España.

#### Scenario: Libro traducido

- **WHEN** un libro licenciado tiene edición en inglés y en castellano
- **THEN** el artículo tiene dos ediciones, una por idioma, con su
  título y sus enlaces de compra

#### Scenario: Edición en español solo para América

- **WHEN** un libro tiene edición en español publicada en Estados Unidos
  y no en España
- **THEN** la edición consta en castellano con la indicación de que no
  se publicó en España

#### Scenario: Juguete sin idioma

- **WHEN** un artículo no tiene texto, como una figura
- **THEN** tiene una sola edición sin idioma

### Requirement: Descripción propia

Cada artículo SHALL tener una descripción propia en castellano de dos
párrafos: qué es y qué trae, y para quién es, sin copiar textos de
tiendas ni del fabricante.

#### Scenario: Artículo sin descripción

- **WHEN** un artículo no tiene descripción de dos párrafos
- **THEN** los tests del proyecto fallan

### Requirement: Imágenes locales

Cada artículo SHALL tener al menos una imagen servida desde el propio
sitio.

#### Scenario: Imagen inexistente

- **WHEN** un artículo referencia una imagen que no existe en el sitio
- **THEN** los tests del proyecto fallan

### Requirement: URLs de compra limpias

Los enlaces de compra SHALL guardarse sin parámetros de afiliado y solo
a tiendas que el sitio ya conoce; el afiliado se añade al construir el
enlace.

#### Scenario: Enlace con afiliado en los datos

- **WHEN** un enlace de compra guardado lleva un parámetro de afiliado
- **THEN** los tests del proyecto fallan

### Requirement: Relación con el resto del catálogo

Un artículo SHALL poder enlazar a libros y a videojuegos del catálogo, y
cada enlace SHALL apuntar a una ficha que exista.

#### Scenario: Figura de un videojuego

- **WHEN** una figura es de un personaje de _Baldur's Gate 3_
- **THEN** el artículo puede enlazar a la ficha del videojuego

#### Scenario: Enlace a una ficha inexistente

- **WHEN** un artículo enlaza a un libro o videojuego que no existe
- **THEN** los tests del proyecto fallan

### Requirement: Inventario maestro

El proyecto SHALL tener un inventario de los artículos que entran en la
sección, con su fuente, y cada ficha SHALL figurar en él y al revés.

#### Scenario: Ficha fuera del inventario

- **WHEN** existe la ficha de un artículo que no está en el inventario
- **THEN** los tests del proyecto fallan
