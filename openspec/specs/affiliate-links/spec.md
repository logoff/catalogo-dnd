# affiliate-links Specification

## Purpose

Fija qué tiendas con programa de afiliados se enlazan en cada sección del
catálogo y cómo se vigila que ningún producto a la venta quede sin enlace.

## Requirements

### Requirement: Tiendas por sección

El catálogo SHALL enlazar solo tiendas cuyo programa de afiliados esté
aceptado o que no tengan programa (Steam, GOG mientras no se acepte):
Amazon y Casa del Libro en libros de rol, merchandising, novelas, cómics y
otros juegos de rol; Nextory en las novelas que tenga en su catálogo; Juegos
de la Mesa Redonda en libros de rol y otros juegos de rol; NoSoloRol en otros
juegos de rol; Amazon e Instant Gaming en videojuegos. Los programas
rechazados (Fnac, Green Man Gaming, Humble Bundle, Eneba) no SHALL tener
enlaces.

#### Scenario: Libro de rol en castellano en Casa del Libro

- **WHEN** una edición en castellano de un libro de rol se vende en Casa
  del Libro
- **THEN** su ficha muestra el botón de Casa del Libro detrás del de
  Amazon

#### Scenario: Tomo de cómic en castellano

- **WHEN** un tomo en castellano de un cómic de D&D se vende en Amazon y
  en Casa del Libro
- **THEN** su ficha muestra los dos botones de compra

#### Scenario: Libro de otro juego de rol en NoSoloRol

- **WHEN** una edición en castellano de un libro de la sección de otros
  juegos de rol se vende en NoSoloRol
- **THEN** su ficha muestra el botón de NoSoloRol

#### Scenario: Tienda rechazada

- **WHEN** un dato guarda un enlace a una tienda que no está en el
  esquema
- **THEN** los tests del proyecto fallan

### Requirement: Cobertura de enlaces

Cada producto a la venta en una tienda aceptada SHALL llevar su enlace a
esa tienda. Un informe SHALL listar, por sección y tienda, los productos
sin enlace para revisarlos a mano.

#### Scenario: Videojuego a la venta en Instant Gaming

- **WHEN** un videojuego de PC se vende en Instant Gaming
- **THEN** su ficha tiene el enlace de Instant Gaming

#### Scenario: Producto sin enlace

- **WHEN** un libro de rol no tiene enlace de Amazon
- **THEN** el informe lo lista, con el motivo si se comprobó que no está
  a la venta
