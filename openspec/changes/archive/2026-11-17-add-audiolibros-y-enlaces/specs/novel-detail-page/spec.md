# Spec Delta

## MODIFIED Requirements

### Requirement: Ediciones y compra

La ficha SHALL mostrar las ediciones agrupadas por idioma, primero las de
castellano, cada una con título, editorial, año, formato, ISBN, portada
si la tiene y botones de compra con el afiliado de cada tienda cuando
esté configurado. Los audiolibros SHALL mostrarse en su idioma, con su
narrador y su duración si se conoce.

#### Scenario: Novela con tres ediciones en castellano

- **WHEN** una novela tiene tres ediciones en castellano
- **THEN** la ficha muestra las tres con su editorial y su año

#### Scenario: Edición Kindle

- **WHEN** una edición ebook se vende en Amazon como Kindle
- **THEN** su botón de compra indica que es la versión Kindle

#### Scenario: Audiolibro

- **WHEN** una novela tiene un audiolibro en inglés
- **THEN** la ficha lo muestra entre las ediciones en inglés con el
  formato «Audiolibro», el narrador y un botón de compra que indica que
  es el audiolibro

#### Scenario: Novela con muchas ediciones en inglés

- **WHEN** una novela tiene siete ediciones en inglés
- **THEN** la ficha muestra las siete, de la más reciente a la más
  antigua, cada una con su portada, editorial, año, formato e ISBN

#### Scenario: Edición en español no publicada en España

- **WHEN** una edición en castellano se publicó fuera de España
- **THEN** la ficha lo indica en esa edición
