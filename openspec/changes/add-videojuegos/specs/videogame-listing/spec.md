# Spec Delta

## Purpose

Define el listado público de videojuegos oficiales de D&D, con filtros,
orden y búsqueda, y cómo se llega a él desde el resto del sitio.

## ADDED Requirements

### Requirement: Página de listado

El sitio SHALL tener en `/videojuegos` un listado con todos los juegos
del catálogo, en vista de tarjetas o de lista, prerenderizado e incluido
en el sitemap.

#### Scenario: Abrir el listado

- **WHEN** un visitante abre `/videojuegos`
- **THEN** ve todos los juegos ordenados por fecha del primer
  lanzamiento, del más antiguo al más reciente

### Requirement: Contenido de cada tarjeta

Cada juego del listado SHALL mostrar la portada, el título, el año del
primer lanzamiento, sus plataformas, el resumen de castellano y su mejor
nota, y enlazar a su ficha.

#### Scenario: Juego sin notas

- **WHEN** un juego no tiene notas
- **THEN** la tarjeta se muestra sin el bloque de nota

### Requirement: Filtros

El listado SHALL permitir filtrar por plataforma, década, castellano
(con castellano, textos en castellano o solo en inglés), mundo de
campaña, género y disponibilidad a la venta, y combinar los filtros.

#### Scenario: Juegos en castellano a la venta

- **WHEN** el visitante filtra por «con castellano» y «a la venta»
- **THEN** solo ve juegos que cumplen las dos condiciones

#### Scenario: Sin resultados

- **WHEN** ningún juego cumple los filtros
- **THEN** el listado muestra un mensaje y la opción de quitar los
  filtros

### Requirement: Orden

El listado SHALL poder ordenarse por fecha, por título y por nota.

#### Scenario: Orden por nota

- **WHEN** el visitante ordena por nota
- **THEN** los juegos con mejor nota normalizada aparecen primero y los
  que no tienen nota, al final

### Requirement: Búsqueda

El listado SHALL buscar por título original y por título en castellano,
sin distinguir mayúsculas ni tildes.

#### Scenario: Búsqueda por título en castellano

- **WHEN** el visitante busca «puertas de baldur»
- **THEN** aparece _Baldur's Gate_ si ese es su título en castellano

### Requirement: Navegación del sitio

La cabecera y la portada SHALL enlazar a `/videojuegos`, y los textos
generales del sitio MUST dejar de presentarlo como un catálogo solo de
libros y accesorios.

#### Scenario: Entrar desde la portada

- **WHEN** un visitante está en la portada
- **THEN** encuentra un acceso a la sección de videojuegos

### Requirement: Catálogo de libros intacto

Añadir videojuegos MUST NOT cambiar el contenido ni el comportamiento de
las páginas de libros.

#### Scenario: Catálogo de libros

- **WHEN** un visitante abre `/catalogo`
- **THEN** ve solo libros, cajas y accesorios, como hasta ahora
