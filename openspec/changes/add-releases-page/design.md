# Design

## Context

- `scripts/feed.mjs` ya recorre todas las secciones y produce entradas con
  título, fecha, ruta y clave, pero solo de lo publicado, solo con fecha de
  mes o de día, y recortadas a 50. Lo usa `generate-feed.mjs` en el build.
- Las rutas no se cargan de forma diferida y todo se prerenderiza: lo que
  dependa de «hoy» tiene que fijarse en el build para que servidor y
  navegador pinten lo mismo al hidratar.
- Novelas y otros juegos de rol no están en el bundle principal; sus datos
  se leen con plugins de `vite.config.ts` que generan módulos virtuales.
- El despliegue (`deploy.yml`) solo corre al hacer push a `main` o a mano.

## Goals / Non-Goals

**Goals:**

- Una sola definición de «novedad» para el feed y la página.
- Que la página no añada al bundle más que la lista de entradas que muestra.
- Que se mantenga al día sola con los datos que haya.

**Non-Goals:**

- Cuadrícula de calendario, avisos por correo o suscripción (ver #92).
- «Este mes en el catálogo» (#91), que sale del historial de git y no de
  las fechas.
- Datos nuevos: la página muestra lo que la skill `novedades` mantenga.

## Decisions

### Lógica compartida en `scripts/releases.mjs`

Se extrae de `feed.mjs` una función pura que devuelve **todas** las
entradas con fecha de mes o de día (pasadas y futuras) y otra que devuelve
los **anunciados** (sin fecha, o solo con un año posterior al actual). Cada
entrada gana `section` (`libros`, `videojuegos`, `merchandising`,
`novelas`, `rol`, `ediciones`) y `language`. `feed.mjs` se queda con el
filtro de lo publicado, el recorte a 50 y el XML, y sus tests siguen
pasando sin cambios de contenido.

Alternativa descartada: reimplementar la lógica en TypeScript en `src/`.
Duplicaría reglas (deduplicado por formato, rutas de ediciones anteriores)
que ya están probadas en el feed.

Los anunciados salen de las ediciones sin `date` de fichas cuya sección
admita anuncios: libros de 5E y 5.5E, videojuegos con `status:
"announced"` y ediciones de otros juegos de rol o de novelas con solo el
año. Las ediciones sin fecha de libros antiguos de otros juegos de rol (hay
muchas en castellano de Pathfinder 1.ª) NO cuentan como anunciadas: solo
entra un año posterior al actual, nunca la ausencia de fecha en esas
secciones.

### Módulo virtual `virtual:releases` generado en el build

Un plugin de `vite.config.ts`, como el de novelas, lee los JSON, calcula
`today` en hora de Madrid y exporta `{ today, upcoming, recent, announced }`
ya filtrado (90 días, futuras, anunciados). Así el servidor y el navegador
usan la misma fecha y el bundle solo lleva unas decenas de entradas, no
todas las fichas. La portada importa el mismo módulo y toma las tres
primeras de cada lista.

Alternativa descartada: calcular «hoy» en el navegador. Rompería la
hidratación y obligaría a cargar todas las fichas en el cliente.

### Despliegue diario

`deploy.yml` añade `schedule: cron: '0 4 * * *'` (5:00 o 6:00 en Madrid).
El paso de IndexNow ya depende de que el push cambie `data/` o
`src/pages/`, así que en las ejecuciones programadas no avisa. El sitemap
marca `/novedades` con `changefreq: daily`.

Alternativa descartada: un JSON aparte que la página lea al cargar. Más
piezas (fetch, estado de carga, SEO peor) para el mismo resultado.

### Página y componentes

`ReleasesPage` usa los componentes base: cabecera de página, control
segmentado para el idioma (estado local, «Todos» por defecto) y listas
agrupadas por mes con el título de grupo de `headingClass`. Cada entrada:
fecha en Geist Mono, título enlazado, sección como insignia y
`SpanishMark` en castellano. Sin portadas, para que la página sea ligera y
mezcle bien secciones con y sin imagen.

### Menú principal

Se añade «Novedades» como enlace suelto junto a «Guías», con su evento
`menu`. Cambia el menú que se está midiendo en #101; la medición de la #101
tendrá en cuenta la fecha del cambio.

### Medición

Cada enlace de entrada lleva `data-umami-event="novedades"` con
`data-umami-event-seccion` y `data-umami-event-idioma`.

## Risks / Trade-offs

- [Pocas entradas próximas] → El bloque «Próximamente» se oculta si está
  vacío y la página se apoya en lo recién salido; la skill `novedades` se
  pasa una vez al mes.
- [Fechas que se mueven] → La fecha mostrada es la del dato; la página dice
  que las fechas futuras pueden cambiar.
- [Fallo del despliegue programado] → El sitio sigue sirviendo la versión
  anterior; GitHub avisa del fallo como en cualquier despliegue.
- [Repositorio sin actividad 60 días] → GitHub desactiva los `schedule`;
  con la actividad actual no aplica, y se reactiva a mano.

## Migration Plan

Sin migración: página nueva y bloque nuevo en la portada. Para deshacerlo
basta con revertir el cambio; quitar el `schedule` no afecta a nada más.
