import datetime

from babel.dates import format_date
from publications import (PublicationBookSubType, PublicationBoxedSetSubType,
                          PublicationType)


def parse_date(date_str: str) -> str:
    return format_date(datetime.datetime.strptime(date_str, "%Y-%m-%d"), locale="es_ES")

def parse_subtype(type: str, subtype: str) -> str:
    if type == PublicationType.BOOK.value:
        if PublicationBookSubType.CORE_RULES.value == subtype:
            return "Libro básico"
        elif PublicationBookSubType.SUPPLEMENTAL_RULES.value == subtype:
            return "Expansión del reglamento"
        elif PublicationBookSubType.SETTING.value == subtype:
            return "Escenario de campaña"
        elif PublicationBookSubType.ADVENTURE.value == subtype:
            return "Aventura"
    if type == PublicationType.BOXED_SET.value:
        if PublicationBoxedSetSubType.STARTER_SET.value == subtype:
            return "Caja de inicio"
        elif PublicationBoxedSetSubType.RULES.value == subtype:
            return "Set de regalo de los reglamentos básicos"
        elif PublicationBoxedSetSubType.ADVENTURE_SETTING.value == subtype:
            return "Colección de campaña"
    else:
        raise ValueError(f"Unknown PublicationBookSubType: {subtype} for {type}!")
