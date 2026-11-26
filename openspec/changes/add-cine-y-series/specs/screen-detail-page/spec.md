# Spec Delta

## Purpose

Define la ficha de cada película, serie o documental de D&D: qué datos muestra,
cómo deja claro si la obra es oficial y cómo enlaza con las referencias
externas, las tiendas y el resto del catálogo.

## ADDED Requirements

### Requirement: Dirección de la ficha

Cada obra SHALL tener una ficha en `/cine-y-series/<slug>`, con un slug único.

#### Scenario: Ficha de una película

- **WHEN** se abre `/cine-y-series/<slug>` de una obra existente
- **THEN** se muestra su ficha

#### Scenario: Slug inexistente

- **WHEN** se abre `/cine-y-series/<slug>` de una obra que no existe
- **THEN** se muestra la página de no encontrado

### Requirement: Datos principales

La ficha SHALL mostrar el cartel, el título en España si existe y el original,
el tipo, el año de estreno (o los años de inicio y fin de una serie y sus
temporadas) y la sinopsis, omitiendo los datos que no se conozcan.

#### Scenario: Serie terminada

- **WHEN** se abre la ficha de una serie con inicio y fin
- **THEN** la ficha muestra los dos años y el número de temporadas

### Requirement: Aviso de obra no oficial

La ficha de una obra no oficial SHALL mostrar, junto al título, una insignia «No
oficial» y, cerca de ella, el motivo guardado. La ficha de una obra oficial no
SHALL mostrar esa insignia.

#### Scenario: Documental no oficial

- **WHEN** se abre la ficha de un documental no oficial
- **THEN** junto al título aparece «No oficial» y el motivo

### Requirement: Carteles

La ficha SHALL mostrar como imagen principal el cartel en castellano si existe y,
si hay también cartel original, permitir verlo indicando su idioma.

#### Scenario: Obra con dos carteles

- **WHEN** una obra tiene cartel en castellano y en inglés
- **THEN** la ficha muestra el castellano y da acceso al inglés con su idioma
  indicado

### Requirement: Estrenos

La ficha SHALL mostrar una sección «Estrenos» con cada estreno: país, medio,
cadena o plataforma si se conoce y fecha, ordenados por fecha. Una obra
anunciada sin fecha SHALL indicarlo.

#### Scenario: Estreno en EE. UU. y en España

- **WHEN** una película se estrenó en cines en EE. UU. y en España
- **THEN** la sección muestra los dos estrenos con su fecha

### Requirement: Ediciones y compra

La ficha SHALL mostrar las ediciones físicas con su formato, su año, el audio y
los subtítulos en castellano y sus botones de compra con el aviso de afiliado.
Si la obra no tiene ninguna edición a la venta, la ficha SHALL indicarlo.

#### Scenario: Blu-ray en Amazon

- **WHEN** una película tiene un Blu-ray español a la venta en Amazon
- **THEN** la ficha muestra la edición y el botón de Amazon con el aviso de
  afiliado

### Requirement: Enlaces de referencia

La ficha SHALL enlazar a la web oficial de la obra y a su página en IMDb y en
FilmAffinity cuando existan, en enlaces externos sin afiliado.

#### Scenario: Obra con web oficial

- **WHEN** una obra tiene web oficial
- **THEN** la ficha muestra el enlace «Web oficial» delante de IMDb y
  FilmAffinity

#### Scenario: Obra con las dos fichas externas

- **WHEN** una obra tiene página en IMDb y en FilmAffinity
- **THEN** la ficha muestra los dos enlaces

### Requirement: Contenido relacionado

La ficha SHALL enlazar a las novelas, los artículos de merchandising y los
videojuegos del catálogo con los que esté relacionada la obra, si los hay.

#### Scenario: Película con novelización

- **WHEN** una película está relacionada con su novelización
- **THEN** la ficha enlaza a `/novela/<slug>` de esa novela

### Requirement: Prerenderizado y metadatos

La ficha SHALL prerenderizarse, entrar en el sitemap y llevar título,
descripción, URL canónica, `og:image` a partir del cartel y datos estructurados
`Movie` o `TVSeries` según el tipo, sin valoraciones.

#### Scenario: Metadatos de una película

- **WHEN** se genera la ficha de una película
- **THEN** su HTML incluye datos estructurados `Movie` con su nombre, su fecha
  de estreno y su imagen, sin `AggregateRating`
