# merchandise-listing Specification

## Purpose

Define el listado público de la sección de merchandising: qué muestra,
cómo se filtra, busca y ordena, y cómo se llega a él desde el resto del
sitio.

## Requirements

### Requirement: Página de listado

El sitio SHALL tener una página en `/merchandising` con todos los
artículos de la sección, prerenderizada e incluida en el sitemap.

#### Scenario: Orden por defecto

- **WHEN** un visitante abre `/merchandising` sin elegir orden
- **THEN** ve los artículos del más reciente al más antiguo

### Requirement: Contenido de cada tarjeta

Cada artículo del listado SHALL mostrar su imagen principal, su título,
su tipo, el año de salida si se conoce y una marca si tiene edición en
castellano, distinta según se haya publicado en España o solo fuera, y
enlazar a su ficha.

#### Scenario: Artículo sin fecha

- **WHEN** un artículo no tiene fecha de salida
- **THEN** la tarjeta se muestra sin el año

#### Scenario: Libro con edición en castellano

- **WHEN** un libro tiene edición en castellano publicada en España
- **THEN** su tarjeta lo indica

#### Scenario: Edición en español fuera de España

- **WHEN** la única edición en español de un libro se publicó fuera de
  España
- **THEN** su tarjeta indica que hay edición en español pero no en España

### Requirement: Filtros

El listado SHALL permitir filtrar por grupo, por tipo, por artículos con
edición en castellano publicada en España y por artículos a la venta, y
combinar los filtros.

#### Scenario: Filtrar por grupo

- **WHEN** el visitante elige el grupo «Figuras y juguetes»
- **THEN** solo ve figuras, LEGO, Funko, peluches y miniaturas

#### Scenario: Sin resultados

- **WHEN** ningún artículo cumple los filtros
- **THEN** la página lo dice y ofrece quitar los filtros

### Requirement: Búsqueda

El listado SHALL permitir buscar por título original o en castellano y
por fabricante, sin distinguir mayúsculas ni tildes.

#### Scenario: Búsqueda sin tilde

- **WHEN** el visitante busca «festin»
- **THEN** encuentra los artículos con «Festín» en el título

### Requirement: Orden

El listado SHALL permitir ordenar por fecha (más recientes o más
antiguos primero) y por título.

#### Scenario: Ordenar por título

- **WHEN** el visitante ordena por título
- **THEN** los artículos aparecen en orden alfabético

### Requirement: Navegación del sitio

La cabecera y la portada SHALL enlazar a la sección de merchandising.

#### Scenario: Enlace en la cabecera

- **WHEN** un visitante abre cualquier página en escritorio o en móvil
- **THEN** la cabecera tiene un enlace «Merchandising» a `/merchandising`

### Requirement: Secciones existentes intactas

El catálogo de libros, el de videojuegos y el buscador de la cabecera
SHALL seguir funcionando igual; los artículos de merchandising no
aparecen en ellos.

#### Scenario: Buscador de la cabecera

- **WHEN** un visitante busca el título de un artículo de merchandising
  en la cabecera
- **THEN** el buscador sigue mostrando solo libros
