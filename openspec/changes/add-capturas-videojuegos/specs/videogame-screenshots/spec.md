# Spec Delta

## Purpose

Define qué capturas de pantalla oficiales se guardan de cada videojuego,
de qué fuentes pueden salir y cómo se muestran en su ficha sin depender
de servidores de terceros.

## ADDED Requirements

### Requirement: Solo capturas oficiales

Un juego SHALL incluir únicamente capturas publicadas en la página del
juego en Steam o GOG, en su web oficial o en el kit de prensa de su
editora o su desarrolladora. Si no hay ninguna, el juego no lleva
capturas.

#### Scenario: Capturas de la página de Steam

- **WHEN** la página de un juego en Steam tiene capturas
- **THEN** esas capturas pueden añadirse a la ficha

#### Scenario: Captura de un usuario o de una wiki

- **WHEN** la única captura disponible de un juego es de un usuario, un
  medio, MobyGames o una wiki
- **THEN** el juego no lleva capturas

### Requirement: Datos de cada captura

Cada captura SHALL guardar la ruta de su imagen en el sitio y la
dirección de la página oficial de donde sale. Un juego SHALL tener como
máximo seis capturas y ninguna repetida.

#### Scenario: Captura sin fuente

- **WHEN** una captura no indica la página de donde sale
- **THEN** los tests del proyecto fallan

#### Scenario: Demasiadas capturas

- **WHEN** un juego tiene siete capturas
- **THEN** los tests del proyecto fallan

### Requirement: Imágenes locales

Cada captura SHALL servirse desde el propio sitio en dos tamaños,
ampliado y miniatura, para que la ficha no pida imágenes a terceros.

#### Scenario: Imagen o miniatura inexistente

- **WHEN** falta en el sitio la imagen ampliada o la miniatura de una
  captura
- **THEN** los tests del proyecto fallan

#### Scenario: Ficha con capturas

- **WHEN** un lector abre la ficha de un juego con capturas
- **THEN** todas las imágenes de la sección se cargan desde el propio
  sitio

### Requirement: Sección de capturas en la ficha

La ficha SHALL mostrar una sección «Capturas» con las miniaturas en el
orden de los datos, cada una con un texto alternativo que nombre el
juego. La sección SHALL omitirse si el juego no tiene capturas.

#### Scenario: Juego con capturas

- **WHEN** un juego tiene cuatro capturas
- **THEN** la ficha muestra la sección «Capturas» con cuatro miniaturas
  en el orden de los datos

#### Scenario: Juego sin capturas

- **WHEN** un juego no tiene capturas
- **THEN** la ficha no muestra la sección «Capturas» ni ningún hueco
  vacío

### Requirement: Visor ampliado

Al pulsar una miniatura, con el ratón o con el teclado, la captura
SHALL abrirse a tamaño ampliado en un visor que permita pasar a la
anterior y a la siguiente y cerrarlo con la tecla Escape, con el mismo
texto alternativo que la miniatura.

#### Scenario: Abrir una captura

- **WHEN** el lector pulsa la tercera miniatura
- **THEN** el visor muestra la tercera captura a tamaño ampliado

#### Scenario: Navegar con el teclado

- **WHEN** el visor está abierto y el lector pulsa la flecha derecha y
  después Escape
- **THEN** el visor pasa a la captura siguiente y luego se cierra

### Requirement: Prerenderizado

Las miniaturas de la sección de capturas SHALL formar parte del HTML
prerenderizado de la ficha.

#### Scenario: HTML prerenderizado

- **WHEN** se genera el HTML de la ficha de un juego con capturas
- **THEN** contiene las miniaturas con su texto alternativo

### Requirement: Mención en la página legal

La página legal SHALL indicar que las capturas de los videojuegos son de
sus desarrolladoras y editoras, proceden de sus canales oficiales y se
muestran solo para dar a conocer cada juego.

#### Scenario: Lector que consulta la propiedad intelectual

- **WHEN** un lector abre la página legal
- **THEN** encuentra la mención a las capturas en el apartado de
  propiedad intelectual
