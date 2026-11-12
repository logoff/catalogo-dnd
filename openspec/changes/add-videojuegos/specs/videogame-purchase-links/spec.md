# Spec Delta

## Purpose

Define cómo la ficha de un videojuego enlaza a las tiendas donde se puede
comprar hoy, con enlace de afiliado cuando lo haya, empezando por GOG y
preparado para añadir más tiendas.

## ADDED Requirements

### Requirement: Enlaces agrupados por plataforma

La ficha SHALL agrupar los enlaces de compra por plataforma, con el icono
y el nombre de la plataforma, y dentro de cada plataforma por versión,
indicando la versión, su año y su idioma. La versión MUST NOT mostrarse
pegada a los botones de compra.

#### Scenario: Juego en PC y consola

- **WHEN** un juego se vende en GOG para PC y en una tienda de consola
- **THEN** la ficha muestra un grupo PC con GOG y un grupo de la consola
  con su tienda, cada uno con su icono, su versión, su año y su idioma

#### Scenario: Versión sin fecha

- **WHEN** una versión a la venta no tiene fecha
- **THEN** su línea se muestra sin año

### Requirement: Recopilaciones

Cuando un juego se vende dentro de una recopilación, la ficha SHALL
mostrarlo en un bloque propio con el nombre y el año de la recopilación,
los demás juegos del catálogo que incluye enlazados a sus fichas y los
botones de compra de la recopilación.

#### Scenario: Juego vendido en una recopilación

- **WHEN** un juego solo se vende dentro de Forgotten Realms: The
  Archives – Collection Two
- **THEN** la ficha indica que se vende en esa recopilación, enlaza a
  los otros juegos que incluye y muestra sus botones de compra

#### Scenario: Juego suelto y en recopilación

- **WHEN** un juego se vende suelto y también dentro de una recopilación
  en la misma plataforma
- **THEN** primero aparecen los botones del juego suelto y después el
  bloque de la recopilación

### Requirement: Juego no disponible

Cuando ningún lanzamiento tiene enlace de compra vigente, la ficha SHALL
indicar «No disponible a la venta».

#### Scenario: Juego retirado

- **WHEN** todos los lanzamientos de un juego están retirados de la
  venta
- **THEN** la ficha muestra «No disponible a la venta» y ningún botón de
  compra

### Requirement: Afiliado de GOG

Los enlaces a GOG SHALL llevar el afiliado de Adtraction cuando los IDs
de programa y de canal estén configurados en el build, y la URL limpia
cuando no lo estén.

#### Scenario: Build con afiliado

- **WHEN** el build tiene configurados los IDs de GOG y del canal
- **THEN** el botón de GOG lleva al enlace de seguimiento de Adtraction
  con la URL del juego

#### Scenario: Build sin afiliado

- **WHEN** falta alguno de los IDs
- **THEN** el botón de GOG lleva directamente a la página del juego en
  GOG

### Requirement: Tiendas sin programa de afiliados

El sitio SHALL poder enlazar tiendas sin programa de afiliados, como
Steam, con su URL limpia.

#### Scenario: Enlace a Steam

- **WHEN** un juego tiene enlace a Steam
- **THEN** el botón lleva a la página de Steam sin parámetros añadidos

### Requirement: URLs limpias en los datos

Los datos de los juegos MUST guardar las URLs de tienda sin parámetros de
afiliado; el afiliado se añade solo al generar el sitio.

#### Scenario: URL con afiliado en los datos

- **WHEN** un dato de compra contiene parámetros de afiliado
- **THEN** los tests del proyecto fallan

### Requirement: Todas las tiendas en igualdad

La ficha SHALL mostrar todas las tiendas de una plataforma, incluidas las
de claves como Instant Gaming o Eneba, con el mismo tratamiento y en un
orden fijo que no dependa del tipo de tienda, para que el lector elija.

#### Scenario: Juego en GOG y en tiendas de claves

- **WHEN** un juego tiene enlace a GOG, Instant Gaming y Eneba
- **THEN** los tres botones aparecen en el grupo de PC con el mismo
  formato

#### Scenario: Orden estable

- **WHEN** dos juegos tienen las mismas tiendas
- **THEN** los botones aparecen en el mismo orden en las dos fichas

### Requirement: Ediciones físicas

La ficha SHALL poder enlazar ediciones físicas (por ejemplo, en Amazon)
dentro del grupo de su plataforma, distinguidas de las digitales.

#### Scenario: Edición física de consola

- **WHEN** un juego de consola tiene enlace a su edición física en
  Amazon
- **THEN** el enlace aparece en el grupo de esa consola marcado como
  edición física

### Requirement: Transparencia y medición

Los enlaces de compra SHALL marcarse como patrocinados, la ficha SHALL
avisar de que pueden ser de afiliado y cada clic SHALL registrarse en la
analítica sin los parámetros de afiliado, como ya pasa con los libros.

#### Scenario: Clic en comprar

- **WHEN** un visitante pulsa un botón de compra
- **THEN** se abre la tienda y la analítica registra la tienda y la URL
  limpia
