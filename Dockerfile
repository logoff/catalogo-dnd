FROM ghcr.io/astral-sh/uv:python3.13-alpine

WORKDIR /site

ENV LANG=en_GB.UTF8

# copy project files and install dependencies
COPY pyproject.toml uv.lock ./
RUN uv sync --locked

EXPOSE 8000

ENTRYPOINT ["uv", "run", "mkdocs"]

CMD ["serve", "--dev-addr=0.0.0.0:8000"]
