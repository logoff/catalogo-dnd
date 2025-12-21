set shell := ["bash", "-uc"]

project_name := "catalogo-dnd"
version := `uv version --short`

site-version:
    @echo "{{project_name}}:{{version}}"

build-site:
    uv sync --locked
    uv run mkdocs build

clean-site:
    rm -rf dist/

serve-site: build-site
    uv run mkdocs serve \
        --dev-addr=0.0.0.0:8000 \
        --watch data \
        --watch macros

publish-site: build-site
    uv run mkdocs gh-deploy --force

docker-build:
    docker image build --tag="{{project_name}}:{{version}}" .

docker-serve-site: docker-build
    docker container run --rm -it \
        -v $(pwd)/mkdocs.yml:/site/mkdocs.yml \
        -v $(pwd)/src:/site/src \
        -v $(pwd)/data:/site/data \
        -v $(pwd)/macros:/site/macros \
        -p 8000:8000 \
        {{project_name}}:{{version}}
