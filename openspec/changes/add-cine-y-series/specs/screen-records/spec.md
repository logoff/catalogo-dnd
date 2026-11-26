# Spec Delta

## Purpose

Define qué películas, series y documentales de D&D entran en el catálogo, cómo
se distingue lo oficial de lo no oficial, qué datos se guardan de cada obra y
cómo se validan.

## ADDED Requirements

### Requirement: Obras oficiales

El catálogo SHALL incluir todas las películas, series y documentales con
licencia de TSR, Wizards of the Coast o Hasbro, en acción real o animación,
estrenados en cines, televisión, streaming o directamente en vídeo, y los
anunciados oficialmente.

#### Scenario: Película de cine

- **WHEN** se revisa el inventario
- **THEN** _Dungeons & Dragons: Honor Among Thieves_ (2023) tiene ficha
  marcada como oficial

#### Scenario: Animación directa a vídeo

- **WHEN** se revisa el inventario
- **THEN** _Dragonlance: Dragons of Autumn Twilight_ (2008) tiene ficha
  marcada como oficial

### Requirement: Obras no oficiales

El catálogo SHALL incluir obras sin licencia de D&D solo si su tema principal
es D&D: el juego, sus creadores, sus jugadores o una campaña de D&D. Las obras
en las que D&D solo aparece en alguna escena o episodio no SHALL entrar.

#### Scenario: Documental sobre el juego

- **WHEN** un documental sin licencia trata de la historia de D&D
- **THEN** tiene ficha marcada como no oficial

#### Scenario: Partida en una escena

- **WHEN** en una serie los personajes juegan a D&D en algunos episodios,
  pero la serie no trata de D&D
- **THEN** la serie no tiene ficha

### Requirement: Motivo de no oficial

Cada obra no oficial SHALL guardar una frase propia que explique por qué no es
oficial y qué relación tiene con D&D.

#### Scenario: Obra no oficial sin motivo

- **WHEN** una ficha marcada como no oficial no tiene el motivo
- **THEN** los tests del proyecto fallan

### Requirement: Tipo de obra

Cada obra SHALL tener un tipo: película, serie, documental o episodio. Una
serie SHALL ser una sola ficha con su fecha de inicio, su fecha de fin si ha
terminado y su número de temporadas (salvo si solo está anunciada), sin desglose
por episodios. Un episodio
solo tiene ficha propia cuando es de D&D dentro de una serie que no lo es, o
cuando se estrena por separado, y SHALL guardar el nombre de su serie.

#### Scenario: Serie terminada

- **WHEN** se guarda la serie animada de 1983
- **THEN** su ficha tiene el tipo serie, el año de inicio, el de fin y el
  número de temporadas

#### Scenario: Episodio de D&D en una antología

- **WHEN** se guarda el episodio de D&D de _Secret Level_
- **THEN** su ficha tiene el tipo episodio y el nombre de la serie, _Secret
  Level_

### Requirement: Títulos

Cada obra SHALL guardar su título original y, si se estrenó o se editó en
España, su título en España.

#### Scenario: Obra sin estreno en España

- **WHEN** una obra no se estrenó ni se editó en España
- **THEN** su ficha no guarda título en España y cuenta como solo en inglés

### Requirement: Sinopsis propia

Cada obra SHALL tener una sinopsis en castellano escrita para el catálogo, sin
copiar texto de IMDb, FilmAffinity, la distribuidora ni ninguna otra fuente.

#### Scenario: Sinopsis de una ficha

- **WHEN** se da de alta una obra
- **THEN** su sinopsis es un texto propio en castellano

### Requirement: Estrenos

Cada obra SHALL guardar sus estrenos con el país (EE. UU., España u otro), el
medio (cines, televisión, streaming o directo a vídeo), la fecha y, si se
conoce, la cadena o plataforma. Una obra anunciada sin fecha SHALL tener el
estado de anunciada.

#### Scenario: Estreno en España

- **WHEN** una película se estrenó en los cines de España
- **THEN** su ficha guarda un estreno con país España, medio cines y la
  fecha

### Requirement: Ediciones físicas

Cada obra SHALL guardar sus ediciones físicas editadas en España (DVD, Blu-ray
o 4K) con su formato, su año, si lleva audio en castellano, si lleva subtítulos
en castellano y sus enlaces de compra.

#### Scenario: Blu-ray con doblaje

- **WHEN** una película tiene Blu-ray español con audio y subtítulos en
  castellano
- **THEN** su ficha guarda la edición con el formato Blu-ray y los dos datos
  en sí

### Requirement: Carteles

Cada obra SHALL tener, si se encuentran, su cartel original y su cartel en
castellano, servidos desde el propio sitio con una miniatura. Los carteles
SHALL salir de fuentes oficiales: la distribuidora, la web oficial o la carátula
de la edición física.

#### Scenario: Obra con los dos carteles

- **WHEN** una película tiene cartel en inglés y en castellano
- **THEN** su ficha guarda los dos, cada uno con su idioma

### Requirement: Enlaces de referencia

Cada obra SHALL guardar su enlace a IMDb y a FilmAffinity cuando tenga página
en ellos, con la dirección canónica de cada uno, y su web oficial si sigue
activa y la mantienen sus autores o su distribuidora.

#### Scenario: Web oficial de un fan

- **WHEN** el dominio de la web de una obra lo mantiene un aficionado o está a
  la venta
- **THEN** la ficha no guarda esa web como oficial

#### Scenario: Enlace a IMDb mal formado

- **WHEN** el enlace a IMDb de una ficha no tiene la forma de una página de
  título de IMDb
- **THEN** los tests del proyecto fallan

### Requirement: Relaciones con el catálogo

Cada obra SHALL poder guardar las novelas, artículos de merchandising y
videojuegos del catálogo con los que se relaciona, y cada relación SHALL
apuntar a una ficha que exista.

#### Scenario: Novelización

- **WHEN** una película tiene novelización en el catálogo
- **THEN** su ficha guarda la relación con esa novela

#### Scenario: Relación rota

- **WHEN** una ficha apunta a una novela que no existe
- **THEN** los tests del proyecto fallan

### Requirement: Inventario maestro

Una lista maestra SHALL recoger todas las obras que deben tener ficha, y cada
ficha SHALL estar en ella y al revés.

#### Scenario: Ficha fuera del inventario

- **WHEN** existe una ficha que no está en la lista maestra
- **THEN** los tests del proyecto fallan

### Requirement: Validación de las fichas

Cada ficha SHALL cumplir el esquema de las obras y tener un slug único.

#### Scenario: Ficha que no cumple el esquema

- **WHEN** una ficha tiene un tipo de obra que no está en el esquema
- **THEN** los tests del proyecto fallan
