# Tasks

## 1. Lógica del resumen

- [x] 1.1 Exportar de `scripts/releases.mjs` lo que da la sección, la ruta, el nombre y la fecha más reciente de una ficha a partir de su archivo y su JSON; verificar con tests en `scripts/releases.test.mjs` y que los tests del feed siguen pasando
- [x] 1.2 Crear `scripts/monthly-summary.mjs` con la función pura que, dada la lista de archivos cambiados con su JSON antes y después, devuelve fichas nuevas por sección (recuento y diez ejemplos de la más reciente a la más antigua), ediciones en castellano nuevas, fechas confirmadas (antes y después) y reseñas nuevas con el nombre del medio; verificar con tests en `scripts/monthly-summary.test.mjs` (ficha nueva con castellano no cuenta como edición nueva, archivo movido no es nuevo, fecha de «sin fecha» a día, reseña por URL, recorte a diez y a cincuenta)

## 2. Historial y datos en el build

- [x] 2.1 Crear `scripts/git-history.mjs`: límites del mes en hora de Madrid, revisiones con `git rev-list -1 --before`, archivos con `git diff --name-status -M` sobre `data/` y lectura con `git cat-file --batch`; verificar con un test sobre un repositorio temporal con commits fechados (antes del mes, dentro, después, y un archivo movido)
- [x] 2.2 Añadir a `vite.config.ts` el plugin de `virtual:monthly-summaries` con los meses completos desde `2026-11`, caché en memoria, aviso en clon superficial y error en el build de producción; tipos en `src/types/` y declaración del módulo; verificar con `just typecheck`, un test de forma del módulo y `npm run build` en local
- [x] 2.3 Cambiar `deploy.yml` a `fetch-depth: 0`; verificar leyendo el paso de IndexNow (sigue usando `HEAD~1`) y con el despliegue tras fusionar

## 3. Páginas

- [x] 3.1 Crear `src/pages/MonthlySummaryPage.tsx` en `/novedades/:mes` con cabecera, recuentos, fichas nuevas por sección con enlace al listado, ediciones y fechas en castellano, reseñas y navegación al mes anterior y siguiente; meses fuera de rango muestran no encontrado; verificar con `MonthlySummaryPage.test.tsx`
- [x] 3.2 Añadir a `ReleasesPage.tsx` el bloque «Este mes en el catálogo» con el último resumen y el archivo de meses; verificar con `ReleasesPage.test.tsx` (con y sin meses)
- [x] 3.3 Registrar la ruta, el título y la descripción de cada mes, y añadir los meses publicados a `scripts/generate-sitemap.mjs`; verificar con `npm run build` que existe `dist/novedades/2026-11.html` (con la fecha de hoy) y que está en el sitemap
- [x] 3.4 Revisar la página de noviembre en el servidor de desarrollo en escritorio y a 360 px, en tema claro y oscuro

## 4. Documentación

- [x] 4.1 Documentar el resumen en `README.md` y `CLAUDE.md` (cálculo desde git, `fetch-depth: 0`, rutas); verificar con `just check`

## Workflow follow-up

- Tras fusionar, comprobar que el despliegue con historial completo termina y que `/novedades/2026-11` está publicado.
- Cerrar la #91 cuando el resumen de diciembre se publique solo el 1 de enero.
- Archivar el cambio con `/opsx:archive`.
