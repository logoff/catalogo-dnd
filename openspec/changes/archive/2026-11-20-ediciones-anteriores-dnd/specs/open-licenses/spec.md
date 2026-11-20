# Spec Delta

## MODIFIED Requirements

### Requirement: Ficha de la licencia

El sitio SHALL tener una ficha por licencia en `/licencia/:slug`, con su
explicación, sus datos, sus enlaces oficiales, los sistemas que la usan y
los libros de esos sistemas o que la usan directamente. Las ediciones
anteriores de D&D SHALL enlazar a su ficha en `/ediciones` y sus libros no
SHALL listarse en la licencia.

#### Scenario: Sistemas agrupados

- **WHEN** un visitante abre la ficha de la ORC
- **THEN** ve los sistemas que la usan, cada uno con enlace a su ficha

#### Scenario: Edición anterior de D&D

- **WHEN** un visitante abre la ficha del SRD 3.5
- **THEN** ve D&D 3.5 entre los sistemas que la usan, enlazado a
  `/ediciones/dnd-3-5`, y ninguno de sus libros

#### Scenario: Licencia relacionada

- **WHEN** un documento de referencia se publica bajo una licencia
- **THEN** cada ficha enlaza a la otra

#### Scenario: Licencia inexistente

- **WHEN** un visitante abre `/licencia/` con un slug que no existe
- **THEN** ve la página de no encontrado
