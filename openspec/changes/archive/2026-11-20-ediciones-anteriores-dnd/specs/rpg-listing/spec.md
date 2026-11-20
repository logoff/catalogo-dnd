# Spec Delta

## MODIFIED Requirements

### Requirement: Página de la sección

El sitio SHALL tener una página en `/rol` que presente los sistemas de la
sección, agrupados por familia, y un listado de sus libros, prerenderizada e
incluida en el sitemap, con un enlace a `/licencias`. Las ediciones de D&D
anteriores a la 5E y sus libros no SHALL aparecer en ella, ni en sus filtros
ni en sus recuentos.

#### Scenario: Entrada a la sección

- **WHEN** un visitante abre `/rol`
- **THEN** ve los sistemas con su editorial y su número de libros, cada uno
  enlazado a su ficha, y un enlace a las licencias abiertas

#### Scenario: Sin ediciones anteriores de D&D

- **WHEN** un visitante abre `/rol`
- **THEN** no ve D&D 3.5 entre los sistemas ni libros de D&D 3.5 en el
  listado o en el filtro por sistema, y el recuento de la portada no los
  cuenta
