# backend/app/models/database.py
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
from datetime import datetime
import os

# SQLAlchemy engine és session létrehozása
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./postcraft.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Adatbázis modellek
class GenerationHistory(Base):
    """Generálási előzmények tárolása"""
    __tablename__ = "generation_history"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(String, unique=True, index=True)
    message = Column(Text)
    audience = Column(String)
    vibe = Column(String)
    style = Column(String)
    use_emojis = Column(Boolean, default=True)
    platforms = Column(Text)  # JSON string a platformok listájához
    created_at = Column(DateTime, default=func.now())
    result = Column(Text)  # A teljes generált eredmény JSON string-ként

class SavedProfile(Base):
    """Elmentett platform profilok tárolása"""
    __tablename__ = "saved_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    settings = Column(Text)  # A profil teljes beállítása JSON string-ként
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# Adatbázis táblák létrehozása
def create_tables():
    Base.metadata.create_all(bind=engine)

# Adatbázis munkamenet kezelő függvény
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()