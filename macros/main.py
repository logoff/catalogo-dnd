import glob
import json
import os

import jsonschema
from babel.dates import format_datetime
from jinja2 import Environment, FileSystemLoader

from macros import utils

JSON_SCHEMA_PRODUCT = json.load(open("data/schemas/product.jsonschema"))
JINJA2_TEMPLATES_FOLDER = "data/templates/"
JINJA2_TEMPLATE_PRODUCT = "product.html.jinja"


def define_env(env):
    log = env.start_chatting("D&D catalogue")

    @env.macro
    def get_date(date_str: str):
        return format_datetime(date_str, locale="es_ES")

    @env.macro
    def print_product_table(folder_path: str):
        log(f"Received folder path: {folder_path}.")

        json_pattern = os.path.join(folder_path, "*.json")
        log(f"Generated JSON pattern: {json_pattern}.")

        file_list = sorted(glob.glob(json_pattern))
        log(f"Found JSON files: {file_list}.")
        items = []
        for file in file_list:
            item = _validate_and_read_json_file(file)
            if item:
                items.append(item)

        generated_html = _create_products_sheets(items)
        log(f"Generated HTML:\n{generated_html}")
        return generated_html

    def _validate_and_read_json_file(file: os.PathLike) -> bool:
        try:
            with open(file, mode="r") as f:
                product = json.load(f)
                jsonschema.validate(instance=product, schema=JSON_SCHEMA_PRODUCT)
                return product
        except Exception as e:
            log(f"Error processing file {file}, skipping file.")
            log(f"Error: {e}")
            return None

    def _create_products_sheets(items: list) -> list:
        log(f"Received items: {items}")
        return jinja_env.get_template(JINJA2_TEMPLATE_PRODUCT).render(items=items)


jinja_env = Environment(loader=FileSystemLoader(JINJA2_TEMPLATES_FOLDER))
jinja_env.globals.update(utils=utils)
jinja_env.trim_blocks = True
jinja_env.lstrip_blocks = True
