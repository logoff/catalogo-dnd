# Spec Delta

## MODIFIED Requirements

### Requirement: Filtros

El listado SHALL permitir filtrar por grupo, por tipo, por artículos con
edición en castellano publicada en España y por artículos a la venta, y
combinar los filtros. Los grupos SHALL ser los cinco de la sección,
también «Dados y accesorios» y «Papelería y regalo».

#### Scenario: Filtrar por grupo

- **WHEN** el visitante elige el grupo «Figuras y juguetes»
- **THEN** solo ve figuras, LEGO, Funko, peluches y miniaturas

#### Scenario: Filtrar por dados

- **WHEN** el visitante elige el grupo «Dados y accesorios»
- **THEN** solo ve juegos de dados, accesorios de dados y calendarios de
  adviento de dados

#### Scenario: Filtrar por papelería

- **WHEN** el visitante elige el grupo «Papelería y regalo»
- **THEN** solo ve diarios y cuadernos, puzles y otros artículos de
  papelería y regalo

#### Scenario: Sin resultados

- **WHEN** ningún artículo cumple los filtros
- **THEN** la página lo dice y ofrece quitar los filtros
