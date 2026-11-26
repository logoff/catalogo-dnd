# Tasks

## 1. Inventario

- [x] 1.1 Crear `data/screen/inventory.md` con dos listas, oficiales y no
      oficiales, cada entrada con tipo, año, título en España si se confirma,
      fuentes (Wikipedia, Wikidata, FilmAffinity) y, en las no oficiales, una
      frase de por qué cumple el criterio de `screen-records`; verificar que
      cada entrada tiene fuente
- [x] 1.2 Revisar el inventario con el usuario (casos dudosos de lo no oficial,
      obras anunciadas, títulos en España) y dejarlo aprobado

## 2. Modelo de datos

- [x] 2.1 Crear `data/schemas/screen.jsonschema` según el diseño (tipos
      cerrados de obra, medio, formato y tienda; `unofficial_reason`
      obligatorio solo en lo no oficial; `series` solo con temporadas;
      patrones de IMDb y FilmAffinity; máximo 3 tráileres); verificar con
      tests de fichas válidas e inválidas
- [x] 2.2 Crear `src/types/screen.ts` y `src/services/screenLoader.ts` con
      `ScreenWorkWithMeta` (año de estreno, estreno en España, cartel
      preferido, miniaturas, `hasSpanish`) y las relaciones inversas con
      novelas y merchandising; verificar con tests unitarios
- [x] 2.3 Añadir los tests de datos: esquema, nombre de archivo igual al slug,
      slugs únicos, relaciones que existen, tráileres sin repetir, URLs sin
      afiliado y coherencia con el inventario; verificar que `just test` pasa
- [x] 2.4 Crear las fichas piloto: _Honor Among Thieves_ (película oficial con
      estrenos, Blu-ray, dos carteles y relaciones), la serie animada de 1983 y
      un documental no oficial; verificar que validan

## 3. Vídeos y carteles

- [x] 3.1 Mover `YouTubeVideo.tsx` a `src/components/common/` con el tipo de
      vídeo común e idioma opcional; verificar que los tests de la ficha de
      videojuegos pasan sin cambios
- [x] 3.2 Crear `scripts/screen.mjs` con `allTrailers()` y hacer que
      `download-video-thumbnails.mjs` y `check-videos.mjs` recorran también los
      tráileres; verificar que `just video-thumbnails` descarga las miniaturas
      de las fichas piloto y `just check-videos` las revisa
- [x] 3.3 Crear el script y la receta `just screen-posters` (WebP y miniatura
      en `public/images/screen/<slug>/`, anotados en la ficha); verificar con
      los carteles de las fichas piloto y documentarlo en `CLAUDE.md`

## 4. Páginas

- [x] 4.1 Página `/cine-y-series` con los bloques oficial y no oficial,
      tarjetas, filtros por tipo y castellano y orden por fecha y título;
      verificar con tests de la página según `screen-listing`
- [x] 4.2 Ficha `/cine-y-series/:slug` con datos principales, insignia y motivo
      de no oficial, carteles, estrenos, ediciones con compra y aviso de
      afiliado, tráileres (castellano primero), IMDb y FilmAffinity, contenido
      relacionado y página de no encontrado; verificar con tests según
      `screen-detail-page` y `screen-trailers`
- [x] 4.3 Metadatos y datos estructurados `Movie`/`TVSeries` con `VideoObject`
      y sin `AggregateRating`, `og:image` y vista previa desde el cartel;
      verificar en el HTML prerenderizado de las fichas piloto
- [x] 4.4 Contenido relacionado en las fichas de novela y merchandising;
      verificar con tests de esas fichas según sus deltas

## 5. Integración en el sitio

- [x] 5.1 Enlace «Cine y series» en la cabecera y tarjeta con recuento en la
      portada; verificar con los tests de cabecera y `HomePage.test.tsx`
- [x] 5.2 Rutas en sitemap y prerenderizado, y la sección en el feed
      (`scripts/feed.mjs` con su test); verificar que `just build` genera las
      páginas y que `scripts/feed.test.mjs` pasa
- [x] 5.3 Incluir la sección en `just affiliate-coverage`; verificar que lista
      las ediciones físicas sin enlace de Amazon
- [x] 5.4 Actualizar `CLAUDE.md` y README con la sección, los datos y las
      recetas nuevas; verificar que `just format-check` pasa

## 6. Skill y fichas

- [x] 6.1 Crear la skill `add-screen` (investigación, criterio de no oficial,
      sinopsis propia, carteles, tráileres oficiales, inventario y tests);
      verificar dando de alta con ella una ficha del inventario
- [x] 6.2 Dar de alta todas las obras oficiales del inventario; verificar que
      `just test` pasa y que ninguna queda pendiente
- [x] 6.3 Dar de alta las obras no oficiales del inventario; verificar que
      `just test` pasa y anotar las que queden pendientes

## 7. Verificación final

- [x] 7.1 `just check` y `just build` en verde, y revisión en `just dev` del
      listado, una película, una serie y una obra no oficial en tema claro y
      oscuro y a ancho de móvil

## Workflow follow-up

- Abrir la PR con la descripción breve habitual.
- Archivar el cambio con `/opsx:archive` tras fusionarla.
