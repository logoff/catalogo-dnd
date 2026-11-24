# comic-records Specification

## Purpose

Define qué cómics oficiales de D&D entran en la sección de cómics y qué datos
verificables se guardan de cada serie, de sus números y de sus ediciones en
inglés y en castellano.

## Requirements

### Requirement: Alcance de cómics

La sección SHALL incluir todos los cómics oficiales de Dungeons & Dragons
publicados en inglés, de cualquier año, y todos los publicados en castellano,
dentro o fuera de España: series regulares y limitadas, números únicos y
especiales, novelas gráficas originales, cruces con otras marcas, cómics
infantiles y juveniles, cómics promocionales con número propio y webcómics
oficiales. Una serie publicada solo en castellano SHALL entrar igual.

#### Scenario: Serie limitada de IDW

- **WHEN** se propone _Dungeons & Dragons: Mindbreaker_ (IDW, 2021)
- **THEN** entra en la sección con sus cinco números

#### Scenario: Cruce con otra marca

- **WHEN** se propone _Rick and Morty vs. Dungeons & Dragons_
- **THEN** entra en la sección, porque lleva la licencia oficial de D&D

#### Scenario: Serie publicada solo en castellano

- **WHEN** se propone _Dragones y Mazmorras_ (Planeta DeAgostini, 1985)
- **THEN** entra en la sección aunque no exista en inglés

#### Scenario: Cómic promocional

- **WHEN** un cómic se regaló en el Free Comic Book Day con número propio
- **THEN** entra en la sección

### Requirement: Exclusiones del alcance

La sección SHALL dejar fuera las tiras publicadas solo dentro de revistas,
los cómics de fans o sin licencia, los anuncios en cómic, los libros de arte
y de historia del juego, y los cómics de otras marcas de Wizards que no son
de D&D.

#### Scenario: Tira de la revista Dragon

- **WHEN** se propone una historieta que solo salió en _Dragon Magazine_
- **THEN** no tiene ficha

#### Scenario: Libro de arte

- **WHEN** se propone _Dungeons & Dragons: Arte y arcanos_
- **THEN** no entra en la sección de cómics

### Requirement: Una ficha por serie

