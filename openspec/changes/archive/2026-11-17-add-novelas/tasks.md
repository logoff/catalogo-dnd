# Tasks

## 1. Inventario

- [x] 1.1 Generar `data/novels/inventory.md` desde el wikitexto de la
      lista de Wikipedia con un script de un solo uso (en el scratchpad,
      no en el repositorio): novelas, juveniles, infantiles, ebook y
      novelas cortas publicadas sueltas, una tabla por mundo con serie y
      número, título, autores, fecha, tipo, castellano «sin comprobar» y
      ficha «pendiente»; verificar a mano una muestra de cada mundo y que
      no entran relatos, antologías, librojuegos ni cómics
- [x] 1.2 Revisar el inventario con el usuario (casos dudosos: novelas
      cortas, ebooks, novelizaciones, mundos raros como _Before the
      Strike_ o _Feywild_) y dejarlo aprobado con su fecha de revisión

## 2. Modelo de datos

- [x] 2.1 Crear `data/schemas/novel.jsonschema` y el de
      `data/novels/series.json` según el diseño (mundos, tipos, formatos,
      ediciones con `country` en las inglesas y `spain` en las de castellano, recopilatorios, fuente
      obligatoria, relaciones); verificar con tests de una novela válida y
      de inválidas (mundo desconocido, sin edición inglesa, sin fuente,
      campo desconocido)
- [x] 2.2 Crear la utilidad de ISBN (dígito de control de ISBN-13 y
      conversión desde ISBN-10); verificar con tests unitarios con ISBN
      reales de TSR y de Timun Mas
- [x] 2.3 Crear `src/types/novel.ts` y `src/services/novelLoader.ts` con
      `year`, `titleEs`, `spanish` (contando recopilatorios),
      `availableToBuy` y `searchText`; verificar con tests unitarios
- [x] 2.4 Añadir los tests de datos (esquema, archivo igual al slug y en
      la carpeta de su mundo, slugs únicos, series definidas y del mismo
      mundo, números sin repetir, ISBN válidos y únicos, descripción de
      dos párrafos, portadas existentes, URLs sin afiliado, relaciones y
      novelas de recopilatorios existentes, coherencia con el
      inventario); verificar que `just test` pasa
- [x] 2.5 Crear el script `scripts/download-novel-covers.mjs` y la receta
      `just novel-covers`; verificar descargando y convirtiendo las
      portadas de una novela piloto (WebP y miniatura)
- [x] 2.6 Crear tres fichas piloto de _Dragonlance Chronicles_ con su
      serie y un recopilatorio, con todas sus ediciones en inglés y en
      castellano; verificar que validan y cubren varias ediciones por
      idioma (rústica, tapa dura, ebook, británica), una edición fuera de
      España si existe y un recopilatorio

## 3. Carga diferida

- [x] 3.1 Crear el plugin de Vite con `virtual:novels-index` (campos del
      listado y series sin recopilatorios); verificar con un test del
      contenido del índice y que no incluye descripciones
- [x] 3.2 Cargar los datos de cada ficha y las series con
      `import.meta.glob` no _eager_, la caché síncrona con sus hooks y la
      precarga en `main.tsx` antes de hidratar; verificar tras `just build`
      que ningún dato de novelas va en el bundle principal y que en
      `just preview` el listado y la ficha prerenderizados hidratan sin
      avisos de discrepancia en consola

## 4. Listado

- [x] 4.1 Crear `src/store/novelStore.ts` y las utilidades de filtrado y
      orden (mundo, serie según mundo, castellano, a la venta, búsqueda
      sin tildes por títulos y autor, orden de lectura); verificar con
      tests unitarios
- [x] 4.2 Crear `NovelCard`, el panel de filtros y `NovelsPage` en
      `/novelas` con carga por tandas y filtros en la dirección aplicados
      tras montar; verificar con tests de página (orden por defecto,
      filtros combinados, serie según mundo, búsqueda por título en
      castellano y por autor, orden de lectura, «Ver más», dirección con
      filtros y mensaje sin resultados)

## 5. Ficha

- [x] 5.1 Crear `NovelDetail` y `NovelDetailPage` en `/novela/:slug`
      (portada con visor, datos, ediciones por idioma con portadas y
      botones de compra con Umami, recopilatorios, avisos sin traducción
      y sin venta, serie con anterior y siguiente, relacionados, página
      de no encontrado); verificar con tests de componente y de página
- [x] 5.2 Añadir las URLs al sitemap y las portadas a las vistas previas
      de `prerender.mjs`; verificar tras `just build` que existen
      `dist/novelas.html` (solo con la primera tanda) y las fichas piloto
      con su contenido, título y vista previa de 1200×630

## 6. Navegación y textos

- [x] 6.1 Añadir «Novelas» a la cabecera (escritorio y móvil) y un bloque
      con las novelas recientes en la portada; verificar con tests de
      `Header` y `HomePage`, y que el buscador de la cabecera sigue
      mostrando solo libros
- [x] 6.2 Añadir la mención de portadas y títulos a la página legal;
      verificar con un test
- [x] 6.3 Comprobar en `just dev` el listado y una ficha en escritorio y
      en móvil, y que los botones de compra llevan el afiliado

## 7. Herramientas y documentación

- [x] 7.1 Crear la skill `add-novel` con las reglas de datos, el orden de
      fuentes, la búsqueda de todas las ediciones en inglés (ISFDB, Open
      Library) y en castellano, qué cuenta como edición, las portadas y los
      pasos; verificar dando de alta con ella la primera ficha del lote 8.1
- [x] 7.2 Documentar la sección en `CLAUDE.md` (datos, rutas, carga
      diferida, `just novel-covers`) y el README; verificar con
      `just check`

## 8. Carga de novelas

Cada lote es una serie completa o un grupo de series del mismo mundo
(40–60 fichas por PR), y se verifica con `just check` y con que el
inventario no tiene pendientes en esas series.

- [x] 8.1 Dragonlance: _Chronicles_, _Legends_ y sus continuaciones
      directas de Weis y Hickman
- [x] 8.2 Dragonlance: resto de series y novelas sueltas; verificar que el
      inventario no tiene pendientes de Dragonlance
- [x] 8.3 Reinos Olvidados: todas las novelas de Drizzt y de los
      Compañeros del Salón
- [x] 8.4 Reinos Olvidados: resto de series, en lotes; verificar que el
      inventario no tiene pendientes de Reinos Olvidados
- [x] 8.5 Eberron
- [x] 8.6 Ravenloft y Greyhawk
- [x] 8.7 Resto de mundos (Mystara, Dark Sun, Spelljammer, Planescape,
      Birthright, Nerath y genéricas); verificar con `just check` y que el
      inventario no tiene ningún pendiente

## Workflow follow-up

- Publicar la sección cuando estén terminados los grupos 1–7 y el lote
  8.1; el resto de lotes llega en PR sucesivas.
- Archivar el cambio con `/opsx:archive` cuando el inventario no tenga
  pendientes.
