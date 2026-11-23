# Spec Delta

## Purpose

Define el resumen mensual de cambios del catálogo: qué cambios de los datos
cuenta, cómo se muestran, qué meses se publican y cómo se llega a ellos.

## ADDED Requirements

### Requirement: Comparación del mes

El resumen de un mes SHALL compararse entre el estado de los datos al
empezar el mes y al acabarlo (hora de Madrid), según el historial de
`main`. Lo que se añade y se quita dentro del mismo mes NO SHALL contar.

#### Scenario: Añadido y quitado el mismo mes

- **WHEN** una reseña se añade el día 3 y se quita el día 20
- **THEN** no aparece en el resumen de ese mes

### Requirement: Tipos de cambio

El resumen SHALL contar las fichas nuevas de cada sección, las ediciones
en castellano que aparecen en fichas que ya existían, las ediciones en
castellano de fichas existentes cuya fecha cambia y las reseñas de medios
añadidas a libros y novelas.

#### Scenario: Fecha confirmada

- **WHEN** una edición en castellano pasa de no tener fecha a tener
  «2027-03-15» durante el mes
- **THEN** el resumen la lista entre las fechas confirmadas con la fecha
  anterior y la nueva

#### Scenario: Ficha nueva con edición en castellano

- **WHEN** se da de alta una novela con su edición en castellano
- **THEN** cuenta como ficha nueva y no aparece entre las ediciones en
  castellano nuevas

### Requirement: Cargas grandes

Cada sección de fichas nuevas SHALL mostrar su recuento y como mucho diez
fichas de ejemplo, de la publicación más reciente a la más antigua, con un
enlace al listado de la sección. Las reseñas SHALL mostrar su recuento y
como mucho diez. Las ediciones y fechas en castellano SHALL mostrarse
todas, hasta cincuenta.

#### Scenario: Mes de alta del catálogo

- **WHEN** se muestra noviembre de 2026, con 1.724 fichas nuevas de otros
  juegos de rol
- **THEN** esa sección dice cuántas son y enseña diez

### Requirement: Meses publicados

SHALL publicarse una página por cada mes completo desde noviembre de 2026
en `/novedades/AAAA-MM`. El mes en curso NO SHALL publicarse. Un mes sin
ningún cambio SHALL publicarse igual, diciendo que no hubo cambios. Un mes
fuera de ese rango SHALL mostrar la página de no encontrado.

#### Scenario: Primer día del mes

- **WHEN** el sitio se publica el 1 de diciembre de 2026
- **THEN** existe `/novedades/2026-11` y no existe `/novedades/2026-12`

#### Scenario: Mes inexistente

- **WHEN** se abre `/novedades/2026-10`
- **THEN** se muestra la página de no encontrado

### Requirement: Sin texto redactado

El resumen SHALL componerse solo de títulos, recuentos y entradas sacadas
de los datos, cada una con enlace a su ficha. NO SHALL llevar texto escrito
a mano para cada mes.

#### Scenario: Entrada de una reseña

- **WHEN** se añadió una reseña de un medio a un libro
- **THEN** la entrada muestra el libro, el medio y enlaza a la ficha del
  libro

### Requirement: Acceso y archivo

La página `/novedades` SHALL enlazar al último resumen publicado y al
archivo de todos los meses. Cada resumen SHALL enlazar al mes anterior y al
siguiente si existen. Las páginas de los meses SHALL estar en el sitemap y
tener título y descripción propios con el mes.

#### Scenario: Desde la página de novedades

- **WHEN** hay resúmenes de noviembre y diciembre de 2026
- **THEN** `/novedades` enlaza a diciembre como último resumen y a los
  dos meses en el archivo