Cada serie, novela gráfica u obra única SHALL tener una ficha. Las series
limitadas que continúan una historia con título propio (por ejemplo, las
secuelas de _Legends of Baldur's Gate_) SHALL tener ficha propia y
relacionarse entre sí como continuación.

#### Scenario: Secuela con título propio

- **WHEN** _Shadows of the Vampire_ continúa _Legends of Baldur's Gate_
- **THEN** cada una tiene su ficha y la de _Shadows of the Vampire_ indica
  qué serie continúa

### Requirement: Datos de la serie

Cada ficha SHALL guardar el título original, la editorial, el mundo de campaña
de una lista cerrada (o «varios» o «sin mundo»), la fecha del primer número,
el número de entregas, los guionistas y dibujantes principales, una
descripción propia y una fuente: la página de la editorial o de Wizards, una
base de datos de cómics reconocida (Grand Comics Database, Tebeosfera) o, solo
si no hay otra, la ficha del producto en una tienda. MAY guardar el título en
castellano.

#### Scenario: Serie sin fuente

- **WHEN** una ficha no indica ninguna fuente
- **THEN** los tests del proyecto fallan

#### Scenario: Mundo fuera de la lista

- **WHEN** una ficha indica un mundo que no está en la lista cerrada
- **THEN** los tests del proyecto fallan

### Requirement: Números

Cada ficha SHALL listar sus números en orden, cada uno con su número, su fecha
de portada o de salida, su título si lo tiene, sus autores si cambian
respecto a la serie y la portada principal si se encuentra. Las portadas
variantes NO SHALL constar. Una novela gráfica u obra única SHALL tener un
solo número.

#### Scenario: Número sin portada

- **WHEN** no se encuentra la portada de un número antiguo
- **THEN** el número consta con sus datos y sin portada

#### Scenario: Recuento coherente

- **WHEN** una serie indica cinco entregas y lista cuatro números
- **THEN** los tests del proyecto fallan

### Requirement: Ediciones recopiladas

Cada ficha SHALL guardar todas las ediciones recopiladas con ISBN propio, en
inglés y en castellano con el mismo detalle: título, editorial, fecha,
formato (rústica, tapa dura, integral, digital), ISBN, portada, qué números
recoge y enlaces de compra. Un tomo que recoge números de varias series
SHALL guardarse una sola vez y constar en todas ellas.

#### Scenario: Tomo de la serie

- **WHEN** _Mindbreaker_ se recopila en un tomo en rústica
- **THEN** la ficha muestra el tomo con su ISBN, su portada y los números
  1 a 5

#### Scenario: Integral de varias series

- **WHEN** un integral recoge _Legends of Baldur's Gate_ y _Shadows of the
  Vampire_
- **THEN** el tomo se guarda una vez y aparece en las dos fichas

#### Scenario: Tomo que recoge números inexistentes

- **WHEN** un tomo dice recoger el número 7 de una serie de cinco
- **THEN** los tests del proyecto fallan

### Requirement: Ediciones en castellano

Cada edición en castellano SHALL indicar si se publicó en España, su título
en castellano, su editorial y su fecha, tanto si es un tomo como si es una
edición en grapa número a número. Solo SHALL constar cuando una fuente la
confirme.

#### Scenario: Grapa en castellano de los noventa

- **WHEN** una serie de DC se publicó en España en grapa
- **THEN** la ficha guarda esos números en castellano con su editorial,
  su fecha y su portada si se encuentra

#### Scenario: Tomo de Norma

- **WHEN** Norma publica un tomo que traduce una serie de IDW
- **THEN** consta como edición en castellano publicada en España, con su
  ISBN y los números que recoge

### Requirement: Portadas locales

Cada ficha SHALL tener al menos una portada y cada portada SHALL servirse
desde el propio sitio en WebP con su miniatura. La portada principal de la
ficha SHALL ser la del primer número o, si no hay, la del primer tomo.

#### Scenario: Portada inexistente

- **WHEN** una ficha referencia una portada que no existe en el sitio
- **THEN** los tests del proyecto fallan

### Requirement: ISBN válidos

Los ISBN SHALL guardarse en ISBN-13 con dígito de control válido.

#### Scenario: ISBN con dígito de control erróneo

- **WHEN** una edición guarda un ISBN con el dígito de control mal
- **THEN** los tests del proyecto fallan

### Requirement: URLs de compra limpias

Los enlaces de compra SHALL guardarse sin parámetros de afiliado y solo a
tiendas que el sitio ya conoce; el afiliado se añade al construir el enlace.
Cada edición a la venta SHALL tener enlace en las tiendas de afiliados que
la vendan, y lo que se revisa y no está a la venta SHALL anotarse con su
motivo en las excepciones de afiliados.

#### Scenario: Enlace con afiliado en los datos

- **WHEN** un enlace de compra guardado lleva un parámetro de afiliado
- **THEN** los tests del proyecto fallan

#### Scenario: Tomo a la venta sin enlace

- **WHEN** un tomo en castellano se vende en Amazon y no tiene enlace ni
  excepción
- **THEN** la revisión de cobertura de afiliados lo lista como pendiente

### Requirement: Descripción propia

Cada ficha SHALL tener una descripción propia en castellano de dos párrafos:
de qué trata y dónde encaja (mundo, novelas o videojuegos que adapta o
continúa, si está en castellano), sin copiar textos de editoriales ni
tiendas.

#### Scenario: Ficha sin descripción

- **WHEN** una ficha no tiene descripción de dos párrafos
- **THEN** los tests del proyecto fallan

### Requirement: Relación con el resto del catálogo

Una ficha SHALL poder enlazar a novelas, libros de reglas, videojuegos,
artículos de merchandising y otras fichas de cómics, y cada enlace SHALL
apuntar a una ficha que exista.

#### Scenario: Adaptación de una novela

- **WHEN** _The Legend of Drizzt_ adapta _Homeland_
- **THEN** la ficha del cómic enlaza a la de la novela

#### Scenario: Enlace a una ficha inexistente

- **WHEN** una ficha enlaza a una novela que no existe
- **THEN** los tests del proyecto fallan

### Requirement: Inventario maestro

El proyecto SHALL tener un inventario de los cómics que entran en la sección,
con su fuente y su estado, y cada ficha SHALL figurar en él y al revés.

#### Scenario: Ficha fuera del inventario

- **WHEN** existe la ficha de un cómic que no está en el inventario
- **THEN** los tests del proyecto fallan
