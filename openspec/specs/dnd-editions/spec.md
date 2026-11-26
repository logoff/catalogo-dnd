# dnd-editions Specification

## Purpose

Define la sección de ediciones anteriores de D&D: qué ediciones y libros
oficiales entran, qué datos se guardan y qué muestran su listado y sus
fichas, separada del catálogo de 5E y de los otros juegos de rol.

## Requirements

### Requirement: Ediciones de la sección

La sección SHALL tener una ficha por cada edición oficial de D&D anterior a
la 5E que se dé de alta, empezando por D&D 3.ª edición (2000) y D&D 3.5
(2003). Cada edición SHALL guardar los mismos datos que un sistema de rol:
nombre, editorial, fecha, descripción propia, características, licencias
abiertas, derivaciones y enlaces.

#### Scenario: Revisión de la 3.ª edición

- **WHEN** un visitante abre la ficha de D&D 3.ª edición
- **THEN** ve D&D 3.5 entre las ediciones que derivan de ella, como revisión

#### Scenario: Licencia de la 3.ª edición

- **WHEN** un visitante abre la ficha de D&D 3.ª edición
- **THEN** ve el SRD 3.0 entre sus licencias, enlazado a su ficha

#### Scenario: Edición oficial fuera de la familia de D&D

- **WHEN** un sistema que no es de la familia de D&D se marca como edición
  oficial
- **THEN** los tests del proyecto fallan

### Requirement: Alcance de los libros de cada edición

La sección SHALL incluir los libros impresos de Wizards of the Coast de cada
edición dada de alta (básicos, suplementos, ambientaciones y aventuras),
aunque solo se publicaran en inglés, con su edición en castellano cuando una
fuente la confirme. Quedan fuera los productos que no son libros y el
material con licencia de otras editoriales.

#### Scenario: Suplemento de 3.5 solo en inglés

- **WHEN** un suplemento de Wizards of the Coast para D&D 3.5 solo se
  publicó en inglés
- **THEN** entra en la sección, en la ficha de D&D 3.5

#### Scenario: Libro traducido por Devir

- **WHEN** Devir publicó en castellano un libro de D&D 3.5
- **THEN** la ficha del libro muestra su edición en inglés y la de Devir,
  cada una con su editorial, su fecha y su ISBN si lo tiene

### Requirement: Libros solo en DMsGuild

Los libros de la sección están descatalogados: el único enlace de compra que
SHALL admitirse es el de DMsGuild, que vende el PDF o la impresión bajo
demanda de Wizards, en la edición en inglés. El informe de cobertura de
afiliados SHALL revisar solo esa tienda en la sección.

#### Scenario: Libro a la venta en DMsGuild

- **WHEN** un visitante abre la ficha de un libro de D&D 3.5 que DMsGuild
  vende
- **THEN** la edición en inglés muestra el botón de DMsGuild con el aviso de
  afiliado

#### Scenario: Libro que no está en DMsGuild

- **WHEN** un visitante abre la ficha de un libro que DMsGuild no vende
- **THEN** ve sus ediciones con sus datos, ningún botón de compra y la nota
  «Descatalogado.»

#### Scenario: Informe de cobertura

- **WHEN** se ejecuta el informe de cobertura de afiliados
- **THEN** lista los libros de la sección sin enlace a DMsGuild que no
  figuran como excepción

#### Scenario: Libro con enlace de compra

- **WHEN** un libro de la sección tiene enlaces de compra en sus datos
- **THEN** los tests del proyecto fallan

### Requirement: Listado de ediciones

El sitio SHALL tener una página en `/ediciones` con todas las ediciones de
D&D en orden cronológico, cada una con su año y su editorial. Las de la
sección SHALL mostrar su número de libros y enlazar a su ficha; la 5E y su
revisión de 2024 SHALL enlazar al catálogo oficial (`/2014` y `/2024`).

#### Scenario: Entrada a la sección

