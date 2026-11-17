# Spec Delta

## Purpose

Define el listado público de la sección de novelas: qué muestra, cómo se
busca, filtra y ordena, y cómo se llega a él desde el resto del sitio.

## ADDED Requirements

### Requirement: Página de listado

El sitio SHALL tener una página en `/novelas` con todas las novelas de la
sección, prerenderizada e incluida en el sitemap.

#### Scenario: Orden por defecto

- **WHEN** un visitante abre `/novelas` sin elegir orden
- **THEN** ve las novelas de la más reciente a la más antigua según su
  primera edición en inglés

### Requirement: Carga progresiva

El listado SHALL mostrar las novelas por tandas y cargar las portadas
solo cuando van a verse, para que la página siga siendo ligera con cientos
de novelas.

#### Scenario: Ver más novelas

- **WHEN** el visitante llega al final de la primera tanda
- **THEN** puede ver la siguiente sin perder los filtros elegidos

### Requirement: Contenido de cada tarjeta

Cada novela del listado SHALL mostrar su portada, su título original, su
título en castellano si lo tiene, sus autores, su serie y número, el año
y una marca si tiene edición en castellano, y enlazar a su ficha.

#### Scenario: Novela traducida

- **WHEN** una novela tiene edición en castellano
- **THEN** su tarjeta muestra el título en castellano y la marca

#### Scenario: Novela sin serie

- **WHEN** una novela no pertenece a ninguna serie
- **THEN** la tarjeta se muestra sin serie ni número

### Requirement: Filtros

El listado SHALL permitir filtrar por mundo de campaña, por serie, por
novelas con edición en castellano y por novelas a la venta, y combinar los
filtros.

#### Scenario: Filtrar por mundo

- **WHEN** el visitante elige el mundo Dragonlance
- **THEN** solo ve novelas de Dragonlance

#### Scenario: Series del mundo elegido

- **WHEN** el visitante ha elegido un mundo
- **THEN** el filtro de serie solo ofrece series de ese mundo

#### Scenario: Sin resultados

- **WHEN** ninguna novela cumple los filtros
- **THEN** la página lo dice y ofrece quitar los filtros

### Requirement: Búsqueda

El listado SHALL permitir buscar por título original, por título de
cualquier edición en castellano y por autor, sin distinguir mayúsculas ni
tildes.

#### Scenario: Búsqueda por título en castellano

- **WHEN** el visitante busca «el retorno de los dragones»
- **THEN** encuentra _Dragons of Autumn Twilight_, la novela que se
  publicó con ese título en castellano

#### Scenario: Búsqueda por autor

- **WHEN** el visitante busca «salvatore»
- **THEN** ve las novelas de R. A. Salvatore

### Requirement: Orden

El listado SHALL permitir ordenar por fecha (más recientes o más antiguas
primero), por título y por orden de lectura, que agrupa por serie y sigue
el número de cada novela en ella.

#### Scenario: Orden de lectura

- **WHEN** el visitante filtra una serie y ordena por orden de lectura
- **THEN** ve sus novelas por su número en la serie

### Requirement: Filtros en la dirección

Los filtros de mundo y serie SHALL reflejarse en la dirección de la
página, para poder compartir o guardar un listado filtrado.

#### Scenario: Abrir un listado compartido

- **WHEN** un visitante abre un enlace al listado filtrado por una serie
- **THEN** ve el listado con ese filtro aplicado

### Requirement: Navegación del sitio

La cabecera y la portada SHALL enlazar a la sección de novelas.

#### Scenario: Enlace en la cabecera

- **WHEN** un visitante abre cualquier página en escritorio o en móvil
- **THEN** la cabecera tiene un enlace «Novelas» a `/novelas`

### Requirement: Secciones existentes intactas

El catálogo de libros, el de videojuegos, el de merchandising y el
buscador de la cabecera SHALL seguir funcionando igual; las novelas no
aparecen en ellos.

#### Scenario: Buscador de la cabecera

- **WHEN** un visitante busca el título de una novela en la cabecera
- **THEN** el buscador sigue mostrando solo libros de reglas
