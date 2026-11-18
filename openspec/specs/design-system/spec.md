# design-system Specification

## Purpose

Define el sistema de diseño común a todo el sitio: colores semánticos,
tipografía, componentes base, contraste, logo y qué recursos visuales no se
usan, para que todas las páginas se vean y se comporten igual.

## Requirements

### Requirement: Colores semánticos

Todo el sitio SHALL pintarse con un conjunto cerrado de colores semánticos,
definidos para el tema claro y el oscuro: fondo, superficie, hueco (fondo
de portadas y controles), texto, texto secundario, borde, acento de texto,
acento de botón, texto sobre acento, acento suave y foco. Ningún componente
SHALL usar un color fuera de ese conjunto, salvo las portadas, capturas e
iconos de marcas de terceros (plataformas, tiendas).

#### Scenario: Componente con un color suelto

- **WHEN** se revisa el código de un componente o página
- **THEN** sus colores salen del conjunto semántico y no de la paleta
  general (grises, ámbar, morado…) ni de valores hexadecimales sueltos

#### Scenario: Mismo componente en los dos temas

- **WHEN** se cambia de tema claro a oscuro
- **THEN** cada componente cambia de colores sin cambiar de estructura

### Requirement: Rojo como único acento

El rojo de D&D SHALL ser el único color de acento. Se reserva para la acción
principal de cada vista (comprar), el estado «en castellano», el elemento
activo de la navegación o de un filtro y el foco. En el tema claro es
`#D21F2B`. En el tema oscuro es un rojo apagado que no deslumbra: `#D9726D`
para texto y `#B23C37` para el fondo de los botones. El resto de la
interfaz usa neutros. No SHALL usarse dorado ni colores por tipo de
producto.

#### Scenario: Disponibilidad en castellano

- **WHEN** un libro, juego, artículo o novela tiene edición en castellano
- **THEN** su tarjeta o ficha lo indica con el acento rojo

#### Scenario: Solo en inglés

- **WHEN** un producto no tiene edición en castellano
- **THEN** se indica en un neutro, sin color de acento

#### Scenario: Títulos y enlaces

- **WHEN** se muestra un título o un enlace de texto corriente
- **THEN** usa el color de texto, no el acento ni el dorado

### Requirement: Contraste y foco

Todo texto SHALL tener un contraste mínimo de 4,5:1 con su fondo (3:1 a
partir de 24 px) en los dos temas, incluido el texto secundario y el texto
sobre el acento. Todo elemento interactivo SHALL mostrar un indicador de
foco visible al navegar con el teclado y tener un área de pulsación de al
menos 44×44 px en móvil.

#### Scenario: Texto secundario en oscuro

- **WHEN** se mide el contraste del texto secundario sobre la superficie en
  el tema oscuro
- **THEN** es de al menos 4,5:1

#### Scenario: Navegación con teclado

- **WHEN** se recorre una página con el tabulador
- **THEN** cada enlace, botón y campo muestra el foco con un contorno
  visible

### Requirement: Tipografía

El sitio SHALL usar una única familia sin serifa para títulos y texto, y su
variante monoespaciada con cifras tabulares para fechas, códigos de
producto, ISBN, páginas y notas. Las fuentes SHALL servirse desde el propio
sitio, sin contactar con servicios de terceros, y solo con el subconjunto
latino.

#### Scenario: Fecha en una tabla de ediciones

- **WHEN** se muestran varias fechas o ISBN en columna
- **THEN** sus cifras quedan alineadas

#### Scenario: Carga de fuentes

- **WHEN** se carga cualquier página
- **THEN** no se hace ninguna petición a Google Fonts ni a otro dominio
  para las fuentes

### Requirement: Componentes base

Las páginas SHALL construirse con un juego común de componentes: botón
(principal, secundario y discreto), tarjeta, insignia, campo de búsqueda,
control segmentado, navegación por secciones y tabla de ediciones. Dos
elementos con la misma función SHALL verse igual en todas las secciones.

#### Scenario: Tarjeta de producto en cualquier sección

- **WHEN** se compara una tarjeta del listado de libros con una de
  videojuegos, merchandising o novelas
- **THEN** comparten borde, radio, fondo de la portada y estilo de la marca
  de castellano

#### Scenario: Filtro de edición

- **WHEN** un listado permite elegir edición (5E o 5.5E)
- **THEN** se elige con un control segmentado

### Requirement: Sin animaciones decorativas

El sitio NO SHALL usar animaciones de entrada de elementos ni de cambio de
página, degradados decorativos, ni sombras o bordes que cambien al pasar el
ratón como único indicio de interacción. Las transiciones de color al pasar
el ratón o al enfocar SHALL durar como mucho 150 ms, y SHALL desactivarse
si el usuario pide reducir el movimiento.

#### Scenario: Cambio de página

- **WHEN** se navega de una página a otra
- **THEN** la nueva página se muestra al momento, sin fundido ni
  desplazamiento

#### Scenario: Movimiento reducido

- **WHEN** el sistema del usuario pide reducir el movimiento
- **THEN** no hay ninguna transición

### Requirement: Logo del D20

El logo SHALL ser el D20 actual, con la misma forma, pintado con los
colores semánticos de forma que se vea bien en los dos temas. El favicon
SHALL usar el mismo D20 con colores que se distingan sobre fondos de
pestaña claros y oscuros.

#### Scenario: Logo en tema oscuro

- **WHEN** se muestra la cabecera en el tema oscuro
- **THEN** el D20 se ve con sus aristas en rojo y su cuerpo distinguible
  del fondo

### Requirement: Diseño adaptable

Todas las páginas SHALL funcionar desde 360 px de ancho sin desplazamiento
horizontal de la página. Las tablas anchas SHALL desplazarse dentro de su
propia caja y la navegación principal SHALL recogerse en un menú en móvil.

#### Scenario: Tabla de ediciones en móvil

- **WHEN** se abre una ficha con la tabla de ediciones a 360 px de ancho
- **THEN** la página no se desplaza en horizontal y la tabla se puede
  desplazar dentro de su caja
