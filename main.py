import datetime
import glob
import json
import os

import jsonschema
from babel.dates import format_date, format_datetime
from jinja2 import Environment, FileSystemLoader

PRODUCT_SCHEMA = json.load(open("data/schemas/product.jsonschema"))


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
                jsonschema.validate(instance=product, schema=PRODUCT_SCHEMA)
                return product
        except Exception as e:
            log(f"Error processing file {file}, skipping file.")
            log(f"Error: {e}")
            return None

    def _create_products_sheets(items: list) -> list:
        log(f"Received items: {items}")
        return jinja_env.get_template("product.html.jinja").render(items=items)

def parse_date(date_str: str) -> str:
    return format_date(datetime.datetime.strptime(date_str, "%Y-%m-%d"), locale="es_ES")

jinja_env = Environment(loader=FileSystemLoader("data/templates/"))
jinja_env.globals.update(parse_date=parse_date)
jinja_env.trim_blocks = True
jinja_env.lstrip_blocks = True
