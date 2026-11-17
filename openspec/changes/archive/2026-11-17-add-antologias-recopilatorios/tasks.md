# Tasks

## 1. Recopilatorios en castellano

- [x] 1.1 Script en la skill `add-novel` que recorre las ediciones en
      castellano de todas las fichas y detecta las que comparten ISBN entre
      varias novelas; verificación: lista revisada a mano con cada caso.
- [x] 1.2 Buscar en Tercera Fundación los recopilatorios en castellano de
      cada serie que no aparezcan como edición compartida (por ejemplo,
      «Trilogía» o «Saga» de Timun Mas y Minotauro); verificación: lista de
      candidatos con ISBN, fecha y novelas.
- [x] 1.3 Añadir los recopilatorios a `collections` de su serie en
      `series.json`, quitarlos de las ediciones de cada novela, descargar
      sus portadas (`--series`) y anotarlos en la sección «Recopilatorios»
      del inventario; verificación: `just check` en verde y la ficha de
      _Cormyr_ muestra el tomo de 2009 en «Recopilatorios».

## 2. Modelo y carga de antologías

- [x] 2.1 Esquema `data/schemas/novel-anthology.jsonschema` (reutiliza
      `$defs` de `novel.jsonschema`) y tipos en `src/types/novel.ts`;
      verificación: tests de validación en `novelLoader.test.ts` (antología
      válida, ISBN inválido, sin edición en inglés).
- [x] 2.2 Carga perezosa de `data/novels/anthologies.json` en
      `novelLoader.ts`, precarga en `main.tsx` y `entry-server.tsx`, y
      función que devuelve las antologías de una novela por serie o por
      slug; verificación: tests unitarios de la función y de que el bundle
      principal no incluye las antologías (`just build`).
- [x] 2.3 Tests de integridad: cada serie y novela referenciada existe,
      portadas existentes, URLs limpias, y cruce con la sección «Antologías»
      del inventario; verificación: los tests fallan con datos de prueba
      rotos y pasan con los reales.
- [x] 2.4 Modo `--anthology <id>` en `scripts/download-novel-covers.mjs`;
      verificación: descarga de una portada de prueba en
      `public/images/novels/anthologies/<id>/`.

## 3. Sección en la ficha

- [x] 3.1 Sección «Antologías» en `NovelDetail.tsx` tras «Recopilatorios»,
      con portada, título (castellano si lo hay), idiomas, año y botones de
      compra por edición; verificación: tests en `NovelDetailPage.test.tsx`
      (con antología por serie, por novela y sin antologías).
- [x] 3.2 Comprobar en el navegador una ficha con antologías en castellano
      e inglés y que la hidratación no da avisos; verificación: `just dev` y
      consola sin errores.

## 4. Datos de antologías

- [x] 4.1 Sección «Antologías» en `inventory.md` con las 44 antologías
      (43 de Wikipedia sin el duplicado de _Dragons: Worlds Afire_, más
      _Untold Adventures_, que sale de «Descartadas»); verificación: el
      test de inventario cruza la sección con los datos.
- [x] 4.2 Ediciones en inglés (ISFDB) y en castellano (Tercera
      Fundación), enlaces de Amazon, Kindle y Casa del Libro, y portadas de
      las antologías de Dragonlance; verificación: `just check` en verde.
- [x] 4.3 Lo mismo para las antologías de Reinos Olvidados, Eberron,
      Ravenloft, Greyhawk y las de varios mundos, con sus relaciones a partir
      de los contenidos de ISFDB; verificación: `just check` en verde y cada
      antología enlazada desde al menos una ficha.
- [x] 4.4 Actualizar la skill `add-novel` (cómo dar de alta antologías y
      recopilatorios en castellano), `CLAUDE.md` y el aviso de portadas de
      la página legal si hace falta; verificación: revisión del texto.

Notas de la aplicación: Tercera Fundación guarda los recopilatorios como
ficha propia con el contenido enumerado; salieron cuatro (_Quinta era_,
_El elfo oscuro_, _La tribu de Uno_ y las _Crónicas_, que ya estaba) y se
descartó _Mithas y Karthay_, que es una sola novela. El tomo de _Cormyr_ de
2009 es una edición de esa novela sola, no un recopilatorio. El inventario
no tiene sección de recopilatorios: viven solo en `series.json`.

## Workflow follow-up

- Archivar el cambio con `/opsx:archive` cuando todas las tareas estén
  hechas.
