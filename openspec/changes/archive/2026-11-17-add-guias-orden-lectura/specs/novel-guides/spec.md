# Spec Delta

## Purpose

Guías de lectura generadas a partir de los datos de las novelas, que
responden a las búsquedas más habituales y llevan a las fichas.

## ADDED Requirements

### Requirement: Guías de orden de lectura

El sitio SHALL ofrecer una guía de orden de lectura de la Leyenda de
Drizzt y otra de la línea principal de la Dragonlance. Cada una SHALL
listar sus novelas en el orden definido en los datos, agrupadas por serie,
y cada novela SHALL mostrar su título en inglés, su título en castellano
si lo tiene, su año, si está en castellano y un enlace a su ficha.

#### Scenario: Primera novela de Drizzt

- **WHEN** se abre la guía de Drizzt
- **THEN** la primera novela es _Homeland_, con el título _La morada_ y
  un enlace a `/novela/homeland`

#### Scenario: Novela sin traducir

- **WHEN** una novela de la guía no se ha publicado en castellano
- **THEN** la guía lo indica junto a la novela

#### Scenario: Novela de la guía que no existe

- **WHEN** el orden de una guía nombra una serie o una novela sin ficha
- **THEN** los tests del proyecto fallan

### Requirement: Guía de novelas en castellano

El sitio SHALL ofrecer una guía con las novelas publicadas en castellano,
agrupadas por mundo: cada serie con alguna novela traducida, con cuántas
de sus novelas lo están, y las novelas sueltas traducidas, cada una con
enlace a su ficha.

#### Scenario: Serie traducida a medias

- **WHEN** una serie tiene tres novelas y dos están en castellano
- **THEN** la guía la muestra como «2 de 3» y enlaza solo las traducidas

#### Scenario: Mundo sin traducciones

- **WHEN** ninguna novela de un mundo está en castellano
- **THEN** ese mundo no aparece en la guía

### Requirement: Publicación de las guías

Las guías SHALL aparecer en el listado de guías y en el sitemap, y SHALL
prerenderizarse con su contenido completo, sin diferencias entre el HTML
del servidor y el primer render del navegador.

#### Scenario: Visita directa a una guía

- **WHEN** se abre directamente `/guias/orden-de-lectura-drizzt`
- **THEN** el HTML ya trae la lista de novelas y la página hidrata sin
  avisos
