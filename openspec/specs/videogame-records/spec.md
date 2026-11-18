# videogame-records Specification

## Purpose

Define qué videojuegos oficiales de D&D entran en el catálogo y qué datos
verificables se guardan de cada uno, para que las fichas y el listado
partan de información completa, coherente y con fuente.

## Requirements

### Requirement: Alcance de juegos oficiales

El catálogo SHALL incluir todo videojuego publicado con licencia de
Dungeons & Dragons o de uno de sus mundos de campaña, sea cual sea su
época o plataforma, incluidos los juegos online, de móvil o de navegador
ya cerrados.

#### Scenario: Juego de un mundo de campaña sin la marca en el título

- **WHEN** un juego con licencia de Dragonlance o de los Reinos
  Olvidados no lleva «Dungeons & Dragons» en el título
- **THEN** el juego entra en el catálogo

#### Scenario: Juego online ya cerrado

- **WHEN** un juego oficial de móvil, navegador o MMO ha cerrado sus
  servidores
- **THEN** el juego entra en el catálogo marcado como cerrado

### Requirement: Exclusiones del alcance

El catálogo MUST NOT incluir juegos de fans, mods, juegos sin licencia,
juegos electrónicos de mesa ni herramientas digitales sin componente de
juego.

#### Scenario: Juego electrónico de mesa

- **WHEN** se evalúa el _Computer Labyrinth Game_ de Mattel (1980)
- **THEN** no se le crea ficha

#### Scenario: Herramienta digital

- **WHEN** se evalúa D&D Beyond o una mesa virtual
- **THEN** no se le crea ficha

### Requirement: Ediciones dentro del mismo juego

Las remasterizaciones y ediciones mejoradas SHALL guardarse como
ediciones del juego original, y las expansiones y DLC dentro del juego
base, salvo las que se vendieron como juego independiente.

#### Scenario: Enhanced Edition

- **WHEN** se registra _Baldur's Gate: Enhanced Edition_
- **THEN** figura como edición del juego _Baldur's Gate_, sin ficha
  propia

#### Scenario: Expansión independiente

- **WHEN** una expansión se vendió como juego independiente, sin
  necesitar el original
- **THEN** tiene su propia ficha

### Requirement: Datos por lanzamiento

Cada juego SHALL registrar sus lanzamientos, uno por plataforma y
edición, con la fecha, y la desarrolladora y la editora cuando sean
distintas de las del juego.

#### Scenario: Cambio de editora en una edición posterior

- **WHEN** el original lo publicó SSI y la edición mejorada otra
  editora
- **THEN** cada lanzamiento muestra su propia editora

#### Scenario: Fecha incompleta

- **WHEN** de un lanzamiento solo se conoce el año o el mes
- **THEN** se guarda solo esa precisión, sin inventar el día

### Requirement: Castellano por lanzamiento

Cada lanzamiento MUST indicar por separado si tiene textos, subtítulos y
voces en castellano oficial. Una traducción de fans solo puede figurar
como nota y nunca cuenta como castellano.

#### Scenario: Juego solo en inglés

- **WHEN** un lanzamiento no tiene castellano oficial
- **THEN** consta explícitamente que está solo en inglés

#### Scenario: Traducción de fans

- **WHEN** existe una traducción de fans conocida
- **THEN** se menciona como nota, pero el lanzamiento sigue sin contar
  como traducido

#### Scenario: Castellano sin confirmar

- **WHEN** no hay fuente fiable que confirme castellano en un lanzamiento
- **THEN** el lanzamiento consta como solo en inglés

### Requirement: Notas de medios

Cada nota SHALL guardar la cifra, su escala, la fuente y el enlace a la
página del juego en el agregador. Las únicas fuentes admitidas son
Metacritic y OpenCritic. La nota se cita como dato: la cifra, el nombre
del agregador en texto y el enlace, sin logotipos y sin copiar reseñas
ni listas de críticas.

#### Scenario: Nota por plataforma

- **WHEN** Metacritic da notas distintas para PC y consola
- **THEN** cada nota indica a qué plataforma corresponde

#### Scenario: Juego sin notas

- **WHEN** no hay ninguna nota de las fuentes admitidas
- **THEN** el juego se registra igual, sin notas

#### Scenario: Nota de un medio

