# Design

## Context

- Las PR se fusionan con squash: cada commit de `main` lleva la fecha de la
  fusión, así que el historial dice qué entró cada mes.
- El despliegue clona con `fetch-depth: 2`; los tests de CI, con el clon
  por defecto (un solo commit).
- `scripts/releases.mjs` ya sabe la sección y la ruta de cada ficha a partir
  de sus datos; `data/review-outlets.json` da el nombre de cada medio.
- Las páginas se prerenderizan desde el sitemap y los datos pesados llegan
  por módulos virtuales de `vite.config.ts`.

## Goals / Non-Goals

**Goals:**

- Calcular el resumen en el build, sin archivos que mantener ni commits
  automáticos.
- Que el módulo que llega al navegador solo lleve lo que se pinta.

**Non-Goals:**

- Resumen del mes en curso o semanal.
- Publicarlo en redes, correo o el informe de Umami (ver #92 y #88).
- Contar cambios de código o de textos de la web, solo de `data/`.

## Decisions

### Estado al empezar y al acabar el mes, no commit a commit

Para cada mes se buscan dos revisiones de `HEAD`: la última con fecha
anterior al día 1 a las 0:00 de Madrid y la última anterior al día 1 del
mes siguiente (`git rev-list -1 --before=…`). Se comparan con
`git diff --name-status -M` sobre `data/` y solo se leen los JSON que
cambian, de una vez, con `git cat-file --batch`. Si no hay revisión al
empezar (antes del historial), todo cuenta como nuevo.

Alternativa descartada: recorrer los commits uno a uno. Contaría lo que se
añade y se quita dentro del mismo mes y es mucho más lento.

### Lógica pura separada de git

`scripts/monthly-summary.mjs` recibe, por cada archivo cambiado, su JSON
antes y después y devuelve el resumen del mes; es lo que prueban los tests.
`scripts/git-history.mjs` resuelve las revisiones y lee los archivos. La
sección, la ruta, el nombre y la fecha de cada ficha se sacan con las
mismas reglas que `releases.mjs`, que exporta lo necesario para no
duplicarlas.

Comparaciones:

- **Ficha nueva**: el archivo no existía al empezar el mes (un archivo
  movido, `R` en el diff, no es nuevo).
- **Edición en castellano nueva**: en una ficha existente, una edición en
  castellano cuyo ISBN (o título y editorial si no tiene) no estaba.
- **Fecha confirmada**: la misma edición en castellano con fecha distinta;
  se guarda la de antes (o «sin fecha») y la nueva.
- **Reseña nueva**: una reseña cuya URL (o medio, si no tiene URL) no
  estaba en la ficha.

### Módulo virtual `virtual:monthly-summaries`

Un plugin calcula los meses completos desde `2026-11` hasta el anterior al
actual y exporta, por mes, los recuentos, hasta diez ejemplos por sección,
hasta diez reseñas y hasta cincuenta ediciones y fechas en castellano. El
cálculo se guarda en memoria, porque el build de cliente y el de servidor
cargan el módulo cada uno.

En un clon superficial (`git rev-parse --is-shallow-repository`) el plugin
exporta una lista vacía y avisa; en el build de producción, falla, para que
un `fetch-depth` mal puesto no publique resúmenes vacíos.

### Página por mes

`MonthlySummaryPage` en `/novedades/:mes` con cabecera, recuentos y una
sección por tipo de cambio, con los componentes base y la fecha en Geist
Mono. Navegación al mes anterior y al siguiente. `/novedades` gana un
bloque «Este mes en el catálogo» con el último mes y el archivo. El sitemap
añade un `loc` por mes publicado.

### Despliegue con el historial completo

`deploy.yml` pasa a `fetch-depth: 0`. El paso que compara `HEAD~1` para
IndexNow sigue funcionando igual.

## Risks / Trade-offs

- [Clon más lento, unos 680 MB] → Se acepta; si crece mucho, se puede
  probar `filter: blob:none`, que trae los JSON bajo demanda.
- [Un commit fusionado con fecha atrasada] → Con squash la fecha es la de
  la fusión; un push directo con fecha manipulada contaría en otro mes, y
  no se hace.
- [Noviembre de 2026 enorme] → Se publica con recuentos y diez ejemplos por
  sección, como cualquier carga grande.
- [Reorganizar carpetas de `data/`] → Los movimientos se detectan como
  renombrados y no cuentan como fichas nuevas, salvo que el contenido
  cambie mucho a la vez.

## Migration Plan

Sin migración. Para deshacerlo basta con revertir; `fetch-depth` puede
volver a `2`.
