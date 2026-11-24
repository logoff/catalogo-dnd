# Spec Delta

## Purpose

Define la ficha pública de cada serie de cómics: sus datos, sus números, sus
ediciones recopiladas en inglés y en castellano, la compra y el contenido
relacionado.

## ADDED Requirements

### Requirement: Dirección de la ficha

Cada serie SHALL tener su ficha en `/comic/<slug>`, con el slug sacado del
título original.

#### Scenario: Ficha inexistente

- **WHEN** un visitante abre `/comic/no-existe`
- **THEN** ve la página de no encontrado

### Requirement: Datos principales

La ficha SHALL mostrar la portada, el título original y el de castellano si
existe, la editorial, el mundo de campaña, los años, el número de entregas,
los guionistas y dibujantes, la descripción y un enlace a la fuente,
omitiendo los datos que no se conozcan.

#### Scenario: Ver la portada en grande

- **WHEN** el visitante pulsa una portada
- **THEN** se abre ampliada en el visor de imágenes

#### Scenario: Serie que continúa otra

- **WHEN** la serie continúa otra que tiene ficha
- **THEN** la ficha enlaza a la anterior y, en la anterior, a la siguiente

### Requirement: Dónde leerla

La ficha SHALL mostrar primero las ediciones recopiladas, agrupadas por idioma
(primero castellano), cada una con su portada, título, editorial, año,
formato, ISBN, los números que recoge y los botones de compra con el afiliado
de cada tienda cuando esté configurado. La primera de cada idioma SHALL ser la
más reciente a la venta.

#### Scenario: Tomo en castellano a la venta

- **WHEN** una serie tiene un tomo de Norma a la venta en Amazon y en Casa
  del Libro
- **THEN** la ficha lo muestra el primero, con los dos botones de compra

#### Scenario: Tomo que recoge varias series

- **WHEN** un integral recoge esta serie y otra
- **THEN** la ficha lo indica y enlaza a la otra serie

#### Scenario: Edición digital

- **WHEN** un tomo se vende en Amazon como Kindle
- **THEN** su botón de compra indica que es la versión Kindle

### Requirement: Aviso sin traducción o sin venta

Si la serie no tiene edición en castellano, la ficha SHALL decirlo; si
ninguna edición sigue a la venta, SHALL decirlo y no mostrar botones de
compra.

#### Scenario: Serie solo en inglés

- **WHEN** una serie no se tradujo
- **THEN** la ficha indica que no hay edición en castellano

#### Scenario: Serie descatalogada

- **WHEN** ninguna edición de una serie de los años noventa se vende
- **THEN** la ficha indica que está descatalogada y no muestra botones de
  compra

### Requirement: Números

La ficha SHALL listar los números de la serie en una cuadrícula de portadas,
cada uno con su número, su fecha y su título si lo tiene, y el tomo en el que
se recoge. Las ediciones en grapa en castellano SHALL mostrarse aparte, con su
editorial y sus números.

#### Scenario: Número recopilado

- **WHEN** el número 3 está en un tomo con ficha en la misma página
- **THEN** el número indica en qué tomo se recoge

#### Scenario: Ver un número en grande

- **WHEN** el visitante pulsa la portada de un número
- **THEN** se abre ampliada en el visor de imágenes, que permite pasar a los
  demás números

### Requirement: Contenido relacionado

La ficha SHALL enlazar a las novelas, libros de reglas, videojuegos,
artículos de merchandising y cómics relacionados.

#### Scenario: Cómic que adapta una novela

- **WHEN** el cómic adapta una novela con ficha
- **THEN** la ficha muestra la novela en su contenido relacionado y la
  ficha de la novela muestra el cómic

### Requirement: Prerenderizado y metadatos

Cada ficha SHALL prerenderizarse con su título, descripción, portada como
imagen de vista previa y datos estructurados de serie de cómics, e incluirse
en el sitemap.

#### Scenario: Compartir la ficha

- **WHEN** se comparte el enlace de una ficha en una red social
- **THEN** la vista previa muestra el título y la portada de la serie
