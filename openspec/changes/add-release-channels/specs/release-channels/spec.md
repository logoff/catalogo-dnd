# Spec Delta

## Purpose

Define la publicación automática de las novedades del catálogo en redes
propias (canal de Telegram y Bluesky): qué se publica, cuándo, con qué formato
y medición, y cómo se evita repetir publicaciones o inundar los canales.

## ADDED Requirements

### Requirement: Qué se publica

Tras cada despliegue con éxito, el sitio SHALL publicar en cada red las
entradas del feed de novedades que no estaban en el feed publicado antes de
ese despliegue. Una entrada SHALL identificarse por su ficha y su edición, no
por su fecha, de modo que corregir la fecha de una edición ya publicada NO
SHALL publicarla otra vez.

#### Scenario: Llega la fecha de un lanzamiento

- **WHEN** el despliegue diario mete en el feed una edición cuya fecha es hoy
- **THEN** se publica en el canal de Telegram y en Bluesky

#### Scenario: Se carga algo ya salido

- **WHEN** se fusiona una ficha nueva con una edición salida ayer, que entra
  en el feed
- **THEN** se publica tras el despliegue de esa fusión

#### Scenario: Despliegue sin cambios

- **WHEN** el despliegue diario no cambia el feed
- **THEN** no se publica nada

#### Scenario: Fecha corregida

- **WHEN** una edición ya publicada cambia de fecha y sigue en el feed
- **THEN** no se vuelve a publicar

### Requirement: Sin inundar ni repetir

Cada despliegue SHALL publicar como mucho cuatro novedades por red, de la más
reciente a la más antigua. Si hay más, SHALL añadir una sola publicación que
diga cuántas más hay y enlace a `/novedades`. Si no se puede leer el feed
publicado antes del despliegue, o si las nuevas superan un límite que indica
un error (más de 20), NO SHALL publicarse nada y el aviso SHALL quedar en el
registro del despliegue.

#### Scenario: Muchas novedades a la vez

- **WHEN** un despliegue mete siete novedades en el feed
- **THEN** cada red recibe las cuatro más recientes y una publicación que
  dice que hay tres más y enlaza a `/novedades`

#### Scenario: Feed anterior inaccesible

- **WHEN** el sitio publicado no responde al leer el feed antes de desplegar
- **THEN** el despliegue sigue, no se publica nada y queda un aviso

### Requirement: Formato de cada publicación

Cada publicación SHALL llevar el título de la edición, si es la edición en
castellano o en inglés, la sección del catálogo y el enlace a su ficha. En
Bluesky SHALL respetar el límite de caracteres de la red y mostrar la tarjeta
del enlace con la vista previa de la ficha cuando exista. Las publicaciones
SHALL ser texto generado a partir de los datos, sin opiniones ni valoraciones.

#### Scenario: Novela en castellano

- **WHEN** se publica una novela que sale en castellano
- **THEN** la publicación dice que es la edición en castellano, que es una
  novela y enlaza a su ficha

#### Scenario: Título largo en Bluesky

- **WHEN** el texto completo supera el límite de Bluesky
- **THEN** se acorta el título y el enlace se mantiene entero

### Requirement: Medición

Cada enlace publicado SHALL llevar parámetros de campaña con el esquema del
proyecto: `utm_source` con la red (`telegram` o `bluesky`), `utm_medium` con
el tipo de sitio (`canal` en Telegram, `microblog` en Bluesky) y
`utm_campaign=novedades`.

#### Scenario: Enlace desde Telegram

- **WHEN** se publica una novedad en el canal de Telegram
- **THEN** su enlace lleva `utm_source=telegram&utm_medium=canal&utm_campaign=novedades`

### Requirement: Robustez

La publicación NO SHALL hacer fallar ni deshacer el despliegue. Una red sin
credenciales SHALL omitirse con un aviso, y el fallo de una red NO SHALL
impedir publicar en la otra. Los registros del despliegue, que son públicos,
NO SHALL contener credenciales.

#### Scenario: Bluesky sin configurar

- **WHEN** faltan las credenciales de Bluesky y están las de Telegram
- **THEN** se publica en Telegram, Bluesky se omite con un aviso y el
  despliegue termina bien

#### Scenario: Telegram caído

- **WHEN** Telegram responde con error
- **THEN** se publica igualmente en Bluesky y el despliegue termina bien

### Requirement: Perfiles enlazados

El pie del sitio SHALL enlazar al canal de Telegram y al perfil de Bluesky
junto al feed RSS. El perfil de Bluesky SHALL usar el dominio del sitio como
nombre, verificado desde el propio sitio.

#### Scenario: Enlaces en el pie

- **WHEN** se muestra cualquier página
- **THEN** el pie enlaza al RSS, al canal de Telegram y al perfil de Bluesky
