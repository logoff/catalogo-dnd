# Spec Delta

## MODIFIED Requirements

### Requirement: Alcance de los sistemas

La sección SHALL incluir los sistemas de la familia de D&D: los que derivan
de D&D o se publican bajo sus licencias abiertas (OGL, SRD, ORC), los
grandes juegos de fantasía comparables, como Daggerheart, y los juegos de
los movimientos OSR y NSR. De los que no son OSR ni NSR, SHALL incluir los
grandes y cualquiera con un libro en castellano; de los OSR y NSR, todos los
que tengan un libro impreso. Quedan fuera los juegos de otras familias.

#### Scenario: Sistema pequeño en castellano

- **WHEN** un juego derivado de 5E poco conocido tiene un libro publicado en
  castellano
- **THEN** entra en la sección

#### Scenario: Sistema pequeño solo en inglés

- **WHEN** un juego derivado de 5E poco conocido solo está en inglés
- **THEN** no entra en la sección

#### Scenario: Juego de otra familia en castellano

- **WHEN** un juego de rol sin relación con D&D, como La llamada de
  Cthulhu, está publicado en castellano
- **THEN** no entra en la sección

#### Scenario: Retroclon solo en inglés

- **WHEN** un retroclon de D&D básico tiene libros impresos solo en inglés
- **THEN** entra en la sección con la etiqueta OSR

#### Scenario: Juego NSR

- **WHEN** un juego de la escena NSR inspirado en D&D, como Mörk Borg, tiene
  libros impresos
- **THEN** entra en la sección con la etiqueta NSR
