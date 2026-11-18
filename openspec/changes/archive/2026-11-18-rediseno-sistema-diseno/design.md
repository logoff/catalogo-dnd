# Design

## Context

- Los estilos viven en `src/styles/globals.css`: un `@theme` con colores de
  marca (`dnd-red`, `dnd-gold`, `dnd-stone`), colores por idioma y por tipo
  de producto, Cinzel y Lato, y utilidades `@utility` (`btn-primary`,
  `btn-secondary`, `card-dnd`, `input-dnd`, `badge-*`). El resto son clases
  de Tailwind repartidas por los componentes (`text-gray-400` 94 veces,
  `dnd-gold` 157).
- Solo existe un tema (oscuro), fijado en `body`.
- `framer-motion` se usa en `Layout.tsx` (transición entre páginas), en las
  tarjetas de los cuatro listados y en los paneles de filtros (plegado).
  `AnimatedList.tsx` y `PageTransition.tsx` no los importa nadie.
- Cada página se prerenderiza con `scripts/prerender.mjs` a partir de
  `dist/index.html` y `main.tsx` la hidrata; el primer render no puede leer
  `window` ni `localStorage`.
- El logo es `public/images/logo.svg` (D20 con aristas doradas `#c9a227` y
  caras `#1a1a1a`/`#3d3d3d`), usado como `<img>` en la cabecera y la
  portada y como favicon.
- Referencia visual: dirección C del lienzo
  <https://claude.ai/artifact/BHoKPr518fdT2vFGip96Yv>, con el rojo oscuro
  ya corregido.

## Goals / Non-Goals

**Goals:**

- Un único sitio donde se definen los colores de los dos temas; cambiar la
  paleta no exige tocar componentes.
- Componentes base pequeños y sin dependencias nuevas de interfaz.
- Migración por fases en la que cada fase deja el sitio coherente y
  revisable.

**Non-Goals:**

- Librería de componentes externa (shadcn, Radix, Headless UI).
- Storybook o una página pública del sistema de diseño.
- Cambiar los datos, las rutas, el SEO o el prerenderizado.

## Decisions

### Tokens: variables CSS por tema expuestas a Tailwind con `@theme inline`

Los colores se definen como variables en `:root` (claro) y
`[data-theme='dark']` (oscuro), y `@theme inline` los expone como
utilidades semánticas: `bg-bg`, `bg-surface`, `bg-well`, `text-fg`,
`text-muted`, `border-line`, `text-accent`, `bg-accent-solid`,
`text-on-accent`, `bg-accent-soft`, `ring-focus`. Los componentes nunca
usan `dark:`; el cambio de tema solo cambia las variables.

| Token                  | Claro     | Oscuro    |
| ---------------------- | --------- | --------- |
| `bg`                   | `#FAFAFA` | `#0A0A0A` |
| `surface`              | `#FFFFFF` | `#141414` |
| `well`                 | `#F0F0F0` | `#1C1C1C` |
| `fg`                   | `#0A0A0A` | `#EDEDED` |
| `muted`                | `#666666` | `#A1A1A1` |
| `line`                 | `#E4E4E4` | `#262626` |
| `accent` (texto)       | `#D21F2B` | `#D9726D` |
| `accent-solid` (botón) | `#D21F2B` | `#B23C37` |
| `on-accent`            | `#FFFFFF` | `#FFFFFF` |
| `accent-soft`          | `#FDECEC` | `#2A1716` |
| `focus`                | `#D21F2B` | `#D9726D` |

Contrastes comprobados: `accent` oscuro 6,2:1 sobre `bg` y 5,8:1 sobre
`surface`; blanco sobre `accent-solid` 5,3:1 (claro) y 5,8:1 (oscuro);
`muted` 5,5:1 (claro, sobre `bg`; 5,0:1 sobre `well`) y 7,7:1 (oscuro);
`accent` claro 5,1:1 sobre `bg` y 4,6:1 sobre `accent-soft`, y oscuro 5,3:1
sobre `accent-soft`. Un test de contraste
recalcula estas parejas para que nadie rompa AA al tocar la tabla.

_Alternativa descartada:_ la variante `dark:` de Tailwind en cada clase.
Duplica cada color en cada componente y es lo que hace que un tema se
quede a medias.

### Tema: atributo `data-theme` en `<html>` puesto por un script en línea

`index.html` lleva en el `<head>` un script en línea mínimo, antes de los
estilos, que lee `localStorage.theme` (dentro de `try`) y si no hay valor
usa `matchMedia('(prefers-color-scheme: dark)')`, y fija `data-theme` y
`style.colorScheme` en `<html>`. Como el prerenderizado parte de
`index.html`, todas las páginas lo heredan. React no pinta nada que dependa
del tema en el primer render: el botón muestra los dos iconos y el CSS
oculta el que no toca según `data-theme`; su `aria-label` se actualiza en
un `useEffect`. Un hook `useTheme` escucha `matchMedia` mientras no haya
elección guardada y actualiza `<meta name="theme-color">`.

`_headers` no define CSP, así que el script en línea no necesita hash.
Si algún día se añade CSP, habrá que incluir su hash.

