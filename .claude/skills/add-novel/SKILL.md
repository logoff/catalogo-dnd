---
name: add-novel
description: Añadir novelas oficiales de D&D al catálogo, con todas sus ediciones en inglés y en castellano, portadas y enlaces de compra. Usa esta skill cuando el usuario quiera dar de alta una novela, completar una del inventario o cargar un lote (por ejemplo, una serie o un mundo).
argument-hint: "[título, serie o número del inventario]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch
---

# Añadir novelas

La lista maestra está en `data/novels/inventory.md`: toda novela que se
añada debe estar ahí. Si no está, consulta al usuario si entra según el
alcance de `novel-records` (spec en `openspec/specs/` o, mientras no se
haya archivado el cambio, en `openspec/changes/add-novelas/specs/`).

## Argumentos

`$ARGUMENTS`

## Reglas de los datos

- **Alcance.** Novelas, juveniles, infantiles, novelas solo en ebook o
  solo en la web, novelas cortas y relatos vendidos como libro o ebook
  sueltos, y las _Bertrem's Guide_. Fuera: lo que solo salió dentro de
  antologías o revistas, antologías, librojuegos, poemas, cómics.
- **Nada inventado.** Cada dato sale de una fuente que se pueda citar; si
  no se encuentra, el campo se omite. Una edición en castellano solo
  consta si una fuente la confirma.
- **Todas las ediciones, en los dos idiomas y con el mismo detalle.**
  Cuenta como edición cada publicación con ISBN propio (rústica, tapa
  dura, bolsillo, ebook, reedición con portada nueva, edición británica,
  club de lectores); sin ISBN, si cambia la editorial, el formato o la
  portada. No cuentan las reimpresiones con el mismo ISBN, los
  audiolibros, los cómics ni las reencuadernaciones de biblioteca
  (Turtleback, Tandem…).
- **Recopilatorios** (varias novelas en un volumen o en estuche): una sola
  vez, en `collections` de su serie en `data/novels/series.json`, nunca
  como edición de cada novela.
- **ISBN siempre en ISBN-13** (`isbn10To13` de `src/utils/isbn.ts`
  convierte los antiguos; los tests comprueban el dígito de control y
  que no se repitan).
- **Formatos:** `hardcover` (tapa dura), `paperback` (rústica normal),
  `mass_market` (bolsillo: _pb_ en ISFDB, rústica de unos 11×18 cm en
  castellano), `ebook`, `web`.
- **URLs de compra limpias**, sin afiliado, a `amazon` (u otra tienda del
  esquema), con la forma `https://www.amazon.es/dp/<código>/`: ISBN-10 en
  libros, ASIN (`B0…`) en Kindle. Solo ediciones con oferta en Amazon.es.
- **Descripción propia** en castellano, dos párrafos separados por `\n\n`:
  de qué trata (sin destripar el final) y dónde encaja en su serie y su
  mundo. Sin copiar textos de la editorial ni de tiendas.

## Fuentes

| Qué | Dónde |
| --- | --- |
| Que la novela es oficial (`source`) | Editorial (Penguin Random House, HarperCollins…) o Wizards, también en el Internet Archive; si no queda nada, ISFDB |
| Ediciones en inglés | ISFDB (página de título, tabla de publicaciones), cruzado con Open Library |
| Ediciones en castellano | Tercera Fundación (ficha de la obra: lista todas las ediciones españolas), la editorial (Planeta para Minotauro y Timun Mas) y la base de datos del ISBN del Ministerio de Cultura |
| Portadas | ISFDB (imagen de cada publicación), Tercera Fundación, Amazon (`m.media-amazon.com/images/P/<ISBN-10>.jpg`) u Open Library |
| Enlaces de compra | Amazon.es |

- **ISFDB y Amazon** necesitan navegador (Cloudflare y captchas): usa el
  Chrome del usuario. En ISFDB, la página de título
  (`/cgi-bin/title.cgi?<id>`) tiene la tabla de publicaciones; desde esa
  página puedes leerla con JavaScript haciendo `fetch` de las páginas de
  título y de publicación (`/cgi-bin/pl.cgi?<id>`, donde está la portada).
- **En Amazon no leas por lotes con JavaScript** (el modo automático lo
  bloquea): abre cada ficha y mira si hay oferta.
- **Kindle, siempre**, en inglés y en castellano: desde cualquier ficha de
  la novela, abre el formato «Versión Kindle» (o la lista «En esta serie»
  de una ficha Kindle) y lee en «Detalles del producto» el ASIN, la
  editorial, la fecha y el ISBN-13. El enlace va en la edición ebook con
  ese ISBN; si ninguna lo tiene, añade la edición ebook con esos datos y
  la ficha Kindle como `source`. Las ediciones ebook antiguas que ya no
  tienen ficha Kindle propia (las sustituyó una reedición) se quedan sin
  enlace. La web muestra estos botones como «Comprar en Amazon Kindle».
- **Tercera Fundación** responde a `curl`; busca la obra con
  `https://tercerafundacion.net/biblioteca/buscar/?q=<título>`, abre su
  ficha (`/biblioteca/ver/ficha/<id>`) y lista las ediciones con
  `tf_editions.py` (en esta carpeta). Las ediciones que comparten ISBN
  son una sola.
- Como `source` de cada edición pon la página que la confirma (ISFDB,
  Tercera Fundación, editorial).

