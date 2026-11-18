# Spec Delta

## MODIFIED Requirements

### Requirement: Notas de medios

Cada nota SHALL guardar la cifra, su escala, la fuente y el enlace a la
página del juego en el agregador. Las únicas fuentes admitidas son
Metacritic y OpenCritic. La nota se cita como dato: la cifra, el nombre
del agregador en texto y el enlace, sin logotipos y sin copiar reseñas
ni listas de críticas.

#### Scenario: Nota por plataforma

- **WHEN** Metacritic da notas distintas para PC y consola
- **THEN** cada nota indica a qué plataforma corresponde

#### Scenario: Juego sin notas

- **WHEN** no hay ninguna nota de las fuentes admitidas
- **THEN** el juego se registra igual, sin notas

#### Scenario: Nota de un medio

- **WHEN** una nota tiene como fuente un medio que no es Metacritic ni
  OpenCritic
- **THEN** los tests del proyecto fallan

#### Scenario: Edición con página propia

- **WHEN** una edición remasterizada tiene su propia página en
  Metacritic
- **THEN** su nota se guarda aparte, indicando la edición

## ADDED Requirements

### Requirement: Notas de todos los juegos con agregador

Todo juego publicado que tenga página con nota en Metacritic u OpenCritic
SHALL llevar esa nota en su ficha.

#### Scenario: Juego con página en Metacritic

- **WHEN** un juego publicado tiene nota en Metacritic
- **THEN** su ficha la muestra con el enlace a la página de Metacritic

#### Scenario: Juego sin página en ningún agregador

- **WHEN** un juego no aparece en Metacritic ni en OpenCritic
- **THEN** su ficha no muestra la sección de notas

### Requirement: Vigilancia de las notas

El proyecto SHALL tener una comprobación que avisa cuando la nota
publicada por el agregador ya no coincide con la guardada o cuando el
enlace ha dejado de existir. La comprobación no bloquea la build y se
ejecuta en la integración continua.

#### Scenario: Nota cambiada

- **WHEN** Metacritic publica un 85 para un juego que tiene guardado un
  84
- **THEN** la comprobación avisa indicando el juego, la nota guardada y
  la publicada, y termina sin error

#### Scenario: Enlace roto

- **WHEN** la página del agregador devuelve un error 404 o 410
- **THEN** la comprobación avisa indicando el juego y el enlace

#### Scenario: Nota que no se puede leer

- **WHEN** el agregador bloquea la petición o la página no trae la nota
  en sus datos estructurados
- **THEN** la nota se cuenta como no comprobada, sin dar aviso

#### Scenario: Sin red

- **WHEN** la comprobación no puede conectarse a internet
- **THEN** da un único aviso y termina sin error
