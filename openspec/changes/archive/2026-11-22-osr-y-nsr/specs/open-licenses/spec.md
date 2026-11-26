# Spec Delta

## ADDED Requirements

### Requirement: Licencias de compatibilidad

Una licencia con la que una editorial permite publicar material compatible con
su juego (por ejemplo, las de Old-School Essentials o Mörk Borg) SHALL tener
ficha si la usa un sistema de la sección, con el tipo de licencia comunitaria,
y solo SHALL darse de alta cuando una fuente oficial de la editorial la
publique.

#### Scenario: Licencia de terceros de un juego OSR

- **WHEN** un sistema OSR indica la licencia de terceros de su editorial
- **THEN** la licencia tiene ficha de tipo licencia comunitaria, con un
  enlace oficial a su texto

#### Scenario: Juego sin licencia publicada

- **WHEN** la editorial de un juego no publica ninguna licencia
- **THEN** su sistema indica que no tiene licencia abierta
