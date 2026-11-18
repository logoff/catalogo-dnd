# Spec Delta

## Purpose

Define cómo se elige, se recuerda y se aplica el tema claro u oscuro del
sitio, sin parpadeo y sin romper el HTML prerenderizado ni la hidratación.

## ADDED Requirements

### Requirement: Tema por defecto

Sin una elección guardada, el sitio SHALL mostrarse en el tema que pida el
sistema del usuario (claro u oscuro) y SHALL cambiar si esa preferencia
cambia con la página abierta.

#### Scenario: Sistema en oscuro

- **WHEN** un visitante nuevo entra con el sistema en modo oscuro
- **THEN** ve el sitio en el tema oscuro

#### Scenario: El sistema cambia de modo

- **WHEN** el visitante no ha elegido tema y su sistema pasa de claro a
  oscuro con la página abierta
- **THEN** el sitio pasa al tema oscuro sin recargar

### Requirement: Selector de tema

La cabecera SHALL tener un botón accesible que cambie entre el tema claro y
el oscuro, con un nombre que diga a qué tema cambia. La elección SHALL
guardarse en el navegador y aplicarse en las siguientes visitas, por encima
de la preferencia del sistema. Si el navegador no permite guardarla, el
botón SHALL seguir funcionando durante la visita.

#### Scenario: Elegir tema claro

- **WHEN** el visitante pulsa el botón estando en el tema oscuro
- **THEN** el sitio pasa al tema claro y el botón ofrece volver al oscuro

#### Scenario: Volver otro día

- **WHEN** el visitante eligió el tema claro y vuelve con el sistema en
  oscuro
- **THEN** ve el sitio en el tema claro

#### Scenario: Almacenamiento bloqueado

- **WHEN** el navegador no permite guardar datos del sitio
- **THEN** el botón cambia el tema igualmente y no se produce ningún error

### Requirement: Sin parpadeo ni desajuste de hidratación

El tema SHALL aplicarse antes de que se pinte la página, de modo que el
HTML prerenderizado nunca se vea un instante en el tema equivocado. El
primer render en el navegador SHALL coincidir con el del servidor: lo que
dependa del tema elegido se resuelve con estilos o después de hidratar.

#### Scenario: Carga en tema oscuro guardado

- **WHEN** un visitante con el tema oscuro guardado abre una ficha
  prerenderizada
- **THEN** la ve en oscuro desde el primer fotograma

#### Scenario: Hidratación

- **WHEN** se hidrata cualquier página en cualquiera de los dos temas
- **THEN** React no avisa de diferencias entre el HTML del servidor y el
  del navegador

### Requirement: Controles nativos y barra del navegador

Los controles nativos (barras de desplazamiento, casillas, campos) SHALL
adaptarse al tema activo y el color de la barra del navegador en móvil
SHALL coincidir con el fondo del tema.

#### Scenario: Barra de desplazamiento en oscuro

- **WHEN** el sitio está en el tema oscuro
- **THEN** las barras de desplazamiento y las casillas se ven oscuras
