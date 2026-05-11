"""
Maps OSM tags to Italian ATECO codes and sector risk scores.
Risk scores mirror atecoRisk.mock.ts to keep frontend scoring consistent.
Designed so a future CciaaClient can override ateco_code with the real value
while reusing the same risk lookup.
"""

# OSM tag combinations → (ateco_code, sector_risk, area_type, emissions)
# Keys are (tag_key, tag_value) tuples; checked in priority order.
_TAG_MAP: list[tuple[tuple[str, str], dict]] = [
    # Paints, varnishes, inks — highest risk (20.30)
    (("industrial", "paint"),          {"ateco": "20.30", "risk": 95, "area_type": "chemical/plastic",       "emissions": ["VOC", "solventi", "odori", "COV"]}),
    (("craft", "paint"),               {"ateco": "20.30", "risk": 95, "area_type": "chemical/plastic",       "emissions": ["VOC", "solventi", "odori"]}),

    # Metal treatment / surface finishing (25.61, 25.51)
    (("craft", "spray_painter"),       {"ateco": "25.61", "risk": 92, "area_type": "metal treatment",        "emissions": ["VOC", "solventi", "fumi"]}),
    (("craft", "painter"),             {"ateco": "25.61", "risk": 92, "area_type": "coating/painting",        "emissions": ["VOC", "solventi", "odori"]}),
    (("industrial", "metal_treatment"),{"ateco": "25.61", "risk": 92, "area_type": "metal treatment",        "emissions": ["VOC", "solventi", "fumi", "polveri"]}),
    (("industrial", "metal"),          {"ateco": "25.61", "risk": 92, "area_type": "metal treatment",        "emissions": ["VOC", "fumi", "solventi"]}),
    (("craft", "metal_construction"),  {"ateco": "25.51", "risk": 91, "area_type": "metal treatment",        "emissions": ["fumi", "polveri"]}),

    # Automotive bodyworks (29.20)
    (("industrial", "automotive"),     {"ateco": "29.20", "risk": 88, "area_type": "coating/painting",       "emissions": ["VOC", "solventi", "fumi", "isocianati"]}),
    (("craft", "car_repair"),          {"ateco": "29.20", "risk": 85, "area_type": "coating/painting",       "emissions": ["VOC", "solventi"]}),

    # Industrial printing (18.12)
    (("industrial", "printing"),       {"ateco": "18.12", "risk": 88, "area_type": "industrial area",        "emissions": ["VOC", "solventi", "odori"]}),
    (("craft", "printing"),            {"ateco": "18.12", "risk": 88, "area_type": "industrial area",        "emissions": ["VOC", "solventi"]}),

    # Primary plastics / organic chemicals (20.16, 20.14)
    (("industrial", "plastics"),       {"ateco": "20.16", "risk": 88, "area_type": "chemical/plastic",       "emissions": ["VOC", "odori", "solventi", "fumi"]}),
    (("industrial", "chemical"),       {"ateco": "20.14", "risk": 90, "area_type": "chemical/plastic",       "emissions": ["VOC", "odori", "solventi"]}),
    (("craft", "chemical"),            {"ateco": "20.14", "risk": 88, "area_type": "chemical/plastic",       "emissions": ["VOC", "odori"]}),

    # Foundries (24.51, 24.52)
    (("industrial", "foundry"),        {"ateco": "24.51", "risk": 87, "area_type": "industrial area",        "emissions": ["polveri", "fumi", "IPA", "metalli pesanti"]}),
    (("craft", "foundry"),             {"ateco": "24.51", "risk": 87, "area_type": "industrial area",        "emissions": ["polveri", "fumi"]}),

    # Pharmaceutical base (21.10, 21.20)
    (("industrial", "pharmaceutical"), {"ateco": "21.10", "risk": 85, "area_type": "industrial area",        "emissions": ["VOC", "solventi", "odori"]}),

    # Rubber / tyres (22.11)
    (("industrial", "rubber"),         {"ateco": "22.11", "risk": 82, "area_type": "industrial area",        "emissions": ["VOC", "odori", "fumi"]}),

    # Plastic articles / packaging (22.29)
    (("industrial", "plastic"),        {"ateco": "22.29", "risk": 82, "area_type": "chemical/plastic",       "emissions": ["VOC", "odori", "solventi"]}),
    (("craft", "plastic"),             {"ateco": "22.29", "risk": 82, "area_type": "chemical/plastic",       "emissions": ["VOC", "odori"]}),

    # Leather tanning (15.11)
    (("craft", "tannery"),             {"ateco": "15.11", "risk": 80, "area_type": "industrial area",        "emissions": ["VOC", "odori", "solventi", "H2S"]}),

    # Waste recovery / recycling (38.32, 38.23)
    (("industrial", "recycling"),      {"ateco": "38.32", "risk": 78, "area_type": "waste treatment",        "emissions": ["odori", "polveri", "VOC"]}),
    (("amenity", "recycling"),         {"ateco": "38.32", "risk": 75, "area_type": "waste treatment",        "emissions": ["odori", "polveri"]}),
    (("landuse", "landfill"),          {"ateco": "38.32", "risk": 78, "area_type": "waste treatment",        "emissions": ["odori", "polveri", "VOC"]}),

    # Textile technical / finishing (13.96, 13.30)
    (("industrial", "textile"),        {"ateco": "13.96", "risk": 70, "area_type": "industrial area",        "emissions": ["VOC", "odori"]}),
    (("craft", "textile"),             {"ateco": "13.30", "risk": 75, "area_type": "industrial area",        "emissions": ["VOC", "odori", "solventi"]}),

    # Special machinery / mechanical manufacturing (28.99, 28.29)
    (("industrial", "machinery"),      {"ateco": "28.29", "risk": 68, "area_type": "mechanical manufacturing","emissions": ["fumi", "polveri", "nebbie oleose"]}),
    (("craft", "machine_shop"),        {"ateco": "28.99", "risk": 65, "area_type": "mechanical manufacturing","emissions": ["fumi", "nebbie oleose"]}),
    (("craft", "blacksmith"),          {"ateco": "28.99", "risk": 65, "area_type": "mechanical manufacturing","emissions": ["fumi", "polveri"]}),

    # Paper packaging (17.21)
    (("industrial", "paper"),          {"ateco": "17.21", "risk": 65, "area_type": "industrial area",        "emissions": ["VOC", "polveri"]}),

    # Wood / carpentry / furniture (16.23, 31.09)
    (("industrial", "wood"),           {"ateco": "16.23", "risk": 62, "area_type": "coating/painting",       "emissions": ["VOC", "solventi", "polveri"]}),
    (("craft", "carpenter"),           {"ateco": "16.23", "risk": 62, "area_type": "coating/painting",       "emissions": ["polveri", "VOC"]}),
    (("craft", "joiner"),              {"ateco": "16.23", "risk": 62, "area_type": "coating/painting",       "emissions": ["polveri", "VOC"]}),
    (("craft", "furniture"),           {"ateco": "31.09", "risk": 62, "area_type": "coating/painting",       "emissions": ["polveri", "VOC"]}),

    # Food processing (10.89)
    (("industrial", "food"),           {"ateco": "10.89", "risk": 58, "area_type": "food processing",        "emissions": ["odori", "polveri"]}),
    (("craft", "food"),                {"ateco": "10.89", "risk": 58, "area_type": "food processing",        "emissions": ["odori", "polveri"]}),
    (("craft", "brewery"),             {"ateco": "10.89", "risk": 55, "area_type": "food processing",        "emissions": ["odori"]}),
    (("craft", "winery"),              {"ateco": "10.89", "risk": 55, "area_type": "food processing",        "emissions": ["odori"]}),

    # Logistics / warehousing — lowest risk (52.10)
    (("industrial", "warehouse"),      {"ateco": "52.10", "risk": 38, "area_type": "large warehouse",        "emissions": ["polveri"]}),
    (("landuse", "logistics"),         {"ateco": "52.10", "risk": 38, "area_type": "logistics hub",          "emissions": ["polveri"]}),
]

