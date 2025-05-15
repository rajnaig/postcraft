import os
from dotenv import load_dotenv

# Környezeti változók betöltése
load_dotenv()

# API kulcsok
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Alkalmazás beállítások
APP_NAME = os.getenv("APP_NAME", "PostCraft")
APP_ENV = os.getenv("APP_ENV", "development")
APP_DEBUG = os.getenv("APP_DEBUG", "true").lower() == "true"
APP_PORT = int(os.getenv("APP_PORT", "8000"))

# Adatbázis beállítások
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./postcraft.db")

# Platform beállítások
PLATFORM_SETTINGS = {
    "facebook": {
        "name": "Facebook",
        "char_limit": 2000,
        "image_size": "1200x630",
        "hashtag_limit": 10,
        "emoji_support": True,
        "tone_modifiers": ["közösségi", "beszélgetős", "interaktív"],
        "post_style": "Hosszabb, story-jellegű"
    },
    "instagram": {
        "name": "Instagram",
        "char_limit": 2200,
        "image_size": "1080x1080",
        "hashtag_limit": 30,
        "emoji_support": True,
        "tone_modifiers": ["vizuális", "inspiráló", "trendi"],
        "post_style": "Képközpontú",
        "suggested_images": 2
    },
    "linkedin": {
        "name": "LinkedIn",
        "char_limit": 1300,
        "image_size": "1200x1200",
        "hashtag_limit": 5,
        "emoji_support": False,
        "tone_modifiers": ["szakmai", "informatív", "networking"],
        "post_style": "Szakmai, üzleti"
    },
    "x": {
        "name": "X (Twitter)",
        "char_limit": 280,
        "image_size": "1200x675",
        "hashtag_limit": 5,
        "emoji_support": True,
        "tone_modifiers": ["tömör", "gyors", "aktuális"],
        "post_style": "Rövid, lényegre törő"
    }
}

# Vibe és stílus opciók
VIBE_OPTIONS = [
    {"id": "friendly", "name": "Baráti", "description": "Közvetlenebb, barátságosabb hangvétel"},
    {"id": "professional", "name": "Szakmai", "description": "Formálisabb, szakmai megközelítés"},
    {"id": "humorous", "name": "Humoros", "description": "Vicces, könnyed hangvétel"},
    {"id": "motivational", "name": "Motiváló", "description": "Inspiráló, energikus hangvétel"}
]

STYLE_OPTIONS = [
    {"id": "short", "name": "Rövid", "description": "Tömör, lényegre törő stílus"},
    {"id": "detailed", "name": "Részletes", "description": "Bővebb kifejtés, részletesebb tartalom"},
    {"id": "informal", "name": "Informális", "description": "Kötetlenebb, hétköznapi nyelvezet"},
    {"id": "formal", "name": "Formális", "description": "Hivatalosabb, szabálykövetőbb stílus"}
]