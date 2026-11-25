# Spec Delta

## MODIFIED Requirements

### Requirement: Alcance de productos licenciados

La sección SHALL incluir productos con licencia oficial de Dungeons &
Dragons publicados desde 2014 que pertenezcan a uno de cinco grupos:
libros licenciados que no son de reglas, figuras y juguetes, juegos de
mesa y cartas que no son de rol, dados y accesorios de dados, y papelería y
regalo.

#### Scenario: Libro de cocina oficial

- **WHEN** un libro de cocina lleva la licencia oficial de D&D
- **THEN** entra en la sección, en el grupo de libros licenciados

#### Scenario: Juego de cartas oficial

- **WHEN** un juego de cartas con licencia de D&D no es un juego de rol
- **THEN** entra en la sección, en el grupo de juegos de mesa y cartas

#### Scenario: Calendario de adviento de dados oficial

- **WHEN** un calendario de adviento de dados lleva la licencia oficial de
  D&D
- **THEN** entra en la sección, en el grupo de dados y accesorios

#### Scenario: Diario de campaña oficial

- **WHEN** un diario o un puzle lleva la licencia oficial de D&D
- **THEN** entra en la sección, en el grupo de papelería y regalo

#### Scenario: Librojuego oficial

- **WHEN** un librojuego de «elige tu camino» lleva la licencia oficial de
  D&D
- **THEN** entra en la sección, en el grupo de libros licenciados con el
  tipo librojuego

#### Scenario: Dados genéricos de rol

- **WHEN** unos dados se venden como «para D&D» sin licencia oficial
- **THEN** no entran en la sección

### Requirement: Grupo y tipo de cada artículo

Cada artículo SHALL indicar su grupo y un tipo de una lista cerrada:
libro de cocina, de manualidades, de arte, guía ilustrada o librojuego;
Funko, LEGO, figura, peluche o miniatura de coleccionista; juego de mesa o
juego de cartas; juego de dados, accesorio de dados o calendario de
adviento de dados; diario o cuaderno, puzle o papelería y otros regalos.

#### Scenario: Tipo que no está en la lista

- **WHEN** un artículo indica un tipo que no está en la lista
- **THEN** los tests del proyecto fallan

#### Scenario: Tipo que no corresponde al grupo

- **WHEN** un artículo del grupo de libros indica el tipo Funko
- **THEN** los tests del proyecto fallan

#### Scenario: Bandeja de dados

- **WHEN** un artículo es una bandeja o una torre para tirar dados
- **THEN** va en el grupo de dados y accesorios con el tipo accesorio de
  dados

#### Scenario: Baraja de tarot

- **WHEN** un artículo es una baraja de tarot, unas postales o un libro de
  pegatinas
- **THEN** va en el grupo de papelería y regalo con el tipo papelería y
  otros regalos
