FROM python:3.12-slim

WORKDIR /site

# upgrade pip
RUN pip install --upgrade pip wheel setuptools

# install make
RUN apt-get update && \
    apt-get install -y make cargo

# install Poetry
RUN pip install poetry

# copy project files and install dependencies
COPY pyproject.toml poetry.lock Makefile ./
RUN python3 -m poetry install --no-root

EXPOSE 8000

ENTRYPOINT ["make", "serve-site"]
