[![Publish docs via GitHub Pages](https://github.com/logoff/catalogo-dnd/actions/workflows/build.yml/badge.svg)](https://github.com/logoff/catalogo-dnd/actions/workflows/build.yml) [![pages-build-deployment](https://github.com/logoff/catalogo-dnd/actions/workflows/pages/pages-build-deployment/badge.svg?branch=gh-pages)](https://github.com/logoff/catalogo-dnd/actions/workflows/pages/pages-build-deployment)

https://logoff.github.io/catalogo-dnd/
# Catálogo Dungeons & Dragons
Te encuentras en el repositorio del **Catálogo Dungeons & Dragons**, que ofrece una lista completa de todos los libros y accesorios publicados en inglés y en castellano de Dungeons & Dragons de las ediciones 5ª y 2024.

## Cómo poner en marcha el proyecto

### Requisitos

* [Python](https://www.python.org/) 3.10+
* [Poetry](https://python-poetry.org/)
* [GNU Make](https://www.gnu.org/software/make/)
* [Docker](https://www.docker.com/) (opcional)

## Construir y servir

```
make docker-build
```

```
make docker-serve-site
```

Abrir http://localhost:8000/.
