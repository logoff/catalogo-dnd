FROM python:3-slim

WORKDIR /site

# upgrade pip
RUN pip install --upgrade pip wheel setuptools

# install pipx
RUN python3 -m pip install --user pipx
RUN python3 -m pipx ensurepath

# install Poetry
RUN python3 -m pipx install poetry==1.5.0

# copy project files and install dependencies
COPY pyproject.toml poetry.lock ./
RUN python3 -m pipx run poetry install --no-root

EXPOSE 8000

ENTRYPOINT ["python3", "-m", "pipx", "run", "poetry", "run", "mkdocs"]

CMD ["serve", "--dev-addr=0.0.0.0:8000"]
