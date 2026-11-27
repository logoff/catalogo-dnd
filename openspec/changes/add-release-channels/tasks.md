# Tasks

## 1. Feed en JSON

- [ ] 1.1 `generate-feed.mjs` escribe también `dist/feed.json` con las mismas entradas que el Atom (`id` = `path#key`, título, fecha, sección, idioma, URL limpia y resumen); test en `scripts/feed.test.mjs` y `npm run build` deja el archivo
- [ ] 1.2 Comprobar que `dist/feed.xml` no cambia (diff con el de `main`)

## 2. Lógica pura

- [ ] 2.1 `scripts/release-channels.mjs` con `newEntries(prev, next)` por `path#key` (sin fecha); tests: novedad, sin cambios, fecha corregida no se repite
- [ ] 2.2 `plan(entries, { max: 4, alarm: 20 })`: las cuatro más recientes, la publicación de resumen «y N más» con enlace a `/novedades`, y nada si se supera la alarma; tests de 0, 4, 7 y 21 novedades
- [ ] 2.3 `formatPost(entry, network)`: título, castellano o inglés, sección y enlace con la UTM de cada red; recorte a 300 grafemas en Bluesky sin cortar el enlace; tests de novela en castellano, título largo y UTM de cada red

## 3. Publicadores

- [ ] 3.1 Publicador de Telegram (`sendMessage` al canal con el bot existente); se omite sin `TELEGRAM_BOT_TOKEN` o `TELEGRAM_CHANNEL_ID`; test con `fetch` simulado
- [ ] 3.2 Publicador de Bluesky (sesión con contraseña de aplicación, `createRecord` con facet del enlace y tarjeta externa con la vista previa subida con `uploadBlob` si existe); se omite sin `BLUESKY_HANDLE` o `BLUESKY_APP_PASSWORD`; test con `fetch` simulado
- [ ] 3.3 `scripts/publish-releases.mjs`: lee el feed anterior y el nuevo, calcula el plan y publica en cada red; un fallo de una red no impide la otra; sin feed anterior no publica; registro solo con recuentos o motivo; `--dry-run` muestra los mensajes en local y no se permite en Actions; probar con `node scripts/publish-releases.mjs --dry-run`

## 4. Despliegue

- [ ] 4.1 `deploy.yml`: paso antes de desplegar que guarda el `feed.json` publicado (con parámetro anticaché, sin fallar si no existe) y paso después, con `continue-on-error`, que publica con los secretos `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, `BLUESKY_HANDLE` y `BLUESKY_APP_PASSWORD`; revisar el YAML con `actionlint` o leyéndolo
- [ ] 4.2 Receta `just publish-releases-dry` que ejecuta el modo de prueba contra el feed publicado; probarla en local
- [ ] 4.3 README: secretos nuevos y pasos para crear el canal y la cuenta

## 5. Perfiles

- [ ] 5.1 `public/.well-known/atproto-did` con el DID de la cuenta de Bluesky (lo da el usuario al crearla); `curl` a la URL desplegada lo devuelve
- [ ] 5.2 Pie con enlaces al canal de Telegram y al perfil de Bluesky junto al RSS (`rel="me"`); actualizar `Footer.test.tsx`

## 6. Verificación

- [ ] 6.1 `just check` y `npm run build` sin errores
- [ ] 6.2 Tras crear las cuentas y los secretos, lanzar el despliegue a mano y comprobar que no publica nada si el feed no cambia, y que una novedad real llega a los dos canales con su UTM

## Workflow follow-up

- Abrir PR, fusionar y, tras un mes, medir en Umami las visitas con `utm_campaign=novedades` de cada red para cerrar #92.
- Archivar el cambio.
