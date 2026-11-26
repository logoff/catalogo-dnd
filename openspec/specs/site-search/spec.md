# site-search Specification

## Purpose

Define el buscador global del catálogo: una sola caja que encuentra fichas de
cualquier sección y una página de resultados agrupados por sección.

## Requirements

### Requirement: Página de resultados

El sitio SHALL tener una página `/buscar` que lea el texto buscado del
parámetro `q` y muestre las fichas de todas las secciones que coincidan,
cada una enlazada a su ficha. La página SHALL tener su propio campo de
búsqueda con el texto actual, y al cambiarlo SHALL actualizar `q` en la URL.

#### Scenario: Buscar un artículo de merchandising

- **WHEN** se abre `/buscar?q=fiends`
- **THEN** aparece _Dungeons & Dragons Fiends & Foes_ en el grupo de
  merchandising, enlazado a `/merchandising/fiends-and-foes`

#### Scenario: Cambiar la búsqueda en la propia página

- **WHEN** en `/buscar?q=drizzt` se escribe «ravenloft» en el campo
- **THEN** la URL pasa a `/buscar?q=ravenloft` y los resultados cambian

#### Scenario: Sin texto

- **WHEN** se abre `/buscar` sin `q` o con `q` vacío
- **THEN** se muestra el campo de búsqueda vacío y ningún resultado

### Requirement: Secciones en las que se busca

La búsqueda SHALL cubrir los libros de 5E y 2024, las ediciones anteriores
de D&D, los videojuegos, el merchandising, las novelas, los cómics, los
libros y sistemas de otros juegos de rol y las licencias abiertas.

#### Scenario: Una novela

- **WHEN** se busca «homeland»
- **THEN** aparece la novela _Homeland_ en el grupo de novelas

#### Scenario: Un libro de una edición anterior

- **WHEN** se busca un libro de AD&D 2.ª edición por su título
- **THEN** aparece en el grupo de ediciones anteriores, enlazado a su ficha
  en `/ediciones/...`, y no en el de otros juegos de rol

#### Scenario: Un sistema de otro juego de rol

- **WHEN** se busca «pathfinder»
- **THEN** el grupo de otros juegos de rol incluye el sistema Pathfinder y
  sus libros

### Requirement: Campos de búsqueda

Cada ficha SHALL coincidir si el texto buscado aparece en su título
original, en su título en castellano, en sus autores, en su editorial o
fabricante o en el ISBN-13 de alguna de sus ediciones. La comparación SHALL
ignorar tildes y mayúsculas. No SHALL buscarse en las descripciones.

#### Scenario: Título en castellano sin tildes

- **WHEN** se busca «guia del dungeon master»
- **THEN** aparece la _Guía del Dungeon Master_

#### Scenario: Por autor

- **WHEN** se busca «salvatore»
- **THEN** aparecen novelas de R. A. Salvatore

#### Scenario: Por ISBN

- **WHEN** se busca el ISBN-13 de una edición de cualquier sección
- **THEN** aparece la ficha que contiene esa edición

#### Scenario: Una palabra que solo está en la descripción

- **WHEN** se busca una palabra que solo aparece en la descripción de una
  ficha
- **THEN** esa ficha no aparece por esa palabra

### Requirement: Agrupación y orden de los resultados

Los resultados SHALL agruparse por sección en este orden: libros de 5E y
2024, ediciones anteriores, videojuegos, merchandising, novelas, cómics,
otros juegos de rol y licencias. Cada grupo SHALL indicar cuántas fichas
tiene y no SHALL mostrarse si no tiene ninguna. Dentro de un grupo, las
fichas cuyo título empieza por el texto buscado SHALL ir primero.

#### Scenario: Grupos vacíos ocultos

- **WHEN** una búsqueda solo encuentra novelas y cómics
- **THEN** solo se muestran esos dos grupos, cada uno con su recuento

#### Scenario: Coincidencia al principio del título

- **WHEN** se busca «tomb»
- **THEN** en su grupo, una ficha titulada _Tomb of Annihilation_ va antes
  que una que solo contiene «tomb» en mitad del título

### Requirement: Resultados largos

Cada grupo SHALL mostrar como mucho ocho fichas al principio y, si tiene
más, un botón que muestre el resto en la misma página.

#### Scenario: Grupo con muchas fichas

- **WHEN** una búsqueda encuentra 40 novelas
- **THEN** el grupo de novelas muestra ocho, indica «40» y tiene un botón
  para ver las 32 restantes

### Requirement: Búsqueda sin resultados

Si ninguna sección tiene resultados, la página SHALL decirlo con el texto
buscado y enlazar a los listados de cada sección.

#### Scenario: Nada encontrado

- **WHEN** se busca «zzzz»
- **THEN** se indica que no hay resultados para «zzzz» y se enlazan los
  listados de las secciones

### Requirement: Buscador de la cabecera

El buscador de la cabecera, en escritorio y en el menú móvil, SHALL
llamarse «Buscar en el catálogo» y llevar a `/buscar?q=` con el texto
escrito. El acceso de búsqueda de la cabecera en tableta SHALL abrir
`/buscar`.

#### Scenario: Buscar desde cualquier página

- **WHEN** en `/videojuegos` se escribe «fiends» en el buscador de la
  cabecera
- **THEN** se navega a `/buscar?q=fiends`

### Requirement: Búsqueda en el catálogo de libros

El listado `/catalogo` SHALL tener su propio campo de búsqueda en el panel
de filtros y SHALL seguir aceptando el parámetro `q`, que solo filtra los
libros de 5E y 2024.

#### Scenario: Enlace antiguo con q

- **WHEN** se abre `/catalogo?q=xanathar`
- **THEN** el listado muestra solo los libros que coinciden y el campo de
  búsqueda del panel contiene «xanathar»

### Requirement: Página no indexable

La página `/buscar` SHALL llevar `noindex` y no SHALL incluirse en el
sitemap.

#### Scenario: Sitemap

- **WHEN** se genera el sitemap en el build
- **THEN** no contiene ninguna URL de `/buscar`
