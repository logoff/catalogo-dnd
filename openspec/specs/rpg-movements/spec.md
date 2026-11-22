# rpg-movements Specification

## Purpose

Etiquetar los sistemas de la sección que pertenecen a los movimientos OSR y
NSR, comprobar que su relación con D&D está documentada y explicar a los
visitantes que esas etiquetas son una orientación, no una clasificación
precisa.

## Requirements

### Requirement: Etiqueta de movimiento

Un sistema de la sección SHALL poder indicar un movimiento de una lista
cerrada: `osr` (Old School Renaissance) o `nsr` (New School Revolution). Un
sistema sin etiqueta no pertenece a ninguno. Las ediciones de D&D no SHALL
llevar etiqueta.

#### Scenario: Retroclon

- **WHEN** se da de alta Old-School Essentials
- **THEN** su sistema lleva la etiqueta `osr`

#### Scenario: Movimiento que no está en la lista

- **WHEN** un sistema indica un movimiento que no es `osr` ni `nsr`
- **THEN** los tests del proyecto fallan

#### Scenario: Edición de D&D etiquetada

- **WHEN** el sistema de D&D básico lleva la etiqueta `osr`
- **THEN** los tests del proyecto fallan

### Requirement: Derivación de un sistema OSR

Un sistema `osr` SHALL derivar de una edición de D&D, directamente o a través
de otros sistemas, por derivaciones que no sean de inspiración (revisión,
compatible o cambio mayor de reglas).

#### Scenario: Retroclon de B/X

- **WHEN** Old-School Essentials deriva de D&D básico como compatible
- **THEN** los tests del proyecto pasan

#### Scenario: OSR derivado de otro OSR

- **WHEN** Dolmenwood deriva de Old-School Essentials como compatible
- **THEN** cumple la regla a través de Old-School Essentials

#### Scenario: OSR solo inspirado

- **WHEN** un sistema `osr` solo tiene derivaciones de inspiración
- **THEN** los tests del proyecto fallan

### Requirement: Derivación de un sistema NSR

Un sistema `nsr` SHALL llegar a una edición de D&D por sus derivaciones,
directamente o a través de otros sistemas, y SHALL admitir derivaciones de
inspiración, que llevan siempre su nota.

#### Scenario: Juego inspirado en D&D

- **WHEN** Mörk Borg deriva de D&D básico por inspiración, con nota
- **THEN** los tests del proyecto pasan

#### Scenario: NSR derivado de otro NSR

- **WHEN** Cairn deriva de Into the Odd e Into the Odd de D&D básico por
  inspiración
- **THEN** cumple la regla a través de Into the Odd

#### Scenario: NSR sin relación con D&D

- **WHEN** un sistema `nsr` no llega a ninguna edición de D&D por sus
  derivaciones
- **THEN** los tests del proyecto fallan

### Requirement: Explicación de los movimientos

La sección SHALL tener un texto propio en castellano que explique qué son el
OSR y el NSR, qué criterio sigue el catálogo para etiquetar un juego y que la
definición no es precisa, porque la comunidad discute sus fronteras.

#### Scenario: Frontera difusa

- **WHEN** un visitante lee la explicación
- **THEN** encuentra dicho expresamente que las etiquetas son una orientación
  del catálogo y no una clasificación oficial ni cerrada

#### Scenario: Criterio del catálogo

- **WHEN** un visitante lee la explicación
- **THEN** sabe que un juego OSR deriva de una edición antigua de D&D y que un
  juego NSR solo se inspira en ella o en otro OSR

### Requirement: Etiqueta visible en la ficha del sistema

La ficha de un sistema con movimiento SHALL mostrar su etiqueta, enlazada a la
explicación de los movimientos.

#### Scenario: Ficha de un NSR

- **WHEN** un visitante abre la ficha de Mörk Borg
- **THEN** ve la etiqueta NSR y, al pulsarla, llega a la explicación
