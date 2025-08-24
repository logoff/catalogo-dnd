import datetime

from babel.dates import format_date
from publications_fifth import (
    PublicationType,
    PublicationBookSubType,
    PublicationBoxedSetSubType
)
from publications_new import (
    PublicationType as PublicationType2024,
    PublicationBookSubType as PublicationBookSubType2024,
    PublicationBoxedSetSubType as PublicationBoxedSetSubType2024,
    PublicationAccessorySubType as PublicationAccessorySubType2024
)


def parse_date(date_str: str) -> str:
    return format_date(datetime.datetime.strptime(date_str, "%Y-%m-%d"), locale="es_ES")


def parse_subtype(edition:str, type: str, subtype: str) -> str:
    if edition == "5e":
        return parse_subtype_2014(type, subtype)
    elif edition == "2024":
        return parse_subtype_2024(type, subtype)
    else:
        raise ValueError(f"Unknown edition: {edition}")


def parse_subtype_2014(type: str, subtype: str) -> str:
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
        elif PublicationBoxedSetSubType.OTHERS.value == subtype:
            return "Otro"
    else:
        raise ValueError(f"Unknown PublicationBookSubType: {subtype} for {type}!")

def parse_subtype_2024(type: str, subtype: str) -> str:
    if type == PublicationType2024.BOOK.value:
        if PublicationBookSubType2024.CORE_RULES.value == subtype:
            return "Libro básico"
        elif PublicationBookSubType2024.RULES_EXPANSION.value == subtype:
            return "Expansión del reglamento"
        elif PublicationBookSubType2024.PLAYER_EXPANSION.value == subtype:
            return "Expansión del jugador"
        elif PublicationBookSubType2024.DUNGEON_MASTER_EXPANSION.value == subtype:
            return "Expansión del Dungeon Master"
        elif PublicationBookSubType2024.ADVENTURE_ANTHOLOGY.value == subtype:
            return "Antología de aventuras"
    if type == PublicationType2024.BOXED_SET.value:
        if PublicationBoxedSetSubType2024.STARTER_SET.value == subtype:
            return "Caja de inicio"
        elif PublicationBoxedSetSubType2024.OTHERS.value == subtype:
            return "Otro"
    if type == PublicationType2024.ACCESSORY.value:
        if PublicationAccessorySubType2024.CHARACTER_SHEET.value == subtype:
            return "Hoja de personaje"
        elif PublicationAccessorySubType2024.SCREEN.value == subtype:
            return "Pantalla del Dungeon Master"
    else:
        raise ValueError(f"Unknown PublicationBookSubType: {subtype} for {type}!")
