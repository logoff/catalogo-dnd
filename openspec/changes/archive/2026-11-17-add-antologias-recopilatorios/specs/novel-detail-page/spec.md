# Spec Delta

## ADDED Requirements

### Requirement: Antologías relacionadas

La ficha SHALL mostrar las antologías relacionadas con la novela, sea
por su serie o por la propia novela, con su título (el castellano si se
tradujo), portada, idiomas, año y botones de compra de cada edición a la
venta, y SHALL omitir la sección si no hay ninguna. La sección SHALL
aparecer después de los recopilatorios.

#### Scenario: Novela de una serie con antología

- **WHEN** el usuario abre la ficha de una novela de _The Last Mythal_
- **THEN** la ficha muestra _Realms of the Elves_ en la sección
  «Antologías», con sus botones de compra

#### Scenario: Antología traducida

- **WHEN** una antología relacionada tiene edición en castellano
- **THEN** la ficha muestra su título en castellano e indica que hay
  edición en castellano

#### Scenario: Novela sin antologías

- **WHEN** ninguna antología se relaciona con la novela ni con su serie
- **THEN** la ficha no muestra la sección «Antologías»

#### Scenario: Primer render en servidor y navegador

- **WHEN** la ficha se prerenderiza y luego se hidrata en el navegador
- **THEN** la sección «Antologías» es idéntica en ambos