- **WHEN** un visitante abre `/ediciones`
- **THEN** ve D&D 3.ª edición, D&D 3.5, D&D 5E (2014) y D&D 5E (2024) en ese
  orden, las dos primeras enlazadas a su ficha y las dos últimas al catálogo
  oficial

### Requirement: Ficha de la edición

El sitio SHALL tener una ficha por edición en `/ediciones/:edicion` con su
descripción, sus características, sus datos, sus licencias enlazadas, sus
derivaciones en los dos sentidos, las otras ediciones de D&D y sus libros
agrupados por tipo. Las derivaciones hacia juegos de otras familias SHALL
enlazar a su ficha en otros juegos de rol.

#### Scenario: Juegos derivados de 3.5

- **WHEN** un visitante abre la ficha de D&D 3.5
- **THEN** ve Pathfinder 1E entre los sistemas que derivan de ella,
  enlazado a `/rol/pathfinder-1e`

#### Scenario: Edición inexistente

- **WHEN** un visitante abre `/ediciones/` con una edición que no existe o
  que no es de la sección
- **THEN** ve la página de no encontrado

### Requirement: Ficha del libro de una edición

El sitio SHALL tener una ficha por libro en `/ediciones/:edicion/:libro`,
con su portada, su descripción, su edición enlazada y sus ediciones por
idioma, primero la de castellano si la hay.

#### Scenario: Libro de otra edición en la URL

- **WHEN** un visitante abre `/ediciones/:edicion/:libro` con un libro que
  no es de esa edición
- **THEN** ve la página de no encontrado

### Requirement: Contenido oficial

Las fichas y el listado de la sección SHALL presentarse como D&D oficial,
sin el aviso de «no oficial» de los otros juegos de rol.

#### Scenario: Ficha de D&D 3.5

- **WHEN** un visitante abre la ficha de D&D 3.5 o la de uno de sus libros
- **THEN** no ve ninguna indicación de que no es D&D oficial

### Requirement: Navegación de la sección

La cabecera SHALL enlazar a `/ediciones` con el texto «Todas las
ediciones» dentro del grupo «Libros», junto a las ediciones de 5E. La página
y sus migas SHALL llamarse «Ediciones de D&D», porque lista todas las
ediciones y no solo las anteriores a la 5E.

#### Scenario: Enlace en la cabecera

- **WHEN** un visitante abre cualquier página en escritorio o en móvil
- **THEN** el grupo «Libros» de la cabecera tiene un enlace «Todas las
  ediciones» a `/ediciones`

### Requirement: Redirección de las fichas antiguas

Las URLs de `/rol` de una edición que pasa a la sección SHALL redirigir
permanentemente a su URL en `/ediciones`.

#### Scenario: Ficha antigua de D&D 3.5

- **WHEN** un visitante o un buscador abre `/rol/dnd-3-5`
- **THEN** recibe una redirección permanente a `/ediciones/dnd-3-5`

### Requirement: Prerenderizado y metadatos de la sección

El listado y cada ficha de edición y de libro SHALL prerenderizarse, entrar
en el sitemap y tener título, descripción e imagen para compartir propios.
Las novedades de la sección SHALL entrar en el feed con su URL de
`/ediciones`.

#### Scenario: Fichas en el sitemap

- **WHEN** se genera el build
- **THEN** el sitemap incluye `/ediciones`, `/ediciones/:edicion` de cada
  edición y `/ediciones/:edicion/:libro` de cada libro, y ninguna URL de
  `/rol` de esas ediciones

### Requirement: Inventario de la sección

El inventario maestro SHALL tener una lista de las ediciones y de los libros
de la sección, con su fuente, y cada ficha SHALL figurar en él y al revés.

#### Scenario: Libro de 3.5 fuera del inventario

- **WHEN** existe la ficha de un libro de D&D 3.5 que no está en el
  inventario
- **THEN** los tests del proyecto fallan
