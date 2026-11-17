# Spec Delta

## MODIFIED Requirements

### Requirement: Exclusiones del alcance

La sección SHALL dejar fuera como fichas propias los relatos y novelas
cortas publicados solo dentro de antologías o revistas, las antologías,
los librojuegos, poemas, ensayos, cómics, novelas gráficas, audiolibros
como fichas aparte, novelas de juegos que no son D&D y ficción de fans.
Las antologías oficiales de relatos SHALL recogerse como libros
relacionados según la capacidad `novel-anthologies`, sin ficha propia.

#### Scenario: Librojuego de Endless Quest

- **WHEN** se propone un libro de _Endless Quest_
- **THEN** no entra en la sección

#### Scenario: Novela corta de una antología

- **WHEN** una novela corta solo salió dentro de una antología
- **THEN** no tiene ficha propia, y se llega a ella a través de la
  antología que la contiene

#### Scenario: Antología oficial de relatos

- **WHEN** se propone una antología oficial como _Realms of Valor_
- **THEN** no tiene ficha propia, pero consta como antología relacionada
  con sus series

### Requirement: Recopilatorios

Un recopilatorio que reúne varias novelas en un volumen (en inglés o en
castellano) SHALL guardarse una sola vez, en su serie, con su idioma,
título, editorial, fecha, ISBN si lo tiene y las novelas que contiene,
cada una de las cuales SHALL existir. Los recopilatorios en castellano
que registren las fuentes de ediciones en castellano SHALL constar igual
que los de inglés, y SHALL NOT figurar como edición de cada novela.

#### Scenario: Trilogía en un volumen

- **WHEN** las tres novelas de una trilogía se reeditaron juntas en un
  volumen
- **THEN** el recopilatorio consta una vez en la serie con las tres
  novelas que contiene, y no como edición de cada novela

#### Scenario: Recopilatorio en castellano

- **WHEN** Timun Mas publicó en 2009 las tres novelas de Cormyr en un
  solo tomo
- **THEN** ese tomo consta como recopilatorio en castellano de la serie,
  con las tres novelas, y no como edición de ninguna de ellas

#### Scenario: Recopilatorio con una novela inexistente

- **WHEN** un recopilatorio indica una novela que no tiene ficha
- **THEN** los tests del proyecto fallan
