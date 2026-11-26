# Spec Delta

## Purpose

Define el listado de películas, series y documentales de D&D: cómo separa lo
oficial de lo no oficial, qué muestra de cada obra, cómo se filtra y ordena y
cómo se llega a él desde el resto del sitio.

## ADDED Requirements

### Requirement: Página de la sección

El sitio SHALL tener una página en `/cine-y-series` con todas las obras,
prerenderizada e incluida en el sitemap.

#### Scenario: Visita a la sección

- **WHEN** se abre `/cine-y-series`
- **THEN** la página lista las obras de la sección con su contenido ya en el
  HTML prerenderizado

### Requirement: Oficial y no oficial separados

El listado SHALL mostrar primero el bloque de obras oficiales y después, con su
propio título y una frase que explique el criterio, el bloque de obras no
oficiales. Una obra no oficial no SHALL aparecer en el bloque oficial.

#### Scenario: Documental sin licencia

- **WHEN** el listado incluye un documental no oficial
- **THEN** aparece solo en el bloque de obras no oficiales, después de todas
  las oficiales

### Requirement: Contenido de cada obra en el listado

Cada obra SHALL mostrar su cartel (el castellano si lo tiene), su título (el de
España si lo tiene), su tipo, su año de estreno y una marca si se estrenó o se
editó en castellano, y enlazar a su ficha.

#### Scenario: Película estrenada en España

- **WHEN** el listado muestra _Honor entre ladrones_
- **THEN** la tarjeta muestra el cartel en castellano, el título en España,
  «Película», 2023 y la marca de castellano, y enlaza a su ficha

### Requirement: Filtros y orden

El listado SHALL permitir filtrar por tipo de obra y por obras en castellano y
combinar los filtros, y ordenar por fecha de estreno (más recientes o más
antiguas primero) y por título.

#### Scenario: Solo series

- **WHEN** se filtra por el tipo serie
- **THEN** cada bloque muestra solo sus series y omite su título si se queda
  vacío

### Requirement: Navegación del sitio

La cabecera SHALL enlazar a la sección con el texto «Cine y series».

#### Scenario: Enlace en la cabecera

- **WHEN** se abre cualquier página del sitio
- **THEN** la cabecera tiene un enlace «Cine y series» a `/cine-y-series`

### Requirement: Feed de novedades

Los estrenos con fecha de las obras SHALL entrar en el feed de novedades del
sitio junto con las del resto de secciones.

#### Scenario: Estreno reciente

- **WHEN** una obra tiene un estreno entre las 50 últimas fechas del sitio
- **THEN** el feed incluye una entrada que enlaza a su ficha
