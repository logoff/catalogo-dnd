# Spec Delta

## MODIFIED Requirements

### Requirement: Filtros

El listado SHALL permitir filtrar por grupo, por tipo, por artículos con
edición en castellano publicada en España y por artículos a la venta, y
combinar los filtros. Los grupos SHALL ser los cuatro de la sección,
también «Dados y accesorios».

#### Scenario: Filtrar por grupo

- **WHEN** el visitante elige el grupo «Figuras y juguetes»
- **THEN** solo ve figuras, LEGO, Funko, peluches y miniaturas

#### Scenario: Filtrar por dados

- **WHEN** el visitante elige el grupo «Dados y accesorios»
- **THEN** solo ve juegos de dados, accesorios de dados y calendarios de
  adviento de dados

#### Scenario: Sin resultados

- **WHEN** ningún artículo cumple los filtros
- **THEN** la página lo dice y ofrece quitar los filtros
