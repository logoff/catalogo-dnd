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
esté configurado.

#### Scenario: Novela con tres ediciones en castellano

- **WHEN** una novela tiene tres ediciones en castellano
- **THEN** la ficha muestra las tres con su editorial y su año

#### Scenario: Edición Kindle

- **WHEN** una edición ebook se vende en Amazon como Kindle
- **THEN** su botón de compra indica que es la versión Kindle

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

La ficha SHALL enlazar a los libros, videojuegos y artículos de
merchandising del catálogo con los que esté relacionada la novela, si los
hay.

#### Scenario: Novela ligada a un videojuego

- **WHEN** una novela está relacionada con _Baldur's Gate 3_
- **THEN** la ficha enlaza a `/videojuego/baldurs-gate-3`

### Requirement: Prerenderizado y metadatos

La ficha SHALL prerenderizarse, entrar en el sitemap y llevar título,
descripción e imagen propios en sus metaetiquetas.

#### Scenario: Vista previa en redes

- **WHEN** se comparte la ficha de una novela
- **THEN** la vista previa muestra su título y su portada