_Alternativas descartadas:_ guardar el tema en Zustand con `persist` (se
rehidrata tras pintar y produce parpadeo) y una cookie (no hay servidor:
las páginas son estáticas).

### Tipografía: Geist y Geist Mono variables

`@fontsource-variable/geist` y `@fontsource-variable/geist-mono`, solo
latín, importadas en `globals.css` como ahora las de Cinzel y Lato. `--font-sans`
pasa a Geist y `--font-mono` a Geist Mono; `font-display` desaparece. Las
cifras de tablas usan `font-mono tabular-nums`. Escala: 13/14/15 px para
texto de interfaz, 16 px para prosa de guías, 20/24/36 px para títulos,
peso 600 y `tracking-tight` en los títulos grandes.

### Componentes base en `src/components/ui/`

`Button` (`primary` | `secondary` | `ghost`, también como enlace), `Card`,
`Badge` (`neutral` | `accent`), `SearchField`, `SegmentedControl`
(radiogroup accesible), `SectionNav` (navegación por secciones de una
ficha) y `EditionsTable`. Son componentes de React con clases de Tailwind
sobre los tokens y `clsx`, que ya está instalado; sin `@utility` nuevas. Las
utilidades `btn-*`, `card-dnd`, `input-dnd` y `badge-*` se borran cuando no
quede ningún uso.

### Ficha: navegación por secciones, no pestañas

El boceto muestra pestañas «Ediciones / Reseñas / Detalles». Se implementan
como una barra de enlaces a anclas de la misma página, fija bajo la
cabecera al desplazarse, y todo el contenido sigue visible en el HTML. Así
el contenido prerenderizado sigue siendo indexable y los specs de las
fichas, que exigen mostrar esas secciones, no cambian.

_Alternativa descartada:_ pestañas que ocultan contenido. Esconden
reseñas y ediciones a quien no pulsa y obligan a decidir qué pestaña sale
en el HTML prerenderizado.

### Fuera `framer-motion`

Se quita la dependencia. La transición entre páginas desaparece; las
tarjetas pierden la animación de entrada; el plegado de los filtros pasa a
mostrar u ocultar sin animación (o `<details>` donde encaje). Esto reduce el
bundle y elimina la complejidad de `AnimatePresence` en `Layout.tsx`.
Las transiciones de color quedan en CSS (`transition-colors duration-150`,
anuladas con `motion-reduce:transition-none`).

### Logo: componente SVG en línea

El D20 pasa a un componente `Logo` con la misma geometría que
`logo.svg`, aristas en `stroke="var(--accent)"`, cara exterior en `well` y
triángulo central en `line`, para que se adapte al tema. `logo.svg`
(favicon) se recolorea con valores fijos: aristas `#D21F2B`, caras
`#1C1C1C` y `#3A3A3A`, legible sobre pestañas claras y oscuras. `logo-192.png`
se regenera desde el nuevo SVG con `sharp`.

### Fases en una sola rama

Rama `rediseno` con un commit (o varios) por fase y revisión en la vista
previa que Cloudflare Pages crea para cada rama. Se fusiona con un único PR
al final. Hacer un PR por fase dejaría la web en producción con la mitad de
las páginas en un estilo y la mitad en otro.

1. Fundamentos: tokens, tema, fuentes, logo, cabecera, pie, componentes
   base, fuera `framer-motion`.
2. Libros: catálogo, páginas de edición, ficha de producto, filtros.
3. Videojuegos, merchandising y novelas: listados y fichas.
4. Portada, guías, aviso legal y 404.
5. Limpieza: tokens y utilidades antiguas, Cinzel, Lato, revisión de
   contraste y de móvil.

Durante la fase 1 los tokens antiguos (`dnd-*`) se mantienen como alias
temporales de los nuevos para que las páginas aún no migradas no se rompan.

## Risks / Trade-offs

- [Parpadeo si el script de tema no va el primero] → va en `<head>` antes
  de cualquier `<link>`; se comprueba en el HTML generado en `dist/`.
- [Desajuste de hidratación por el botón de tema] → nada del render depende
  del tema; se comprueba en la consola con los dos temas.
- [Tests que buscan clases o dependen de `framer-motion`] → los tests
  buscan por rol y texto; se ajustan los que fallen al quitar
  `framer-motion` (mocks incluidos).
- [Páginas que se quedan a medias entre fases] → alias temporales de los
  tokens antiguos y PR único al final.
- [Que el rediseño acabe pareciendo otra plantilla genérica] → densidad de
  información, portadas reales y el rojo solo donde tiene significado; se
  revisa cada fase en la vista previa antes de seguir.

## Migration Plan

1. Rama `rediseno` desde `main`.
2. Fases 1 a 5, con `just check` y `just build` en verde al cerrar cada una
   y revisión en la vista previa de Cloudflare Pages.
3. PR único a `main`; tras fusionar, Cloudflare despliega.
4. Rollback: revertir el commit de fusión. No hay datos ni rutas afectados.

## Open Questions

- Ilustración o imagen en la portada: de momento no lleva ninguna; se puede
  valorar tras ver la fase 4.
