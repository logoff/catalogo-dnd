import datetime

from babel.dates import format_datetime


def define_env(env):

    @env.macro
    def get_date(date_str: str):
        return format_datetime(date_str, locale="es_ES")
