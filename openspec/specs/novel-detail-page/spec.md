# novel-detail-page Specification

## Purpose

Define la ficha pública de cada novela: su dirección, la información y
las ediciones que muestra, su serie y cómo se presenta a buscadores y
redes.

## Requirements

### Requirement: Dirección de la ficha

Cada novela SHALL tener una ficha en `/novela/<slug>`, con un slug único.

#### Scenario: Slug inexistente

- **WHEN** un visitante abre `/novela/<slug>` con un slug que no existe
- **THEN** ve la página de no encontrado

### Requirement: Datos principales

La ficha SHALL mostrar la portada, el título original y el título en
castellano si existe, los autores, el mundo de campaña, la serie y su
número, la fecha de la primera edición, la descripción y un enlace a la
fuente, omitiendo los datos que no se conozcan.

#### Scenario: Ver la portada en grande

- **WHEN** el visitante pulsa una portada
- **THEN** se abre ampliada en el visor de imágenes

#### Scenario: Dato desconocido

- **WHEN** una novela no tiene título en castellano
- **THEN** la ficha no muestra la etiqueta vacía

### Requirement: Ediciones y compra

La ficha SHALL mostrar las ediciones agrupadas por idioma, primero las de
castellano, cada una con título, editorial, año, formato, ISBN, portada
si la tiene y botones de compra con el afiliado de cada tienda cuando
esté configurado. Los audiolibros SHALL mostrarse en su idioma, con su
narrador y su duración si se conoce.

#### Scenario: Novela con tres ediciones en castellano

- **WHEN** una novela tiene tres ediciones en castellano
- **THEN** la ficha muestra las tres con su editorial y su año

#### Scenario: Edición Kindle

- **WHEN** una edición ebook se vende en Amazon como Kindle
- **THEN** su botón de compra indica que es la versión Kindle

#### Scenario: Audiolibro

- **WHEN** una novela tiene un audiolibro en inglés
- **THEN** la ficha lo muestra entre las ediciones en inglés con el
  formato «Audiolibro», el narrador y un botón de compra que indica que
  es el audiolibro

#### Scenario: Novela con muchas ediciones en inglés

- **WHEN** una novela tiene siete ediciones en inglés
- **THEN** la ficha muestra las siete, de la más reciente a la más
  antigua, cada una con su portada, editorial, año, formato e ISBN

#### Scenario: Edición en español no publicada en España

- **WHEN** una edición en castellano se publicó fuera de España
- **THEN** la ficha lo indica en esa edición

### Requirement: Recopilatorios que la incluyen

La ficha SHALL mostrar los recopilatorios que contienen la novela, con su
idioma, título, editorial, año y botones de compra, y SHALL omitir la
sección si no hay ninguno.

#### Scenario: Novela incluida en un recopilatorio en castellano

- **WHEN** una novela está en un recopilatorio en castellano a la venta
- **THEN** la ficha muestra ese recopilatorio con su botón de compra

### Requirement: Aviso sin traducción o sin venta

La ficha SHALL indicar cuando una novela no tiene edición en castellano
y cuando ninguna edición tiene enlace de compra.

#### Scenario: Novela sin traducción

- **WHEN** una novela no tiene ninguna edición en castellano
- **THEN** la ficha indica que no se ha publicado en castellano

#### Scenario: Novela descatalogada

- **WHEN** ninguna edición tiene enlace de compra
- **THEN** la ficha indica que no está a la venta en las tiendas del
  sitio

### Requirement: Serie

Si la novela pertenece a una serie, la ficha SHALL mostrar la lista
ordenada de las novelas de esa serie, con la actual destacada, enlaces a
las demás y la anterior y la siguiente a mano.

#### Scenario: Segunda novela de una trilogía

- **WHEN** el visitante abre la segunda novela de una trilogía
- **THEN** ve las tres en orden, la segunda destacada, y enlaces a la
  primera y a la tercera como anterior y siguiente

#### Scenario: Novela sin serie

- **WHEN** la novela no pertenece a ninguna serie
- **THEN** la ficha no muestra la sección de serie

### Requirement: Contenido relacionado

La ficha SHALL enlazar a los libros, videojuegos, artículos de merchandising y
obras de cine y series del catálogo con los que esté relacionada la novela, si
los hay.

#### Scenario: Novela ligada a un videojuego

- **WHEN** una novela está relacionada con _Baldur's Gate 3_
- **THEN** la ficha enlaza a `/videojuego/baldurs-gate-3`

#### Scenario: Novelización de una película

- **WHEN** una novela es la novelización de una película del catálogo
- **THEN** la ficha enlaza a `/cine-y-series/<slug>` de esa película

### Requirement: Prerenderizado y metadatos

La ficha SHALL prerenderizarse, entrar en el sitemap y llevar título,
descripción e imagen propios en sus metaetiquetas.

#### Scenario: Vista previa en redes

- **WHEN** se comparte la ficha de una novela
- **THEN** la vista previa muestra su título y su portada

### Requirement: Antologías relacionadas

La ficha SHALL mostrar las antologías relacionadas con la novela, sea
por su serie o por la propia novela, con su título (el castellano si se
tradujo), portada, idiomas, año y botones de compra de cada edición a la
venta, y SHALL omitir la sección si no hay ninguna. La sección SHALL
aparecer después de los recopilatorios.

#### Scenario: Novela de una serie con antología

- **WHEN** el usuario abre la ficha de una novela de _The Last Mythal_
- **THEN** la ficha muestra _Realms of the Elves_ en la sección
  «Antologías», con sus botones de compra

#### Scenario: Antología traducida

- **WHEN** una antología relacionada tiene edición en castellano
- **THEN** la ficha muestra su título en castellano e indica que hay
  edición en castellano

#### Scenario: Novela sin antologías

- **WHEN** ninguna antología se relaciona con la novela ni con su serie
- **THEN** la ficha no muestra la sección «Antologías»

#### Scenario: Primer render en servidor y navegador

- **WHEN** la ficha se prerenderiza y luego se hidrata en el navegador
- **THEN** la sección «Antologías» es idéntica en ambos