# Generic industrial zone fallback when no specific tag matches
_ZONE_DEFAULTS = {
    "industrial": {"ateco": "non ancora verificato", "risk": 50, "area_type": "industrial area",         "emissions": ["polveri", "fumi"]},
    "factory":    {"ateco": "28.99",                 "risk": 65, "area_type": "mechanical manufacturing", "emissions": ["fumi", "polveri"]},
    "warehouse":  {"ateco": "52.10",                 "risk": 38, "area_type": "large warehouse",          "emissions": ["polveri"]},
}

_DEFAULT = {"ateco": "non ancora verificato", "risk": 45, "area_type": "industrial area", "emissions": ["polveri"]}

# ATECO code → human-readable description
ATECO_DESCRIPTIONS: dict[str, str] = {
    "20.30": "Fabbricazione di pitture, vernici, smalti, inchiostri e adesivi",
    "25.61": "Trattamento e rivestimento dei metalli",
    "25.51": "Rivestimento e verniciatura industriale dei metalli",
    "20.14": "Fabbricazione di prodotti chimici organici di base",
    "29.20": "Fabbricazione di carrozzerie per autoveicoli",
    "18.12": "Altra stampa (flessografia, rotocalco, serigrafia)",
    "20.16": "Fabbricazione di materie plastiche in forme primarie",
    "24.51": "Fusione di ghisa (fonderie)",
    "24.52": "Fusione di acciaio (fonderie)",
    "21.10": "Fabbricazione di prodotti farmaceutici di base",
    "25.52": "Trattamento termico dei metalli",
    "22.29": "Fabbricazione di altri articoli in materie plastiche",
    "21.20": "Fabbricazione di preparati farmaceutici",
    "22.11": "Fabbricazione di pneumatici e altri prodotti in gomma",
    "15.11": "Concia, tintura e rifinizione di pelli e cuoi",
    "38.32": "Recupero e preparazione per il riciclaggio",
    "29.32": "Fabbricazione di parti e accessori per autoveicoli",
    "13.30": "Finissaggio dei tessili (tintura, trattamenti)",
    "38.23": "Recupero di rifiuti liquidi e solventi",
    "13.96": "Fabbricazione di altri tessuti tecnici e industriali",
    "28.29": "Fabbricazione di altre macchine di impiego generale",
    "28.99": "Fabbricazione di macchine per impieghi speciali",
    "17.21": "Fabbricazione di imballaggi in carta e cartone",
    "31.09": "Fabbricazione di altri mobili",
    "16.23": "Fabbricazione di elementi in legno e carpenteria",
    "10.89": "Produzione di altri prodotti alimentari n.c.a.",
    "52.10": "Magazzinaggio e custodia",
    "non ancora verificato": "Settore da verificare con matching Registro Imprese",
}


def map_tags(tags: dict[str, str], building_type: str = "") -> dict:
    """
    Returns ateco + risk + area_type + emissions from an OSM tags dict.
    Priority: explicit craft/industrial tags > building type > generic default.
    """
    for (key, value), result in _TAG_MAP:
        if tags.get(key, "").lower() == value:
            return result

    # Fall back to building type
    if building_type in _ZONE_DEFAULTS:
        return _ZONE_DEFAULTS[building_type]

    return _DEFAULT


def get_description(ateco_code: str) -> str:
    return ATECO_DESCRIPTIONS.get(ateco_code, "Settore industriale")
