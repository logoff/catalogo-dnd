# Tasks

## 1. Datos y carga

- [x] 1.1 `data/novels/reading-orders.json` con el orden de Drizzt y de
      la Dragonlance (bloques por serie o lista de novelas); verificación:
      test de que cada serie y novela existe.
- [x] 1.2 `preloadNovelRoute` carga el índice en las rutas de las guías
      nuevas; verificación: test de `novelLoader`.

## 2. Guías

- [x] 2.1 Componente `ReadingOrderGuide` y guías de Drizzt y de la
      Dragonlance con su introducción; verificación: tests (primera
      novela de Drizzt, novela sin traducir, enlaces a fichas).
- [x] 2.2 Guía «Novelas de D&D en castellano» calculada sobre el índice;
      verificación: tests (serie «2 de 3», mundo sin traducciones fuera).
- [x] 2.3 Rutas, entradas en `GUIDES` y URLs en el sitemap;
      verificación: `just build` prerenderiza las tres y el HTML trae la
      lista; revisión en el navegador sin avisos de hidratación.

## 3. Cierre

- [x] 3.1 Mencionar las guías en `CLAUDE.md` si hace falta y comprobar el
      formato; verificación: `just check`.

## Workflow follow-up

- Archivar el cambio con `/opsx:archive` cuando todas las tareas estén
  hechas.
