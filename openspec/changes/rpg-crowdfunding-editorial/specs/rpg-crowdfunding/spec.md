# Spec Delta

## MODIFIED Requirements

### Requirement: Campaña de la edición

Una edición de un libro de rol SHALL poder indicar la campaña de
micromecenazgo con la que se financió o se está financiando: plataforma de
una lista cerrada (Verkami, Kickstarter, Gamefound, BackerKit, Lanzanos,
Ulule o el mecenazgo en la tienda de la propia editorial), enlace a la campaña
y fecha de cierre. Solo SHALL recogerse campañas conseguidas o abiertas.

#### Scenario: Campaña conseguida

- **WHEN** un libro se financió en Verkami y la campaña cerró conseguida
- **THEN** su edición guarda la plataforma, el enlace y la fecha de cierre

#### Scenario: Mecenazgo en la tienda de la editorial

- **WHEN** Nosolorol financió un libro en un mecenazgo de su propia tienda
- **THEN** su edición guarda la campaña con la plataforma «mecenazgo de la
  editorial» y la ficha dice «Financiado en el mecenazgo de la editorial»

#### Scenario: Plataforma que no está en la lista

- **WHEN** una edición indica una plataforma que no está en la lista cerrada
- **THEN** los tests del proyecto fallan
