# Tasks

## 1. Inventario

- [x] 1.1 Crear `data/videogames/inventory.md` con todos los juegos
      oficiales (título, año, plataformas, si se vende hoy y dónde, y
      fuente), cruzando Wikipedia, MobyGames, GOG y Steam; verificar que
      cada entrada tiene fuente
- [x] 1.2 Revisar el inventario con el usuario según los criterios de
      alcance del spec `videogame-records`, y dejarlo aprobado

## 2. Modelo de datos

- [x] 2.1 Crear `data/schemas/videogame.jsonschema` según D2; verificar
      con un JSON válido y otro inválido en un test
- [x] 2.2 Crear `src/types/videogame.ts` y `src/services/videogameLoader.ts`
      con los campos derivados; verificar con tests unitarios de
      `firstReleaseDate`, `decade`, `spanishSummary` (incluido
      «desconocido»), `bestScore` y `availableToBuy`
- [x] 2.3 Añadir los tests de datos de D8 (esquema, descripción de dos
      párrafos, imágenes existentes, URLs sin afiliado, slugs únicos,
      libros relacionados y coherencia con el inventario); verificar que
      `just test` pasa
- [x] 2.4 Crear tres fichas piloto completas de épocas distintas (_Pool
      of Radiance_, _Baldur's Gate_ con su Enhanced Edition y _Baldur's
      Gate 3_), con portadas en `public/images/videogames/`; verificar
      que validan y cubren ediciones, castellano y notas

## 3. Tiendas

- [x] 3.1 Verificar las condiciones de los programas de Humble Bundle,
      Fanatical, Green Man Gaming, Instant Gaming y Eneba, y de las redes
      Impact, Partnerize, Admitad y Awin para móvil; apuntar el resultado
      en la tabla de tiendas de `design.md`
- [x] 3.2 Ampliar `Store` y `STORES` en `src/utils/stores.ts` con `gog`
      (Adtraction) y `steam` (sin afiliado); añadir
      `VITE_AFFILIATE_GOG_PROGRAM` a `src/vite-env.d.ts`; verificar con
      tests en `stores.test.ts` (con y sin IDs)
- [x] 3.3 Extraer el botón de compra de `ProductDetail.tsx` a un
      componente común; verificar que los tests actuales de
      `ProductDetail` siguen pasando sin cambios en el marcado

## 4. Ficha de videojuego

- [x] 4.1 Crear `SpanishBadge`, `ReviewScore` y `ReleaseTable`; verificar
      con tests de componentes los casos «con voces», «textos», «solo en
      inglés» y «desconocido»
- [x] 4.2 Crear `PurchaseByPlatform` (orden estable según `STORES`,
      edición física, «No disponible a la venta»); verificar
      con tests de componentes los escenarios del spec
      `videogame-purchase-links`
- [x] 4.3 Crear `VideogameDetail` y `VideogameDetailPage` en
      `/videojuego/:slug` (datos principales, descripción, expansiones,
      libros relacionados, aviso de juego cerrado, 404 con slug
      inexistente); verificar con tests de página y viendo las fichas
      piloto en `just dev`
- [x] 4.4 Añadir las fichas a `generate-sitemap.mjs`, metadatos `<head>`,
      `og:image` y vistas previas de 1200×630; verificar con `just build`
      que existe `dist/videojuego/baldurs-gate-3.html` con contenido y
      metadatos

## 5. Listado

- [x] 5.1 Crear `videogameStore` con filtros, orden y búsqueda (sin
      `localStorage` en el primer render); verificar con tests
      unitarios de cada filtro, combinaciones, orden por nota (sin nota
      al final) y búsqueda sin tildes
- [ ] 5.2 Crear `VideogameCard`, el panel de filtros y `VideogamesPage`
      en `/videojuegos`; verificar con tests de página y en `just dev`
- [ ] 5.3 Añadir `/videojuegos` al sitemap y al prerenderizado;
      verificar con `just build` que existe `dist/videojuegos.html`
      con los juegos

## 6. Integración en el sitio

- [ ] 6.1 Enlazar la sección desde la cabecera y la portada, y ajustar
      los textos generales (portada, `<head>` por defecto) para incluir
      videojuegos; verificar en `just dev` y con los tests de las
      páginas afectadas
- [ ] 6.2 Ampliar la página legal (afiliados de tiendas de videojuegos,
      marcas de las editoras); verificar en `just dev`
- [ ] 6.3 Comprobar que el catálogo de libros no cambia; verificar que
      `/catalogo` solo lista libros, cajas y accesorios y que
      `just check` pasa

## 7. GOG

- [ ] 7.1 Solicitar el programa de GOG en Adtraction; verificar que
      aparece como solicitado en el panel
- [ ] 7.2 Rellenar los enlaces de GOG de todos los juegos inventariados
      que vende (con un script si hay product feed); verificar con los
      tests de datos y comprobando una muestra de enlaces

## 8. Fichas completas

- [ ] 8.1 Lote años 80 y Gold Box; verificar con `just check` y
      marcarlo en el inventario
- [ ] 8.2 Lote años 90 (PC, consolas, recreativas); verificar con
      `just check` y marcarlo en el inventario
- [ ] 8.3 Lote Infinity Engine, Neverwinter Nights y años 2000;
      verificar con `just check` y marcarlo en el inventario
- [ ] 8.4 Lote MMO, juegos online, móvil y navegador; verificar con
      `just check` y marcarlo en el inventario
- [ ] 8.5 Lote años 2010 y 2020; verificar con `just check` y que el
      inventario no tenga pendientes

## 9. Más tiendas

- [ ] 9.1 Añadir Amazon (digital y físico), Humble Bundle, Instant
      Gaming y Eneba a los juegos que corresponda; verificar con los
      tests de datos
- [ ] 9.2 Añadir las tiendas opcionales que hayan pasado la
      verificación 3.1; verificar que aparecen en una ficha en el orden
      de `STORES`

## 10. Mantenimiento

- [ ] 10.1 Crear la skill `add-videogame` a partir de los campos del
      esquema; verificar dando de alta un juego del inventario con ella
- [ ] 10.2 Ampliar la skill `novedades` y `scripts/novedades.mjs` a
      videojuegos anunciados o retirados; verificar con `just novedades`
- [ ] 10.3 Actualizar `CLAUDE.md` y el README con la sección de
      videojuegos; verificar que markdownlint pasa

## Workflow follow-up

- Archivar la change con `/opsx:archive` cuando todas las tareas estén
  hechas, para pasar los specs a `openspec/specs/`.
