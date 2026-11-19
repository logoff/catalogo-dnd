# open-licenses Specification

## Purpose

Define qué licencias abiertas de juegos de rol tienen ficha, qué datos
verificables se guardan de cada una y qué muestra su ficha, como referencia
de cómo se relacionan los sistemas entre sí y con D&D.

## Requirements

### Requirement: Alcance de las licencias

La sección SHALL tener ficha de cada licencia abierta, documento de
referencia o licencia comunitaria que use al menos un sistema de la sección,
como la OGL 1.0a, el SRD 5.1, el SRD 5.2 o la ORC.

#### Scenario: Licencia usada por un sistema

- **WHEN** un sistema de la sección indica que usa la ORC
- **THEN** la ORC tiene ficha

#### Scenario: Licencia que no usa ningún sistema

- **WHEN** una licencia no la usa ningún sistema de la sección
- **THEN** no hace falta darla de alta

### Requirement: Tipo de licencia

Cada licencia SHALL indicar su tipo de una lista cerrada: licencia (texto
legal que permite publicar), documento de referencia (reglas publicadas bajo
una licencia) o licencia comunitaria de un editor para su propio juego.

#### Scenario: Documento de referencia

- **WHEN** se da de alta el SRD 5.1
- **THEN** su tipo es documento de referencia y enlaza a las licencias bajo
  las que se publica

#### Scenario: Tipo que no está en la lista

- **WHEN** una licencia indica un tipo que no está en la lista
- **THEN** los tests del proyecto fallan

### Requirement: Datos de la licencia

Cada licencia SHALL guardar su nombre, quién la publica, su fecha y al menos
un enlace oficial (texto legal, documento de referencia o preguntas
frecuentes del titular). SHALL poder guardar notas de estado con fecha, como
una revocación anunciada o retirada.

#### Scenario: Licencia sin enlace oficial

- **WHEN** una licencia no tiene ningún enlace oficial
- **THEN** los tests del proyecto fallan

#### Scenario: Cambio de estado

- **WHEN** el titular anuncia un cambio en la licencia
- **THEN** la ficha lo recoge como nota con su fecha y su fuente

### Requirement: Explicación propia

Cada licencia SHALL tener una explicación propia en castellano de qué es, qué
permite y qué no, sin copiar el texto legal ni interpretarlo como
asesoramiento jurídico.

#### Scenario: Licencia sin explicación

- **WHEN** una licencia no tiene explicación
- **THEN** los tests del proyecto fallan

### Requirement: Ficha de la licencia

El sitio SHALL tener una ficha por licencia en `/licencia/:slug`, con su
explicación, sus datos, sus enlaces oficiales, los sistemas que la usan y
los libros de esos sistemas o que la usan directamente.

#### Scenario: Sistemas agrupados

- **WHEN** un visitante abre la ficha de la ORC
- **THEN** ve los sistemas que la usan, cada uno con enlace a su ficha

#### Scenario: Licencia relacionada

- **WHEN** un documento de referencia se publica bajo una licencia
- **THEN** cada ficha enlaza a la otra

#### Scenario: Licencia inexistente

- **WHEN** un visitante abre `/licencia/` con un slug que no existe
- **THEN** ve la página de no encontrado

### Requirement: Listado de licencias

El sitio SHALL tener una página en `/licencias` con todas las licencias, su
tipo, su titular y cuántos sistemas las usan, cada una enlazada a su ficha.

#### Scenario: Recuento de sistemas

- **WHEN** un visitante abre `/licencias`
- **THEN** cada licencia indica cuántos sistemas de la sección la usan

### Requirement: Prerenderizado y metadatos de las licencias

`/licencias` y cada ficha de licencia SHALL prerenderizarse, entrar en el
sitemap y tener título y descripción propios.

#### Scenario: Ficha en el sitemap

- **WHEN** se genera el build
- **THEN** el sitemap incluye `/licencia/:slug` de cada licencia
