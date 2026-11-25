# rpg-crowdfunding Specification

## Purpose

Recoge la campaña de micromecenazgo de la que sale cada edición de un libro
de rol, la muestra en su ficha y anuncia en novedades las que siguen abiertas.

## Requirements

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

### Requirement: Campaña en la ficha

La ficha del libro SHALL mostrar la campaña de cada edición como un enlace
aparte de los de compra, sin afiliado: «En campaña en [plataforma] hasta el
[fecha]» si la fecha de cierre es igual o posterior a la del día de la
generación del sitio, y «Financiado en [plataforma]» si es anterior. El
enlace no SHALL contar como enlace de compra en la cobertura de afiliados.

#### Scenario: Campaña abierta

- **WHEN** una edición tiene una campaña en Verkami que cierra el 27 de
  diciembre de 2026 y el sitio se genera el 25 de noviembre de 2026
- **THEN** la ficha muestra «En campaña en Verkami hasta el 27 de diciembre de 2026»
  enlazado a la campaña

#### Scenario: Campaña cerrada

- **WHEN** la fecha de cierre ya ha pasado
- **THEN** la ficha muestra «Financiado en Verkami» enlazado a la campaña

### Requirement: Campañas abiertas en novedades

La página `/novedades` SHALL tener un bloque «En micromecenazgo» con las
ediciones cuya campaña sigue abierta el día de la generación, cada una con su
plataforma y su fecha de cierre, ordenadas de la que cierra antes a la que
cierra después. Si no hay ninguna, el bloque no SHALL mostrarse.

#### Scenario: Campaña abierta en novedades

- **WHEN** un libro tiene una campaña abierta en Verkami
- **THEN** aparece en «En micromecenazgo» con su fecha de cierre y enlace a
  su ficha

#### Scenario: Campaña que acaba de cerrar

- **WHEN** la fecha de cierre es anterior al día de la generación
- **THEN** el libro ya no aparece en «En micromecenazgo»
