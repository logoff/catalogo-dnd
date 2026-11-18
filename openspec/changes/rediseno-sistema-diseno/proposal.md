# Proposal

## Why

El sitio tiene la estética «fantasía oscura» de plantilla: dorado en todos
los títulos y enlaces (157 usos en 43 archivos), Cinzel, tarjetas con borde
dorado translúcido, degradados sueltos, grises puestos a ojo y animaciones de
entrada. Huele a hecho por IA y no ayuda a lo que se viene a consultar: si un
libro está en castellano, cuándo salió y dónde comprarlo. No hay sistema de
diseño, solo unos colores de marca en `@theme`, así que cada componente
repite sus estilos. Se ha elegido la dirección C «Producto» del lienzo de
direcciones visuales: limpia, moderna, con el rojo de D&D como único acento.

## What Changes

- **Sistema de diseño** con tokens semánticos (fondo, superficie, hueco,
  texto, texto secundario, borde, acento de texto, acento de botón, texto
  sobre acento, acento suave, foco) definidos para tema claro y oscuro en
  `@theme` de Tailwind 4. El rojo de D&D es el único color de acento. En el
  tema oscuro es un rojo teja apagado, no chillón.
- **Tipografía**: Geist para todo y Geist Mono para cifras, fechas, códigos
  e ISBN, autoalojadas con `@fontsource`.
- **Tema claro y oscuro** con un botón en la cabecera. Por defecto sigue la
  preferencia del sistema; la elección se recuerda; sin parpadeo al cargar y
  sin romper el prerenderizado ni la hidratación.
- **Componentes base** reutilizables: botón, tarjeta, insignia, campo de
  búsqueda, control segmentado, navegación por secciones y tabla de
  ediciones, que sustituyen a `card-dnd`, `btn-*`, `input-dnd` y `badge-*`.
- **Se mantiene el logo del D20**, con la misma forma, recoloreado con los
  tokens para que funcione en los dos temas (también el favicon).
- **Migración de todo el sitio**: cabecera, pie, catálogo y ediciones,
  fichas de producto, videojuegos, merchandising, novelas, guías, aviso
  legal y 404.
- **Portada nueva**, sin hero centrado ni tira de estadísticas: buscador,
  accesos a las secciones y novedades.
- **BREAKING (visual)**: fuera el dorado, Cinzel, Lato, los colores por tipo
  de producto, los degradados decorativos y todas las animaciones de entrada
  y de cambio de página (`framer-motion`, `AnimatedList`, `PageTransition`).
- Contraste AA en los dos temas y foco visible en todo lo interactivo.
- Se hace por fases en una sola rama, revisables una a una en la vista
  previa de Cloudflare Pages.

Fuera de alcance: cambiar qué datos muestra cada página o ficha (los specs
de contenido no cambian), las imágenes `og:image` y de vista previa, y la
estructura de rutas.

## Capabilities

### New Capabilities

- `design-system`: tokens de color, tipografía, componentes base, contraste,
  logo y qué recursos visuales quedan prohibidos (dorado, degradados,
  animaciones de entrada).
- `color-theme`: tema claro y oscuro, cómo se elige, se recuerda y se aplica
  sin parpadeo y compatible con el prerenderizado.
- `home-page`: qué muestra la portada y en qué orden.

### Modified Capabilities

Ninguna. Las fichas y listados conservan el contenido que exigen sus specs;
solo cambia su presentación.

## Impact

- `src/styles/globals.css` (tokens, utilidades, base), `index.html` (script
  de tema y `theme-color`), `public/images/logo.svg`.
- Todos los componentes de `src/components/` y las páginas de `src/pages/`.
- Dependencias: se añaden `@fontsource-variable/geist` y
  `@fontsource-variable/geist-mono`; se quitan `@fontsource/cinzel`,
  `@fontsource/lato` y `framer-motion`.
- Tests que dependan de clases o de `framer-motion`; prerenderizado
  (`scripts/prerender.mjs`) sin cambios previstos más allá de verificarlo.