- **WHEN** una nota tiene como fuente un medio que no es Metacritic ni
  OpenCritic
- **THEN** los tests del proyecto fallan

#### Scenario: Edición con página propia

- **WHEN** una edición remasterizada tiene su propia página en
  Metacritic
- **THEN** su nota se guarda aparte, indicando la edición

### Requirement: Datos verificables

Cada dato SHALL salir de una fuente que se pueda citar. Un dato sin
fuente se deja vacío.

#### Scenario: Dato sin fuente

- **WHEN** no se encuentra la editora de un juego en ninguna fuente
  fiable
- **THEN** el campo queda vacío y la ficha se publica igual

### Requirement: Descripción propia

Cada juego MUST tener una descripción propia de dos párrafos: qué es y
en qué mundo y reglas se basa, y para quién es y cómo se puede jugar
hoy.

#### Scenario: Juego sin descripción

- **WHEN** un juego no tiene descripción
- **THEN** los tests del proyecto fallan

### Requirement: Imagen pública local

Cada juego SHALL tener al menos una portada o imagen pública, servida
desde el propio sitio, que se usa solo para identificar el juego.

#### Scenario: Imagen inexistente

- **WHEN** un juego referencia una imagen que no existe en el sitio
- **THEN** los tests del proyecto fallan

### Requirement: Relación con los libros

Un juego SHALL poder enlazar a las fichas de libros del catálogo con las
que tiene relación, y cada enlace MUST apuntar a una ficha existente.

#### Scenario: Libro relacionado inexistente

- **WHEN** un juego apunta a un código de libro que no existe
- **THEN** los tests del proyecto fallan

### Requirement: Recopilaciones definidas una vez

Cada recopilación SHALL definirse una sola vez con su título, los juegos
del catálogo que incluye y sus enlaces de compra por plataforma, y cada
lanzamiento de un juego vendido en ella MUST referenciarla. Todos los
juegos de una recopilación MUST existir en el catálogo.

#### Scenario: Recopilación con un juego inexistente

- **WHEN** una recopilación incluye un juego que no tiene ficha
- **THEN** los tests del proyecto fallan

#### Scenario: Lanzamiento que referencia una recopilación inexistente

- **WHEN** un lanzamiento apunta a una recopilación que no existe
- **THEN** los tests del proyecto fallan

### Requirement: Inventario maestro

El proyecto SHALL mantener un inventario con todos los juegos oficiales
conocidos, su fuente y si ya tienen ficha, que sirve de medida de lo que
falta.

#### Scenario: Juego inventariado sin ficha

- **WHEN** un juego está en el inventario pero no tiene ficha
- **THEN** el inventario lo muestra como pendiente

### Requirement: Notas de todos los juegos con agregador

Todo juego publicado que tenga página con nota en Metacritic u OpenCritic
SHALL llevar esa nota en su ficha.

#### Scenario: Juego con página en Metacritic

- **WHEN** un juego publicado tiene nota en Metacritic
- **THEN** su ficha la muestra con el enlace a la página de Metacritic

#### Scenario: Juego sin página en ningún agregador

- **WHEN** un juego no aparece en Metacritic ni en OpenCritic
- **THEN** su ficha no muestra la sección de notas

### Requirement: Vigilancia de las notas

El proyecto SHALL tener una comprobación que avisa cuando la nota
publicada por el agregador ya no coincide con la guardada o cuando el
enlace ha dejado de existir. La comprobación no bloquea la build y se
ejecuta en la integración continua.

#### Scenario: Nota cambiada

- **WHEN** Metacritic publica un 85 para un juego que tiene guardado un
  84
- **THEN** la comprobación avisa indicando el juego, la nota guardada y
  la publicada, y termina sin error

#### Scenario: Enlace roto

- **WHEN** la página del agregador devuelve un error 404 o 410
- **THEN** la comprobación avisa indicando el juego y el enlace

#### Scenario: Nota que no se puede leer

- **WHEN** el agregador bloquea la petición o la página no trae la nota
  en sus datos estructurados
- **THEN** la nota se cuenta como no comprobada, sin dar aviso

#### Scenario: Sin red

- **WHEN** la comprobación no puede conectarse a internet
- **THEN** da un único aviso y termina sin error
