# Spec Delta

## Purpose

Define la ficha pública de cada videojuego oficial de D&D: qué información
muestra, en qué dirección vive y cómo se presenta a buscadores y redes
sociales.

## ADDED Requirements

### Requirement: Dirección de la ficha

Cada juego SHALL tener una ficha en `/videojuego/<slug>`, con un slug
único derivado del título.

#### Scenario: Acceso a una ficha

- **WHEN** un visitante abre `/videojuego/baldurs-gate-3`
- **THEN** ve la ficha de _Baldur's Gate 3_

#### Scenario: Slug inexistente

- **WHEN** un visitante abre `/videojuego/<slug>` con un slug que no
  existe
- **THEN** ve la página de no encontrado

### Requirement: Datos principales

La ficha SHALL mostrar la portada, el título original y el título en
castellano si existe, la fecha del primer lanzamiento, la desarrolladora,
la editora, el género, el mundo de campaña y las reglas en que se basa,
cuando se conozcan.

#### Scenario: Juego con título en castellano

- **WHEN** un juego tiene título en castellano
- **THEN** la ficha muestra los dos títulos

#### Scenario: Campo desconocido

- **WHEN** un campo no tiene dato
- **THEN** la ficha lo omite, sin mostrar etiquetas vacías

### Requirement: Tabla de ediciones

La ficha SHALL tener una sección «Ediciones» que liste todas las
versiones del juego con el icono y el nombre de la plataforma, la fecha,
la versión (original, edición mejorada, relanzamiento o recopilación) y
el idioma (textos, subtítulos y voces).

#### Scenario: Juego en varias plataformas

- **WHEN** un juego salió en PC y en consola en fechas distintas
- **THEN** la tabla muestra una fila por plataforma con su fecha

#### Scenario: Lanzamiento solo en inglés

- **WHEN** un lanzamiento no tiene castellano oficial
- **THEN** la fila indica «Solo en inglés»

#### Scenario: Versión dentro de una recopilación

- **WHEN** una versión se vende dentro de una recopilación
- **THEN** la columna de versión indica el nombre de la recopilación

### Requirement: Resumen de castellano

La ficha SHALL mostrar un resumen visible del mejor castellano
disponible: en castellano (con voces), textos en castellano o solo en
inglés. El castellano que no está confirmado se muestra como solo en
inglés.

#### Scenario: Castellano solo en una edición

- **WHEN** solo la edición mejorada está traducida
- **THEN** el resumen indica que hay castellano y la tabla de
  lanzamientos dice en cuál

### Requirement: Notas en la ficha

La ficha SHALL mostrar cada nota con su fuente, su escala original y un
enlace a la reseña o al agregador.

#### Scenario: Nota con enlace

- **WHEN** un juego tiene un 96 de Metacritic en PC
- **THEN** la ficha muestra «96/100 · Metacritic (PC)» enlazado a la
  página de Metacritic

### Requirement: Otros contenidos de la ficha

La ficha SHALL mostrar la descripción, las expansiones, los libros
relacionados con enlace a sus fichas, y el aviso de juego cerrado o
retirado de la venta cuando corresponda.

#### Scenario: Juego cerrado

- **WHEN** un juego online tiene los servidores cerrados
- **THEN** la ficha lo indica de forma destacada

#### Scenario: Libro relacionado

- **WHEN** un juego está relacionado con un libro del catálogo
- **THEN** la ficha enlaza a la ficha de ese libro

### Requirement: Prerenderizado y metadatos

Cada ficha SHALL generarse como HTML prerenderizado, figurar en el
sitemap y tener título, descripción, URL canónica, `og:image` y vista
previa de 1200×630 a partir de la portada.

#### Scenario: Compartir una ficha

- **WHEN** alguien comparte la URL de una ficha en una red social
- **THEN** se muestra la tarjeta con el título del juego y su portada

#### Scenario: Buscador sin JavaScript

- **WHEN** un buscador descarga la ficha sin ejecutar JavaScript
- **THEN** recibe el contenido completo de la ficha
