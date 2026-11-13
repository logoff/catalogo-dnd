# videogame-videos Specification

## Purpose

Define qué vídeos oficiales se guardan de cada videojuego, cómo se
muestran en su ficha sin contactar con YouTube hasta que el lector lo
pide y cómo se vigila que sigan disponibles.

## Requirements

### Requirement: Solo vídeos oficiales

Un juego SHALL incluir únicamente vídeos publicados por un canal
oficial: su editora, su desarrolladora, una plataforma donde salió
(PlayStation, Xbox, Nintendo) o Wizards of the Coast / D&D. Si no hay
ninguno, el juego no lleva vídeos.

#### Scenario: Tráiler del canal de la editora

- **WHEN** la editora de un juego publica su tráiler en YouTube
- **THEN** ese vídeo puede añadirse a la ficha

#### Scenario: Vídeo de un medio o de un fan

- **WHEN** el único vídeo disponible de un juego es de un medio, un
  creador de contenido o un fan
- **THEN** el juego no lleva vídeos

### Requirement: Datos de cada vídeo

Cada vídeo SHALL guardar su identificador de YouTube, su tipo (tráiler,
anuncio, lanzamiento o expansión), su título, el nombre del canal que
lo publica y su fecha de publicación. Un juego SHALL tener como máximo tres vídeos y ningún vídeo
repetido.

#### Scenario: Vídeo sin canal

- **WHEN** un vídeo no indica el canal que lo publica
- **THEN** los tests del proyecto fallan

#### Scenario: Demasiados vídeos

- **WHEN** un juego tiene cuatro vídeos
- **THEN** los tests del proyecto fallan

#### Scenario: Vídeo repetido

- **WHEN** un juego tiene dos veces el mismo identificador de YouTube
- **THEN** los tests del proyecto fallan

### Requirement: Miniatura local

Cada vídeo SHALL tener una miniatura servida desde el propio sitio, para
que la ficha no pida nada a YouTube antes de que el lector reproduzca
el vídeo.

#### Scenario: Miniatura inexistente

- **WHEN** un vídeo no tiene su miniatura en el sitio
- **THEN** los tests del proyecto fallan

### Requirement: Sección de vídeos en la ficha

La ficha SHALL mostrar una sección «Vídeos», aparte de la portada, con
los vídeos del juego en el orden de los datos, cada uno con su título y
su canal. La sección SHALL omitirse si el juego no tiene vídeos.

#### Scenario: Juego con vídeos

- **WHEN** un juego tiene un tráiler y un anuncio
- **THEN** la ficha muestra la sección «Vídeos» con los dos, en el orden
  de los datos

#### Scenario: Juego sin vídeos

- **WHEN** un juego no tiene vídeos
- **THEN** la ficha no muestra la sección «Vídeos» ni ningún hueco vacío

### Requirement: Reproducción bajo demanda

Antes de reproducir, cada vídeo SHALL mostrarse como su miniatura local
con un botón de reproducir accesible por teclado, sin cargar recursos de
YouTube. Al pulsarlo, SHALL cargarse el reproductor de
`youtube-nocookie.com` y empezar la reproducción.

#### Scenario: Ficha recién abierta

- **WHEN** un lector abre la ficha de un juego con vídeos
- **THEN** la página no hace ninguna petición a dominios de YouTube ni de
  Google

#### Scenario: Reproducir un vídeo

- **WHEN** el lector pulsa el botón de reproducir de un vídeo, con el
  ratón o con el teclado
- **THEN** se carga el reproductor de `youtube-nocookie.com` en el lugar
  de la miniatura y el vídeo empieza a reproducirse

#### Scenario: Ver en YouTube sin JavaScript

- **WHEN** el navegador no ejecuta JavaScript
- **THEN** la miniatura enlaza al vídeo en YouTube

### Requirement: Prerenderizado y datos estructurados

La sección de vídeos SHALL formar parte del HTML prerenderizado de la
ficha, y la ficha SHALL incluir datos estructurados `VideoObject` de
cada vídeo con su título, su miniatura, su fecha de publicación y su
dirección.

#### Scenario: HTML prerenderizado

- **WHEN** se genera el HTML de la ficha de un juego con vídeos
- **THEN** contiene las miniaturas, los títulos y un `VideoObject` por
  vídeo

### Requirement: Aviso en la página legal

La página legal SHALL explicar que el sitio no carga YouTube por su
cuenta y que, al reproducir un vídeo, el navegador se conecta con
YouTube, que aplica su propia política de privacidad.

#### Scenario: Lector que consulta la privacidad

- **WHEN** un lector abre la página legal
- **THEN** encuentra el aviso sobre la reproducción de vídeos de YouTube

### Requirement: Vigilancia de vídeos no disponibles

El proyecto SHALL tener una comprobación que detecte los vídeos que ya
no están disponibles en YouTube. En GitHub Actions SHALL avisar sin
hacer fallar la build ni impedir el despliegue.

#### Scenario: Vídeo retirado

- **WHEN** un vídeo de una ficha se ha borrado o se ha hecho privado
- **THEN** la comprobación lo señala con el juego y el identificador, y
  la build de Actions muestra un aviso pero termina con éxito

#### Scenario: YouTube no responde

- **WHEN** la comprobación no puede contactar con YouTube
- **THEN** avisa de que no ha podido comprobar los vídeos, sin hacer
  fallar la build
