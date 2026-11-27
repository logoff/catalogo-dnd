# Tasks

## 1. Lógica de novedades

- [x] 1.1 Crear `scripts/releases.mjs` con la función pura que devuelve todas las entradas con fecha de mes o de día (pasadas y futuras) de todas las secciones, cada una con `section` y `language`, deduplicadas por ficha, fecha y título; verificar con tests en `scripts/releases.test.mjs` (una novela en dos formatos cuenta una vez, sección `ediciones` frente a `rol`, fecha de mes desde el día 1, solo año excluido)
- [x] 1.2 Añadir la función de anunciados: libros de 5E y 5.5E sin fecha, videojuegos `announced` y ediciones con solo un año posterior al actual; verificar con tests (anunciado sin fecha entra, libro antiguo de Pathfinder sin fecha no entra, año siguiente entra con su año)
- [x] 1.3 Añadir la función que separa `recent` (90 días hasta hoy, por fecha descendente) y `upcoming` (posteriores a hoy, por fecha ascendente) con `today` como parámetro; verificar con tests de los límites (hoy cuenta como reciente, 90 días sí, 91 no)
- [x] 1.4 Hacer que `scripts/feed.mjs` use `releases.mjs` para sus entradas; verificar que `scripts/feed.test.mjs` sigue pasando sin cambios y que `npm run build` genera el mismo número de entradas en `dist/feed.xml`

## 2. Datos en el build

- [x] 2.1 Añadir a `vite.config.ts` el plugin de `virtual:releases` que lee los JSON, calcula `today` en hora de Madrid y exporta `{ today, upcoming, recent, announced }`, con sus tipos en `src/types/` y la declaración del módulo; verificar con un test que el módulo solo lleva entradas (sin descripciones) y con `just typecheck`

## 3. Página

- [x] 3.1 Crear `src/pages/ReleasesPage.tsx` con la cabecera de página, «Próximamente» (oculto si está vacío, con meses y anunciados), «Recién salido» por meses, entradas con fecha en monoespaciada, insignia de sección, `SpanishMark` y el evento `novedades` de Umami; verificar con `ReleasesPage.test.tsx` (agrupado, bloque oculto sin anunciados, marca de castellano, atributos del evento)
- [x] 3.2 Añadir el filtro por idioma con `SegmentedControl` («Todos» por defecto); verificar con el test de la página que «Castellano» deja solo esas entradas y quita los meses vacíos
- [x] 3.3 Registrar la ruta `/novedades` en `AppRoutes.tsx`, su título y descripción para el `<head>`, el enlace al feed Atom y la entrada en `scripts/generate-sitemap.mjs` con `changefreq: daily`; verificar con `npm run build` que existe `dist/novedades.html` con su contenido y que está en el sitemap
- [x] 3.4 Revisar la página en el servidor de desarrollo en escritorio y a 360 px, en tema claro y oscuro; verificar que no hay desbordes y que el contraste pasa (`contrast.test.ts` sigue en verde)

## 4. Portada y menú

- [x] 4.1 Añadir a `HomePage.tsx` el bloque «Novedades» como primer bloque de «Lo más reciente», con hasta tres próximas y tres recientes y enlace a `/novedades`; verificar con `HomePage.test.tsx` (con y sin próximas)
- [x] 4.2 Añadir «Novedades» al menú principal de escritorio y móvil en `Header.tsx`, con su evento `menu`; verificar con `Header.test.tsx`

## 5. Despliegue y documentación

- [x] 5.1 Añadir a `.github/workflows/deploy.yml` el `schedule` diario (`0 4 * * *`) y comprobar que el paso de IndexNow no corre en las ejecuciones programadas; verificar leyendo la condición del paso y con una ejecución manual tras fusionar
- [x] 5.2 Documentar la página en `README.md` y en `CLAUDE.md` (rutas, módulo virtual, despliegue diario) y recordar en la skill `novedades` que alimenta `/novedades`; verificar con `just check`

## Workflow follow-up

- Tras fusionar y desplegar, comprobar `/novedades` en producción y lanzar a mano el despliegue programado una vez.
- Medir un mes con Umami (visitas a `/novedades` y evento `novedades`) y cerrar la #89.
- Archivar el cambio con `/opsx:archive`.
