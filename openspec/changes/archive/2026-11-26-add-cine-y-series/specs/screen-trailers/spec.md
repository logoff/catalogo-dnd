# Spec Delta

## Purpose

Define qué tráileres oficiales se guardan de cada película, serie o documental,
en qué idioma, cómo se muestran en la ficha sin contactar con YouTube hasta que
el lector lo pide y cómo se vigila que sigan disponibles.

## ADDED Requirements

### Requirement: Solo tráileres oficiales

Una obra SHALL incluir solo tráileres publicados por un canal oficial: el
estudio, la productora, la distribuidora en EE. UU. o en España, la cadena o
plataforma de estreno o Wizards of the Coast. Si no hay ninguno, la obra no
lleva tráileres.

#### Scenario: Tráiler subido por un particular

- **WHEN** el único tráiler de una película en YouTube lo ha subido un canal
  que no es oficial
- **THEN** la ficha no lleva tráileres

### Requirement: Datos de cada tráiler

Cada tráiler SHALL guardar su identificador de YouTube, su idioma (original o
castellano), su título, el nombre del canal y su fecha de publicación. Una obra
SHALL tener como máximo tres tráileres y ninguno repetido.

#### Scenario: Cuarto tráiler

- **WHEN** una ficha tiene cuatro tráileres
- **THEN** los tests del proyecto fallan

### Requirement: Tráiler en castellano primero

Cuando una obra tenga tráiler en castellano, la ficha SHALL mostrarlo antes que
los demás.

#### Scenario: Tráiler doblado y original

- **WHEN** una película tiene tráiler en castellano y en inglés
- **THEN** la ficha muestra primero el castellano y los dos indican su idioma

### Requirement: Miniatura local

Cada tráiler SHALL tener una miniatura servida desde el propio sitio, para que
la ficha no pida nada a YouTube antes de que el lector reproduzca el vídeo.

#### Scenario: Ficha sin reproducir

- **WHEN** se carga la ficha de una obra con tráileres
- **THEN** el navegador no hace ninguna petición a dominios de YouTube

### Requirement: Reproducción bajo demanda

Antes de reproducir, cada tráiler SHALL mostrarse como su miniatura local con un
botón de reproducir accesible por teclado. Al pulsarlo, SHALL cargarse el
reproductor de `youtube-nocookie.com` y empezar la reproducción.

#### Scenario: El lector pulsa reproducir

- **WHEN** el lector pulsa el botón de un tráiler
- **THEN** se carga el reproductor de `youtube-nocookie.com` en su lugar

### Requirement: Datos estructurados de los tráileres

La ficha SHALL incluir datos estructurados `VideoObject` de cada tráiler con su
título, su miniatura, su fecha de publicación y su dirección.

#### Scenario: Ficha con un tráiler

- **WHEN** se genera la ficha de una obra con un tráiler
- **THEN** su HTML incluye un `VideoObject` de ese tráiler

### Requirement: Vigilancia de tráileres no disponibles

La comprobación de vídeos retirados del proyecto SHALL revisar también los
tráileres. En GitHub Actions SHALL avisar sin hacer fallar la build ni impedir
el despliegue.

#### Scenario: Tráiler retirado

- **WHEN** un tráiler ya no está disponible en YouTube
- **THEN** la comprobación lo avisa con la obra a la que pertenece
