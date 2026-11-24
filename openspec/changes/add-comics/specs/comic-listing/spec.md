# Spec Delta

## Purpose

Define el listado público de la sección de cómics: qué muestra, cómo se
filtra, busca y ordena, cómo se llega a él y cómo cuentan los cómics en las
novedades y en el resumen mensual.

## ADDED Requirements

### Requirement: Página de listado

El sitio SHALL tener una página en `/comics` con todas las fichas de cómics,
prerenderizada e incluida en el sitemap, que no añada peso al JavaScript de
las páginas que no son de cómics.

#### Scenario: Orden por defecto

- **WHEN** un visitante abre `/comics` sin elegir orden
- **THEN** ve las series de la más reciente a la más antigua

#### Scenario: Otras páginas sin datos de cómics

- **WHEN** un visitante abre la portada
- **THEN** su JavaScript no incluye los datos de las fichas de cómics

### Requirement: Contenido de cada tarjeta

Cada ficha del listado SHALL mostrar su portada, el título original y, debajo,
el de castellano con la marca de castellano si existe, la editorial, los años
de publicación, el número de entregas y una marca si alguna edición sigue a la
venta, y enlazar a su ficha.

#### Scenario: Serie traducida

- **WHEN** una serie tiene un tomo en castellano publicado en España
- **THEN** su tarjeta muestra el título en castellano con la marca de
  castellano

#### Scenario: Obra única

- **WHEN** la ficha es una novela gráfica de un solo número
- **THEN** la tarjeta muestra el año sin recuento de números

### Requirement: Filtros

El listado SHALL permitir filtrar por editorial, por mundo de campaña, por
época (años ochenta y noventa, 2000-2009, 2010-2019, desde 2020), por series
con edición en castellano publicada en España y por series con alguna edición
a la venta, y combinar los filtros. Los filtros SHALL reflejarse en la
dirección para poder compartirla.

#### Scenario: Filtrar por editorial

- **WHEN** el visitante elige «IDW»
- **THEN** solo ve las series publicadas por IDW

#### Scenario: Enlace con filtros

- **WHEN** el visitante abre `/comics?mundo=dragonlance`
- **THEN** ve el listado filtrado por Dragonlance

#### Scenario: Sin resultados

- **WHEN** ninguna serie cumple los filtros
- **THEN** la página lo dice y ofrece quitar los filtros

### Requirement: Búsqueda

El listado SHALL permitir buscar por título original o en castellano, de la
serie o de sus tomos, y por guionista o dibujante, sin distinguir mayúsculas
ni tildes.

#### Scenario: Búsqueda por título de un tomo

- **WHEN** el visitante busca «Fell's Five»
- **THEN** encuentra la serie de IDW de 2010 que recoge ese tomo

#### Scenario: Búsqueda por autor

- **WHEN** el visitante busca «Jim Zub»
- **THEN** encuentra las series que escribió

### Requirement: Orden

El listado SHALL permitir ordenar por fecha (más recientes o más antiguos
primero) y por título.

#### Scenario: Ordenar por título

- **WHEN** el visitante ordena por título
- **THEN** las series aparecen en orden alfabético por su título original

### Requirement: Navegación del sitio

La cabecera SHALL enlazar a la sección de cómics desde el menú «Más de D&D».

#### Scenario: Enlace en la cabecera

- **WHEN** un visitante abre el menú «Más de D&D» en escritorio o en móvil
- **THEN** ve el enlace «Cómics» a `/comics`

### Requirement: Novedades y resumen mensual

Las ediciones de cómics con fecha (tomos y números, en inglés y en castellano)
SHALL contar en la página de novedades, en el feed y en el resumen mensual
como las de las demás secciones, con la sección «Cómics» y un enlace a su
ficha.

#### Scenario: Tomo en castellano recién salido

- **WHEN** Norma publica un tomo de un cómic de D&D con fecha de este mes
- **THEN** aparece en `/novedades` como novedad en castellano de la sección
  «Cómics»

#### Scenario: Serie nueva en el resumen

- **WHEN** se da de alta una ficha de cómic durante el mes
- **THEN** el resumen de ese mes la cuenta entre las fichas nuevas de la
  sección «Cómics»

### Requirement: Secciones existentes intactas

Las demás secciones y el buscador de la cabecera SHALL seguir funcionando
igual; los cómics no aparecen en ellos.

#### Scenario: Buscador de la cabecera

- **WHEN** un visitante busca el título de un cómic en la cabecera
- **THEN** el buscador sigue mostrando solo libros de reglas
