# Design

## Context

- `scripts/releases.mjs` decide qué es una novedad y `scripts/feed.mjs` toma
  las 50 últimas ya publicadas para `dist/feed.xml`. Cada entrada tiene
  `path`, `key`, `title`, `date`, `summary`, sección e idioma.
- `deploy.yml` construye y despliega en Cloudflare Pages al fusionar en `main`
  y cada día a las 4:00 UTC (la fecha se fija en el build).
- `send-umami-report.mjs` ya envía a Telegram con `TELEGRAM_BOT_TOKEN`, sin
  escribir datos en los registros, que son públicos.
- El prerenderizado deja en cada ficha su `og:image` y la vista previa de
  1200×630 en `dist/images/previews/`.

## Goals / Non-Goals

**Goals:** publicar sin estado propio (sin base de datos ni commits desde
Actions), sin repetir y sin inundar; poder añadir una red nueva escribiendo
solo su publicador.

**Non-Goals:** programar publicaciones a horas concretas, imágenes propias
para redes, hilos o respuestas, y estadísticas de las redes (se mide en Umami
con UTM).

## Decisions

### El sitio publicado es el estado

Antes de desplegar se descarga el `feed.json` publicado y, tras desplegar, se
compara con el nuevo: es novedad lo que está en el nuevo y no en el anterior.
La identidad es `path#key`, sin la fecha.

- Alternativa descartada: publicar lo que tiene fecha de hoy. Se pierde lo
  que se carga ya salido y lo que llega en un despliegue que falló.
- Alternativa descartada: un archivo de publicados en el repositorio. Exige
  permisos de escritura en Actions y commits automáticos en `main`.
- El primer despliegue no encuentra `feed.json` (404), así que no publica
  nada y deja el punto de partida: no inunda al estrenarse.

### `feed.json` además del Atom

`generate-feed.mjs` escribe también `dist/feed.json` con las mismas entradas y
los campos que el Atom no lleva de forma estructurada (`id`, sección, idioma,
URL limpia). El Atom no cambia. Si se quiere, este JSON puede seguir el
formato JSON Feed 1.1 con extensiones `_catalogo`, para que sirva a otros
lectores.

### Lógica pura y publicadores separados

- `scripts/release-channels.mjs` (puro, con tests): `newEntries(prev, next)`,
  `plan(entries, { max: 4, alarm: 20 })` (las cuatro primeras y el resumen
  «y N más») y `formatPost(entry, network)`, que da el texto con UTM y el
  recorte a 300 grafemas de Bluesky (se acorta el título, nunca el enlace).
- `scripts/publish-releases.mjs`: lee el `feed.json` anterior (guardado en un
  archivo temporal por el paso previo), el nuevo de `dist/`, calcula el plan y
  llama a cada publicador. Cada red es un módulo con
  `{ name, configured(env), publish(post) }`; añadir Mastodon es escribir
  otro y sumarlo a la lista.
- Telegram: `sendMessage` con el bot existente a `TELEGRAM_CHANNEL_ID`; la
  vista previa del enlace la genera Telegram con el `og:image`.
- Bluesky: `com.atproto.server.createSession` con contraseña de aplicación y
  `com.atproto.repo.createRecord` con `app.bsky.feed.post`, facet del enlace y
  `embed` externo con la vista previa de `dist/images/previews/` subida con
  `uploadBlob`. Solo `fetch`, sin dependencias nuevas.

### Pasos en el despliegue

En `deploy.yml`, un paso antes de desplegar guarda el `feed.json` publicado
(sin fallar si no está) y otro después publica, con `continue-on-error: true`.
El aviso a IndexNow no cambia. Los registros solo dicen cuántas publicaciones
se enviaron por red o por qué se omitió, nunca credenciales.

### Bluesky con el dominio

El nombre `@catalogodnd.es` se verifica con `public/.well-known/atproto-did`,
que Cloudflare Pages sirve tal cual. No depende de DNS y prueba que la cuenta
es del sitio. La biografía dice que es una cuenta automática.

### UTM

`utm_source=telegram&utm_medium=canal` y `utm_source=bluesky&utm_medium=microblog`,
siempre con `utm_campaign=novedades`, según el esquema del proyecto (medium es
el tipo de sitio, nunca «social»).

## Risks / Trade-offs

- [Un error en el cálculo del feed hace que todo parezca nuevo] → límite de 20
  novedades por despliegue: si se supera, no se publica nada y queda aviso.
- [El despliegue falla después de leer el feed anterior] → solo se publica si
  el paso de despliegue terminó bien; lo pendiente sale en el siguiente.
- [Caché de Cloudflare sirve un `feed.json` viejo] → la petición lleva un
  parámetro que evita la caché.
- [Bluesky cambia la API o invalida la contraseña de aplicación] → la red
  falla sola con aviso y el resto sigue; se regenera la contraseña.
- [Que el feed salga del top 50 una entrada no publicada] → aceptable: lo que
  no está entre las 50 últimas ya no es novedad.

## Migration Plan

1. Fusionar con los secretos sin dar de alta: no se publica nada, pero el
   primer despliegue ya publica `feed.json`, que sirve de punto de partida.
2. El usuario crea el canal de Telegram (público, con el bot como
   administrador) y la cuenta de Bluesky, cambia su nombre a
   `catalogodnd.es` y da de alta los secretos.
3. Probar con `workflow_dispatch` o en local con `--dry-run`.
4. Vuelta atrás: borrar los secretos desactiva cada red sin tocar código.

## Open Questions

- Nombre público del canal de Telegram (por ejemplo `@catalogodnd`): se fija
  al crearlo y solo cambia el enlace del pie.
