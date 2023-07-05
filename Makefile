APP := catalogo-dnd

all: site-version build-site clean-site serve-site docker-build docker-serve-site
.PHONY : all

site-version:
	poetry version --short

build-site:
	poetry install --no-root
	poetry run mkdocs build

clean-site:
	rm -rf dist/

serve-site:
	poetry run mkdocs serve --dev-addr=0.0.0.0:8000

docker-build:
	docker image build --tag=$(APP):$$(poetry version --short) .

docker-serve-site: docker-build
	docker container run --rm -it \
		-v $$(pwd)/mkdocs.yml:/site/mkdocs.yml \
		-v $$(pwd)/src:/site/src \
		-v $$(pwd)/main.py:/site/main.py \
		-v $$(pwd)/data:/site/data \
		-p 8000:8000 \
		$(APP):$$(poetry version --short)
