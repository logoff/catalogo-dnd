from enum import StrEnum


class PublicationType(StrEnum):
    BOOK = "book"
    BOXED_SET = "boxed_set"
    ACCESSORY = "accessory"


class PublicationBookSubType(StrEnum):
    CORE_RULES = "core_rules"
    RULES_EXPANSION = "rules_expansion"
    PLAYER_EXPANSION = "player_expansion"
    DUNGEON_MASTER_EXPANSION = "dungeon_master_expansion"
    ADVENTURE_ANTHOLOGY = "adventure_anthology"


class PublicationBoxedSetSubType(StrEnum):
    STARTER_SET = "starter_set"
    OTHERS = "others"


class PublicationAccessorySubType(StrEnum):
    CHARACTER_SHEET = "character_sheet"
    SCREEN = "screen"
