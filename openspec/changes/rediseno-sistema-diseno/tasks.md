# Tasks

## 1. Fundamentos: tokens, tema y fuentes

- [x] 1.1 Crear la rama `rediseno` desde `main`; verificar con
      `git branch --show-current`
- [x] 1.2 Sustituir `@fontsource/cinzel` y `@fontsource/lato` por
      `@fontsource-variable/geist` y `@fontsource-variable/geist-mono`
      (solo latín) y definir `--font-sans` y `--font-mono`; verificar con
      `just build` y que `dist/` no pide fuentes a otros dominios
- [x] 1.3 Definir en `globals.css` las variables de color de los dos temas
      (`:root` y `[data-theme='dark']`) y exponerlas con `@theme inline`
      según la tabla de `design.md`; dejar `dnd-*` como alias temporales;
      poner `color-scheme`, fondo y texto base en `body`; verificar con
      `just dev` cambiando `data-theme` a mano en el inspector
- [x] 1.4 Añadir un test de contraste que calcule las parejas de tokens de
      `design.md` en los dos temas y exija AA; verificar con `just test`
- [ ] 1.5 Añadir a `index.html` el script en línea de tema (antes de
      cualquier estilo) y `<meta name="theme-color">`; verificar tras
      `just build` que `dist/producto/2014/phb.html` lo incluye en el
      `<head>` y que con el tema oscuro guardado no hay parpadeo
- [x] 1.6 Crear el hook `useTheme` y el botón de tema (los dos iconos, el
      CSS oculta el que no toca, `aria-label` tras montar, escucha de
      `matchMedia` sin elección guardada, `try` en `localStorage`), con
      tests de cambio, persistencia y almacenamiento bloqueado; verificar
      con `just test` y sin avisos de hidratación en la consola

## 2. Fundamentos: logo, componentes base y layout

- [x] 2.1 Crear el componente `Logo` con la geometría del D20 y los
      colores de los tokens; recolorear `public/images/logo.svg` y
      regenerar `logo-192.png`; verificar viendo la cabecera en los dos
      temas y el favicon en una pestaña clara y otra oscura
- [x] 2.2 Crear en `src/components/ui/` `Button`, `Card`, `Badge`,
      `SearchField`, `SegmentedControl`, `SectionNav` y `EditionsTable`,
      con foco visible, objetivos de 44 px en móvil y transiciones de color
      de 150 ms anuladas con movimiento reducido; tests por rol de
      `SegmentedControl` (radiogroup, flechas) y `SectionNav`; verificar
      con `just test`
- [x] 2.3 Rehacer `Header.tsx` (logo, navegación, buscador, botón de tema,
      menú en móvil) y `Footer.tsx` con los componentes base; verificar
      con `just test` (los tests de cabecera siguen pasando) y a 360 px
- [x] 2.4 Quitar la transición de página de `Layout.tsx` y borrar
      `AnimatedList.tsx` y `PageTransition.tsx`; verificar con `just check`

## 3. Libros

- [ ] 3.1 Migrar `ProductCard`, `ProductListItem`, `ProductGrid` y
      `ViewToggle` al nuevo estilo (portada sobre `well`, insignia de
      edición, marca de castellano en acento) sin `framer-motion`;
      verificar con `just test` y en `/2024`
- [ ] 3.2 Migrar `FilterPanel`, `FilterControls`, `SearchBar` y
      `SortSelect`: edición con `SegmentedControl`, filtro «En castellano»
      destacado, plegado sin animación; verificar con `FilterPanel.test.tsx`
      y en `/catalogo`
- [ ] 3.3 Migrar `CatalogPage` y `EditionPage`; verificar en `/catalogo`,
      `/2014` y `/2024/<categoría>` en los dos temas y a 360 px
- [ ] 3.4 Migrar `ProductDetail` y `ProductDetailPage`: `SectionNav`
      (Ediciones, Reseñas, Detalles), `EditionsTable` con cifras en mono,
      botones de compra con `Button`; adaptar `MediaReviews`,
      `PurchaseButton`, `Breadcrumbs`, `ImageLightbox` y `Badge`
      comunes; verificar con `ProductDetail.test.tsx` y en
      `/producto/2024/phb`

## 4. Videojuegos, merchandising y novelas

- [ ] 4.1 Migrar listado y filtros de videojuegos (`VideogameCard`,
      `VideogameFilterPanel`, `VideogamesPage`) sin `framer-motion`;
      verificar con `just test` y en `/videojuegos`
- [ ] 4.2 Migrar la ficha de videojuego (`VideogameDetail`,
      `ReleaseTable`, `ReviewScore`, `PurchaseByPlatform`,
      `ScreenshotGallery`, `YouTubeVideo`, `SpanishBadge`,
      `PlatformIcon`); verificar con `videogameComponents.test.tsx` y en
      una ficha con vídeos y capturas
- [ ] 4.3 Migrar merchandising (`MerchandiseCard`,
      `MerchandiseFilterPanel`, `MerchandiseDetail`,
      `MerchandiseSpanishBadge` y sus páginas); verificar con los tests de
      merchandising y en `/merchandising`
- [ ] 4.4 Migrar novelas (`NovelCard`, `NovelFilterPanel`, `NovelDetail`,
      `NovelSpanishBadge`, `NovelBestseller` y sus páginas); verificar con
      los tests de novelas y en `/novelas?mundo=forgotten-realms` y una
      ficha con reseñas

## 5. Portada, guías y páginas sueltas

- [ ] 5.1 Rehacer `HomePage` según `home-page`: título y frase a la
      izquierda, buscador, tarjetas de sección con recuento, «Últimos en
      castellano» por fecha en castellano (sin fechas futuras), últimos
      videojuegos, merchandising y novelas, y guías; actualizar
      `HomePage.test.tsx` con un test de orden de «Últimos en castellano»;
      verificar con `just test` y a 360 px
- [ ] 5.2 Migrar `GuidesPage`, `GuideLayout`, `Prose` y todas las guías
      (cronologías, órdenes de lectura, tablas); verificar con
      `guides.test.tsx` y recorriendo `/guias`
- [ ] 5.3 Migrar `LegalPage`, `NotFoundPage` y `Skeleton`; verificar en
      `/aviso-legal` y en una URL inexistente

## 6. Limpieza y verificación final

- [ ] 6.1 Quitar `framer-motion` de `package.json`, los alias `dnd-*`, los
      colores por idioma y tipo, las `@utility` antiguas, el bloque de
      compatibilidad de bordes de Tailwind 3 y el estilo de scrollbar
      dorado; verificar con
      `grep -rE "dnd-|font-display|gray-[0-9]|framer-motion" src` sin
      resultados y `just check`
- [ ] 6.2 Recorrer con el teclado la portada, un listado y una ficha de
      cada sección en los dos temas; verificar que el foco se ve siempre
      y que no hay avisos de hidratación en la consola
- [ ] 6.3 Revisar a 360 px una página de cada tipo sin desplazamiento
      horizontal; verificar con las herramientas de móvil del navegador
- [ ] 6.4 Actualizar `CLAUDE.md` (stack sin `framer-motion`, sistema de
      diseño en `src/components/ui/` y tokens en `globals.css`) y el
      README si lo menciona; verificar con `just format-check`
- [ ] 6.5 `just check` y `just build` en verde y revisión de la vista
      previa de Cloudflare Pages de la rama; abrir el PR a `main`

## Workflow follow-up

- Tras fusionar el PR, archivar el cambio con `/opsx:archive`.
