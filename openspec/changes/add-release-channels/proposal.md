# Proposal

## Why

La difusión depende de grupos y comunidades ajenos, y la mayoría no acepta
autopromoción ni contenido hecho con IA (#92). Un canal propio, alimentado
solo con las novedades que ya calcula el build, trae visitas recurrentes sin
pedir permiso a nadie y sin trabajo manual. Instagram, X y Facebook quedan
fuera: invalidan cuentas automatizadas o pequeñas y sus API son de pago o
restrictivas. Telegram y Bluesky permiten publicar con bots sin coste y sin
ese riesgo.

## What Changes

- Tras cada despliegue (al fusionar en `main` y en el diario de las 4:00 UTC),
  las novedades que acaban de entrar en el feed se publican solas en:
  - un **canal de Telegram** propio, con el bot que ya envía el informe de
    Umami como administrador;
  - una **cuenta de Bluesky** con el dominio como nombre (`@catalogodnd.es`),
    verificada desde el propio sitio.
- Es novedad lo que entra en el feed y no estaba en el que había publicado:
  lo que llega a su fecha y lo que se carga ya salido. Nunca se repite una
  publicación ni se inunda el canal: con muchas novedades a la vez, se
  publican unas pocas y un resumen que enlaza a `/novedades`.
- Cada enlace lleva UTM según el esquema fijo del proyecto
  (`utm_source=<red>`, `utm_medium=<tipo>`, `utm_campaign=novedades`).
- Si faltan las credenciales de una red, se omite sin fallar; si una red
  falla, el despliegue ya está hecho y la otra se publica igual.
- El pie del sitio enlaza al canal y al perfil, junto al RSS.
- El diseño deja preparada una tercera red (Mastodon) sin cambiar la lógica.

Fuera de alcance: Instagram, X, Facebook y Mastodon (solo preparado), publicar
el resumen mensual y responder o moderar en las redes.

## Capabilities

### New Capabilities

- `release-channels`: publicación automática de las novedades en redes
  propias: qué se publica, cuándo, con qué formato y medición, y cómo se evita
  repetir o inundar.

### Modified Capabilities

Ninguna: el feed y la página de novedades no cambian de comportamiento.

## Impact

- `scripts/`: lógica pura para calcular las novedades nuevas y dar formato a
  los mensajes (con tests), y un script que publica en cada red.
- `.github/workflows/deploy.yml`: guarda el feed publicado antes de desplegar
  y publica después; nuevos secretos `TELEGRAM_CHANNEL_ID`, `BLUESKY_HANDLE` y
  `BLUESKY_APP_PASSWORD` (el token del bot se reutiliza).
- `public/.well-known/atproto-did`: verificación del dominio para Bluesky.
- `src/components/layout/Footer.tsx`: enlaces al canal y al perfil.
- Pasos manuales del usuario: crear el canal y la cuenta, y dar de alta los
  secretos.
