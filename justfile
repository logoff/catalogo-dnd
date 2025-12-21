# Catálogo D&D 5E - Comandos comunes

# Versión del proyecto (extraída de package.json)
version := `node -p "require('./package.json').version"`
image_name := "catalogo-dnd:" + version

# Mostrar ayuda
default:
    @just --list

# === Desarrollo local ===

# Instalar dependencias
install:
    npm install

# Iniciar servidor de desarrollo (instala dependencias si es necesario)
dev: install
    npm run dev

# Iniciar servidor de desarrollo (accesible desde red local)
dev-host: install
    npm run dev -- --host

# === Build ===

# Construir el sitio para producción
build: install
    npm run build

# Previsualizar build de producción
preview: build
    npm run preview

# Verificar tipos TypeScript
typecheck: install
    npm run typecheck

# Linter
lint: install
    npm run lint

# === Docker ===

# Construir imagen Docker
docker-build:
    docker image build \
        -t {{ image_name }} \
        .

# Ejecutar servidor de desarrollo con Docker (construye imagen si es necesario)
docker-run: docker-build
    docker container run \
        -it \
        --rm \
        -p 5173:5173 \
        -v $(pwd):/app \
        {{ image_name }}

# Ejecutar en background
docker-run-detached: docker-build
    docker container run \
        -d \
        -p 5173:5173 \
        -v $(pwd):/app \
        --name catalogo-dnd \
        {{ image_name }}

# Parar contenedor Docker
docker-stop:
    docker container stop catalogo-dnd \
    && docker container rm catalogo-dnd

# === Despliegue ===

# Publicar a GitHub Pages (construye antes)
deploy: build
    npx gh-pages -d dist
