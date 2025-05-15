from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import json

from ..models.database import GenerationHistory, SavedProfile

class DBService:
    """Adatbázis műveletek kezelése"""
    
    @staticmethod
    def save_generation_history(db: Session, request_id: str, request_data: Dict[str, Any], result_data: Dict[str, Any]) -> GenerationHistory:
        """Generálási előzmény mentése"""
        db_history = GenerationHistory(
            request_id=request_id,
            message=request_data.get("message", ""),
            audience=request_data.get("audience", ""),
            vibe=request_data.get("vibe", ""),
            style=request_data.get("style", ""),
            use_emojis=request_data.get("use_emojis", True),
            platforms=json.dumps(request_data.get("platforms", [])),
            result=json.dumps(result_data)
        )
        db.add(db_history)
        db.commit()
        db.refresh(db_history)
        return db_history
    
    @staticmethod
    def get_generation_history(db: Session, limit: int = 10) -> List[GenerationHistory]:
        """Utolsó N generálási előzmény lekérése"""
        return db.query(GenerationHistory).order_by(GenerationHistory.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def get_generation_by_request_id(db: Session, request_id: str) -> Optional[GenerationHistory]:
        """Generálási előzmény lekérése request_id alapján"""
        return db.query(GenerationHistory).filter(GenerationHistory.request_id == request_id).first()
    
    @staticmethod
    def save_profile(db: Session, profile_data: Dict[str, Any]) -> SavedProfile:
        """Platform profil mentése"""
        db_profile = SavedProfile(
            name=profile_data.get("name", "Új profil"),
            description=profile_data.get("description", ""),
            settings=json.dumps(profile_data.get("settings", {}))
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return db_profile
    
    @staticmethod
    def update_profile(db: Session, profile_id: int, profile_data: Dict[str, Any]) -> Optional[SavedProfile]:
        """Platform profil frissítése"""
        db_profile = db.query(SavedProfile).filter(SavedProfile.id == profile_id).first()
        if db_profile:
            db_profile.name = profile_data.get("name", db_profile.name)
            db_profile.description = profile_data.get("description", db_profile.description)
            
            if "settings" in profile_data:
                db_profile.settings = json.dumps(profile_data["settings"])
            
            db.commit()
            db.refresh(db_profile)
        return db_profile
    
    @staticmethod
    def get_all_profiles(db: Session) -> List[SavedProfile]:
        """Összes elmentett profil lekérése"""
        return db.query(SavedProfile).all()
    
    @staticmethod
    def get_profile_by_id(db: Session, profile_id: int) -> Optional[SavedProfile]:
        """Profil lekérése ID alapján"""
        return db.query(SavedProfile).filter(SavedProfile.id == profile_id).first()
    
    @staticmethod
    def delete_profile(db: Session, profile_id: int) -> bool:
        """Profil törlése"""
        db_profile = db.query(SavedProfile).filter(SavedProfile.id == profile_id).first()
        if db_profile:
            db.delete(db_profile)
            db.commit()
            return True
        return False