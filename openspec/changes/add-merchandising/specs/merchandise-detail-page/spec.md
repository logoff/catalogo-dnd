# Spec Delta

## Purpose

Define la ficha pública de cada artículo de merchandising: su dirección,
la información que muestra y cómo se presenta a buscadores y redes.

## ADDED Requirements

### Requirement: Dirección de la ficha

Cada artículo SHALL tener una ficha en `/merchandising/<slug>`, con un
slug único.

#### Scenario: Slug inexistente

- **WHEN** un visitante abre `/merchandising/<slug>` con un slug que no
  existe
- **THEN** ve la página de no encontrado

### Requirement: Datos principales

La ficha SHALL mostrar las imágenes, el título original y el título en
castellano si existe, el grupo y el tipo, el fabricante, la fecha de
salida, la descripción y un enlace a la fuente oficial, omitiendo los
datos que no se conozcan.

#### Scenario: Ver las imágenes en grande

- **WHEN** el visitante pulsa una imagen
- **THEN** se abre ampliada en el visor de imágenes

#### Scenario: Dato desconocido

- **WHEN** un artículo no tiene fecha de salida
- **THEN** la ficha no muestra la etiqueta de fecha vacía

### Requirement: Ediciones y compra

La ficha SHALL mostrar cada edición con su idioma, su título y sus
botones de compra, con el afiliado de cada tienda cuando esté
configurado, y avisar cuando un artículo no tenga ningún enlace de
compra.

#### Scenario: Libro en dos idiomas

- **WHEN** un libro tiene edición en inglés y en castellano
- **THEN** la ficha muestra las dos con sus títulos y sus botones de
  compra

#### Scenario: Artículo sin enlaces

- **WHEN** un artículo no tiene ningún enlace de compra
- **THEN** la ficha indica que no está a la venta en las tiendas del
  sitio

### Requirement: Contenido relacionado

La ficha SHALL enlazar a los libros y videojuegos del catálogo con los
que esté relacionado el artículo, si los hay.

#### Scenario: Figura de un videojuego

- **WHEN** un artículo está relacionado con _Baldur's Gate 3_
- **THEN** la ficha enlaza a `/videojuego/baldurs-gate-3`

### Requirement: Prerenderizado y metadatos

La ficha SHALL prerenderizarse, entrar en el sitemap y llevar título,
descripción e imagen propios en sus metaetiquetas.

#### Scenario: Vista previa en redes

- **WHEN** se comparte la ficha de un artículo
- **THEN** la vista previa muestra su título y su imagen
