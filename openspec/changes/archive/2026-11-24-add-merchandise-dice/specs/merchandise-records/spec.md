# Spec Delta

## ADDED Requirements

### Requirement: Dados a la venta en España

Un artículo del grupo de dados y accesorios SHALL entrar solo si, al darlo
de alta, se puede comprar en España, y SHALL llevar al menos un enlace de
compra a una tienda que el sitio conoce, de preferencia de afiliados. Si
después se agota, la ficha se mantiene.

#### Scenario: Dados oficiales que no llegan a España

- **WHEN** un juego de dados con licencia oficial solo se vende en Estados
  Unidos
- **THEN** no tiene ficha y queda anotado en el inventario como pendiente

#### Scenario: Dados agotados después de darlos de alta

- **WHEN** un juego de dados con ficha deja de venderse en España
- **THEN** la ficha se mantiene y la revisión de enlaces de afiliado lo
  avisa

## MODIFIED Requirements

### Requirement: Alcance de productos licenciados

La sección SHALL incluir productos con licencia oficial de Dungeons &
Dragons publicados desde 2014 que pertenezcan a uno de cuatro grupos:
libros licenciados que no son de reglas, figuras y juguetes, juegos de
mesa y cartas que no son de rol, y dados y accesorios de dados.

#### Scenario: Libro de cocina oficial

- **WHEN** un libro de cocina lleva la licencia oficial de D&D
- **THEN** entra en la sección, en el grupo de libros licenciados

#### Scenario: Juego de cartas oficial

- **WHEN** un juego de cartas con licencia de D&D no es un juego de rol
- **THEN** entra en la sección, en el grupo de juegos de mesa y cartas

#### Scenario: Calendario de adviento de dados oficial

- **WHEN** un calendario de adviento de dados lleva la licencia oficial de
  D&D
- **THEN** entra en la sección, en el grupo de dados y accesorios

#### Scenario: Dados genéricos de rol

- **WHEN** unos dados se venden como «para D&D» sin licencia oficial
- **THEN** no entran en la sección

### Requirement: Exclusiones del alcance

La sección SHALL dejar fuera los libros de reglas, las novelas y los
cómics, la ropa y los complementos, los productos sin licencia oficial o
hechos por fans y los publicados antes de 2014.

#### Scenario: Novela de Reinos Olvidados

- **WHEN** se propone una novela de Drizzt
- **THEN** no entra en la sección de merchandising

#### Scenario: Producto sin licencia

- **WHEN** un producto usa la temática de D&D sin licencia oficial
- **THEN** no entra en la sección

### Requirement: Grupo y tipo de cada artículo

Cada artículo SHALL indicar su grupo y un tipo de una lista cerrada:
libro de cocina, de manualidades, de arte o guía ilustrada; Funko, LEGO,
figura, peluche o miniatura de coleccionista; juego de mesa o juego de
cartas; juego de dados, accesorio de dados o calendario de adviento de
dados.

#### Scenario: Tipo que no está en la lista

- **WHEN** un artículo indica un tipo que no está en la lista
- **THEN** los tests del proyecto fallan

#### Scenario: Tipo que no corresponde al grupo

- **WHEN** un artículo del grupo de libros indica el tipo Funko
- **THEN** los tests del proyecto fallan

#### Scenario: Bandeja de dados

- **WHEN** un artículo es una bandeja o una torre para tirar dados
- **THEN** va en el grupo de dados y accesorios con el tipo accesorio de
  dados
