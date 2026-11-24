# Tasks

## 1. Inventario

- [ ] 1.1 Crear `data/comics/inventory.md` con las 56 series en inglés de la lista de Wikipedia (editorial, años, números, mundo, fuente en GCD o la editorial) y las ediciones en castellano encontradas en Tebeosfera, GCD y Norma (grapas y tomos, con editorial, año e ISBN); verificar que cada fila tiene fuente
- [ ] 1.2 Revisar el inventario con el usuario (casos dudosos: promocionales, webcómic, series canceladas, ediciones fuera de España) antes de cargar fichas

## 2. Modelo de datos

- [ ] 2.1 Esquema `data/schemas/comic.jsonschema` (serie, números, ediciones con `contents`, grapas en castellano) y `collections.json` para los tomos de varias series; verificar con un test que valida un ejemplo correcto y rechaza uno sin fuente
- [ ] 2.2 Tipos en `src/types/comic.ts` y `comicLoader.ts` con campos derivados (años, recuento, castellano, a la venta, en qué tomo está cada número, relaciones inversas); tests del loader
- [ ] 2.3 Tests de datos: esquema, carpeta de la editorial, inventario en los dos sentidos, `issue_count` igual a los números, rangos de `contents` válidos, ISBN-13 válidos, portadas existentes, descripción de dos párrafos, URLs sin afiliado y relaciones que existen; verificar con `just test`
- [ ] 2.4 Plugin `virtual:comics-index` en `vite.config.ts`, caché síncrona, precarga en `main.tsx` y llenado en `entry-server.tsx`; verificar en el build que el trozo principal no crece

## 3. Herramientas

- [ ] 3.1 Receta `just comic-covers` (descarga, WebP de 1200 px y miniatura de 300 px, anotación en la ficha) con su test
- [ ] 3.2 Añadir los cómics a `just affiliate-coverage` (Amazon y Casa del Libro por tomo publicado) y a `data/affiliate-exceptions.json`
- [ ] 3.3 Skill `add-comic` con las reglas, fuentes (GCD, Tebeosfera, editoriales) y pasos, siguiendo `add-novel`

## 4. Páginas

- [ ] 4.1 Listado `/comics` con tarjetas, búsqueda (títulos de serie y tomo, autores, sin tildes), filtros por editorial, mundo, época, castellano y a la venta en la dirección, y orden; tests de filtros y búsqueda
- [ ] 4.2 Ficha `/comic/<slug>` con datos, «Dónde leerla» (tomos por idioma con compra), aviso sin traducción o sin venta, cuadrícula de números con visor y grapas en castellano aparte, continuaciones y contenido relacionado; tests de la página
- [ ] 4.3 Relaciones inversas en las fichas de novelas, videojuegos y merchandising; verificar en una novela adaptada
- [ ] 4.4 Prerenderizado, sitemap, metadatos y datos estructurados (`ComicSeries`), con vista previa de la portada; verificar con `just build`

## 5. Contenido

- [ ] 5.1 Cargar las series de TSR y DC (1987-1991) y los cómics de los noventa, con números, portadas y ediciones en castellano de la época; `just test`
- [ ] 5.2 Cargar Kenzer, Devil's Due y el resto de 2000-2008, con sus tomos; `just test`
- [ ] 5.3 Cargar IDW (2010-2024), con sus tomos en inglés y los de Norma en castellano, con enlaces de compra; `just test`
- [ ] 5.4 Cargar HarperCollins, Dark Horse (2025-2026, también lo anunciado) y _Dragones y Mazmorras_ de Planeta DeAgostini; `just test`
- [ ] 5.5 Revisar con `just affiliate-coverage` que no queda ningún tomo sin enlace ni excepción, y pasar las descripciones al usuario para revisión

## 6. Integración

- [ ] 6.1 Sección «Cómics» en `releases.mjs` (novedades y feed) y en `monthly-summary.mjs`, con tests
- [ ] 6.2 Enlace «Cómics» en el menú «Más de D&D», tarjeta con recuento en la portada y mención en la página legal
- [ ] 6.3 `CLAUDE.md` y README; `just check` y `just build` pasan y la sección se ve en `just dev`

## Workflow follow-up

- Abrir la PR (o varias, por bloques de contenido), fusionar tras la revisión del usuario y archivar con `/opsx:archive`.
