from enum import StrEnum


class PublicationType(StrEnum):
    BOOK = "book"
    BOXED_SET = "boxed_set"
    ACCESSORY = "accessory"


class PublicationBookSubType(StrEnum):
    CORE_RULES = "core_rules"
    SUPPLEMENTAL_RULES = "supplemental_rules"
    SETTING = "setting"
    ADVENTURE = "adventure"


class PublicationBoxedSetSubType(StrEnum):
    STARTER_SET = "starter_set"
    RULES = "rules"
    ADVENTURE_SETTING = "adventure_setting"
    OTHERS = "others"


class PublicationAccessorySubType(StrEnum):
    CHARACTER_SHEET = "character_sheet"
    SCREEN = "screen"
