# Spec Delta

## MODIFIED Requirements

### Requirement: Cabecera de la portada

La portada SHALL empezar con un título y una frase que digan qué es el
catálogo, alineados a la izquierda, y un buscador de todo el catálogo que
lleve a la página de resultados `/buscar`. NO SHALL tener un hero centrado
a pantalla completa ni una fila de botones iguales.

#### Scenario: Primera vista en móvil

- **WHEN** se abre la portada a 360 px de ancho
- **THEN** el título, la frase y el buscador caben en la primera pantalla
  sin imagen decorativa encima

#### Scenario: Buscar desde la portada

- **WHEN** se escribe «fiends» en el buscador de la portada
- **THEN** se navega a `/buscar?q=fiends`
