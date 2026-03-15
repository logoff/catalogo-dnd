# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code)
para trabajar con el código de este repositorio.

## Resumen del proyecto

Catálogo en castellano de libros y accesorios de Dungeons & Dragons
para las ediciones 5E (2014) y 5.5E (2024). Se despliega en GitHub Pages
en <https://logoff.github.io/catalogo-dnd/>.

## Comandos

Se usa `just` como task runner. Ejecutar `just` para ver todas las
recetas disponibles.

- `just dev` — Servidor de desarrollo en <http://localhost:5173/>
- `just build` — Build de producción (incluye comprobación TypeScript
  y generación de sitemap)
- `just test` — Ejecutar tests (vitest)
- `just test-watch` — Tests en modo watch
- `just lint` — ESLint
- `just lint-fix` — ESLint con auto-fix
- `just format` — Formatear con Prettier
- `just format-check` — Comprobar formato con Prettier
- `just check` — Todas las verificaciones (lint + format + typecheck
  y test)

Ejecutar un test individual:
`npx vitest run src/utils/imageResolver.test.ts`

## Arquitectura

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Zustand
(estado) + React Router v6

**Capa de datos:** Los productos están en archivos JSON en
`data/{2014,2024}/products/`, organizados por directorios numerados
de categoría (ej. `01_books/01_core_rules/001_phb.json`). Cada JSON
sigue el esquema de `data/schemas/product.jsonschema`. Los archivos
se importan en tiempo de build mediante `import.meta.glob` de Vite.
El servicio `dataLoader.ts` enriquece los datos `Product` en objetos
`ProductWithMeta` con campos derivados (slug, idiomas, rango de fechas).

**Estructura de producto:** Cada producto tiene un `code` (ej. "PHB")
y un array de `publications` — múltiples ediciones/idiomas/portadas
del mismo producto. Tipos de publicación: `book`, `boxed_set`,
`accessory`. Ediciones: `5e` (2014) y `2024`.

**Rutas:** `/catalogo` (catálogo completo), `/2014` y `/2024` (páginas
de edición con categoría opcional), `/producto/:edition/:code` (detalle
de producto).

**Alias de ruta:** `@` apunta a `./src` (configurado en vite.config.ts).

**Base path:** `/catalogo-dnd/` en producción, `/` en desarrollo
(vite.config.ts).

## Pre-commit

Husky + lint-staged ejecuta ESLint y Prettier sobre archivos `.ts`,
`.tsx`, `.js`, `.jsx`, `.mjs` staged antes de cada commit. Los archivos
`.md` pasan por markdownlint y Prettier.

## Idioma

La interfaz, el README, los mensajes de commit y todo el contenido
visible al usuario están en castellano. Los datos de productos incluyen
publicaciones tanto en inglés como en castellano.
