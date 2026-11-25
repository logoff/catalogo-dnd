# Tasks

## 1. Texto de búsqueda en los índices

- [ ] 1.1 Añadir los ISBN-13 de las ediciones (y recopilatorios o tomos) al
      `searchText` de novelas, cómics y libros de rol, y verificarlo con un
      test por sección que encuentre una ficha por su ISBN en
      `novelFilters`, `comicFilters` y `rpgFilters`

## 2. Búsqueda común

- [ ] 2.1 Crear `src/utils/siteSearch.ts` con `SearchEntry`, un adaptador por
      sección (libros 5E/2024, ediciones anteriores, videojuegos,
      merchandising, novelas, cómics, otros juegos de rol con sistemas y
      libros, licencias) y `searchSite`, y verificarlo con tests de
      `siteSearch.test.ts` que cubran cada escenario de la spec `site-search`
      sobre campos, secciones, orden y agrupación (tildes, autor, ISBN,
      descripción excluida, edición anterior en su grupo, prefijo primero,
      grupos vacíos fuera)

## 3. Página de resultados

- [ ] 3.1 Añadir la opción `noindex` a `MetaTags` y verificarla con un test
      que compruebe la etiqueta `robots`
- [ ] 3.2 Crear `SearchPage` en `/buscar` (ruta en `AppRoutes`): campo
      propio, carga en paralelo de los índices de novelas, cómics y rol,
      grupos con recuento, ocho resultados y botón «Ver los N restantes»,
      estado sin texto y estado sin resultados con enlaces a las secciones;
      `q` leído tras hidratar. Verificarlo con `SearchPage.test.tsx`
      (resultado de merchandising para «fiends», grupo largo, sin
      resultados, cambio de `q` al escribir)
- [ ] 3.3 Prerenderizar `/buscar` como ruta extra fuera del sitemap y
      verificar con `just build` que existe `dist/buscar.html` con `noindex`
      y que `dist/sitemap.xml` no contiene `/buscar`

## 4. Buscadores

- [ ] 4.1 Cambiar `SearchBar` para que navegue a `/buscar?q=` (espera de
      300 ms e Intro, `replace` dentro de `/buscar`) con la etiqueta «Buscar
      en el catálogo», y el acceso de tableta de `Header` a `/buscar`;
      verificarlo con un test de `SearchBar` y actualizar los tests de
      `Header`/`HomePage` afectados
- [ ] 4.2 Añadir un `SearchField` al panel de filtros de `/catalogo` enlazado
      a `searchQuery`, y verificar con un test que `/catalogo?q=xanathar`
      filtra y rellena el campo

## 5. Documentación y comprobación final

- [ ] 5.1 Documentar el buscador global y la ruta `/buscar` en `CLAUDE.md`
      (Rutas y arquitectura) y verificar que `just format-check` pasa
- [ ] 5.2 Pasar `just check` y `just build`, y comprobar en `just dev` que
      buscar «fiends» desde la cabecera de `/videojuegos` lleva a
      _Fiends & Foes_ y que la página funciona a 360 px de ancho

## Workflow follow-up

- Archivar el cambio cuando esté fusionado y desplegado.