## Carga por lotes

Los scripts de `scripts/` (en esta carpeta) automatizan un lote entero.
Guarda los datos del lote en `.claude/novel-work/<lote>/` (no se sube al
repositorio y, a diferencia del scratchpad, no se borra):

1. `make_pend.py data/novels/inventory.md "<Mundo>" <dir>` → `pend.json`
   con las pendientes del mundo.
2. `tf_lookup.py <dir>` (en segundo plano, tarda) → `tf.json`: busca cada
   novela en Tercera Fundación por título y, para las que falten, por las
   obras de cada autor; descarta fichas de otro autor. Revisa a mano las
   fichas que mezclan dos libros (pasó con Baldur's Gate II).
3. ISFDB en el navegador → `isfdb.txt`
   (`título@@id@@núm@@fecha~editorial~isbn~formato~tipo~pl~título_recopilatorio;…`).
4. Amazon en el navegador, página a página → `az_en.txt`, `az_es.txt` y
   `az_extra.txt`; `make_amazon.py <dir>` monta `amazon.json` y avisa de
   Kindle repetidos (suele ser un falso positivo de la página).
5. `series_map.py`, `desc.json` y, si hace falta, `extra.json` (slug
   propio si choca con otro mundo, `skip`…).
6. `build_lot.py <raíz> <setting> <dir>` escribe fichas, series y
   recopilatorios; `dl_covers.py <dir>` (desde la raíz) baja las portadas.

## Trucos aprendidos en los lotes

- **Extensiones que rompen la lectura de Amazon**: Rivet, Ghostery y
  QuillBot hacen fallar `javascript_tool` con «Cannot access a
  chrome-extension:// URL of different extension». Si vuelve a pasar,
  busca atributos de extensiones en `<html>`/`<body>` y pide al usuario
  que las desactive.
- **Errores de la lista de Wikipedia**: hay recopilatorios metidos como
  novelas y novelas metidas como recopilatorios; compruébalo en ISFDB
  (tipo OMNIBUS) antes de cargar.

- **ISFDB va lento** (unos segundos por página): para un lote, lanza desde
  la consola de una página de ISFDB un bucle asíncrono que guarde los
  resultados en `window` y recógelos después en trozos de menos de 1000
  caracteres; una sola llamada que espere a todo supera el tiempo límite.
  Usa `title.cgi?<id>+1` para la tabla sin traducciones.
- **Amazon en otra pestaña** mientras ISFDB trabaja. Leer el DOM de la
  página abierta (formatos, ASIN del Kindle, «Detalles del producto») sí
  está permitido; lo que no es pedir muchas páginas con `fetch`. Devuelve
  solo lo necesario: si la respuesta lleva URLs con parámetros, el filtro
  de privacidad la bloquea.
- **Ediciones de club sin ISBN** (SFBC) que ISFDB atribuye a la misma
  editorial se omiten: parecerían un duplicado de la edición normal.
- **Fechas de Tercera Fundación** como «31 dic» suelen ser de relleno: usa
  solo el año, o la fecha de la ficha Kindle para el ebook.
- **Novelas partidas en dos tomos en castellano**: cada tomo es una
  edición con su título y su ISBN, y la novela lleva `title_es` con los
  dos títulos («Uno / Dos»).
- **Formato desconocido** («Libro - Papel»): se omite `format`.
- **Kindle en inglés de Destinies y posteriores**: en Amazon.es suelen ser
  las ediciones británicas (Penguin, Cornerstone), no las de Random House.

## Pasos

1. **Buscar la novela en el inventario** (mundo, serie, fecha, ISBN de la
   primera edición) y, si es una serie, cargarla entera.
2. **Ediciones en inglés** desde ISFDB, una por ISBN, con su país.
3. **Ediciones en castellano** desde Tercera Fundación y la editorial, con
   `spain: true` o `false`.
4. **Recopilatorios** de la serie, en `series.json` (crea la serie si no
   existe: `id`, `title`, `title_es` si se tradujo, `setting`).
5. **Enlaces de compra** en Amazon.es para las ediciones a la venta.
6. **Escribir el JSON** en `data/novels/<mundo>/<slug>.json` (esquema
   `data/schemas/novel.jsonschema`; slug del título original). Si se
   relaciona con un libro, videojuego o artículo del catálogo, añade
   `related_products`, `related_videogames` o `related_merchandise`.
7. **Portadas** con `just novel-covers <slug> <isbn>=<url>...` (o
   `<idioma>-<año>-<formato>=<url>` sin ISBN; `--openlibrary` para las
   que falten; `--series <id>` para los recopilatorios). Convierte a WebP,
   crea la miniatura y anota `cover`. Revisa que ninguna sea un
   marcador vacío.
8. **Descripción** de dos párrafos; pide al usuario que la revise en el
   primer lote.
9. **Marcar la ficha en el inventario**: slug en «Ficha» y el estado del
   castellano (`sí (España): _título_`, `sí (fuera de España)` o
   `no consta`).
10. **Verificar** con `just check` y, si hace falta, mira la ficha en
    `just dev` (`/novela/<slug>`).

## Ejemplos

- `data/novels/dragonlance/dragons-of-autumn-twilight.json`: novela con
  siete ediciones en inglés y diez en castellano.
- `data/novels/series.json` (`dragonlance-chronicles`): serie con
  recopilatorios en los dos idiomas.
