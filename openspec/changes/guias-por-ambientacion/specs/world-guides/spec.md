# Spec Delta

## Purpose

Reunir en una página por mundo todo lo que el catálogo tiene de él: libros
de todas las ediciones, novelas y videojuegos.

## ADDED Requirements

### Requirement: Ambientación de los libros

Los libros de 5E y 5.5E y los de rol SHALL poder indicar en `settings` los
mundos en los que transcurren o que describen, con identificadores de la
lista común de mundos, la misma que usan novelas y videojuegos.

#### Scenario: Mundo desconocido

- **WHEN** un libro indica un mundo que no está en la lista común
- **THEN** los tests del proyecto fallan

#### Scenario: Libro de varios mundos

- **WHEN** un libro recorre varios mundos
- **THEN** aparece en la guía de cada uno

### Requirement: Guía por ambientación

El sitio SHALL tener una guía por mundo en `/guias/ambientacion/:mundo`,
generada desde los datos, con sus libros agrupados por edición, sus novelas
y sus videojuegos, cada uno enlazado a su ficha, y `/guias` SHALL listarlas
en un grupo «Ambientaciones».

#### Scenario: Reinos Olvidados

- **WHEN** un visitante abre la guía de los Reinos Olvidados
- **THEN** ve libros de AD&D, de 3.5 y de 5E, novelas como las de Drizzt y
  videojuegos como Baldur's Gate, cada uno enlazado

#### Scenario: Guía en el sitemap

- **WHEN** se genera el build
- **THEN** el sitemap incluye la guía de cada mundo con contenido
