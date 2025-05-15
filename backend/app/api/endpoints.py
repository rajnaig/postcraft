from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import json

from ..models.schemas import (
    GeneratePostRequest, 
    GeneratePostResponse,
    PlatformsResponse,
    OptionsResponse,
    ProfileCreate,
    ProfileUpdate,
    Profile
)
from ..models.database import get_db, GenerationHistory, SavedProfile
from ..services.llm_service import LLMService
from ..config.settings import PLATFORM_SETTINGS, VIBE_OPTIONS, STYLE_OPTIONS

router = APIRouter()
llm_service = LLMService()

@router.post("/generate", response_model=GeneratePostResponse)
async def generate_posts(request: GeneratePostRequest, db: Session = Depends(get_db)):
    """
    Posztok generálása a megadott paraméterek alapján
    """
    try:
        result = await llm_service.generate_posts(request)
        
        # Generálási előzmény mentése
        db_history = GenerationHistory(
            request_id=result["request_id"],
            message=request.message,
            audience=request.audience,
            vibe=request.vibe,
            style=request.style,
            use_emojis=request.use_emojis,
            platforms=json.dumps(request.platforms),
            result=json.dumps(result)
        )
        db.add(db_history)
        db.commit()
        
        return result
    except Exception as e:
        print(f"Error in generate_posts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/platforms", response_model=PlatformsResponse)
async def get_platforms():
    """
    Az elérhető platformok listázása beállításokkal
    """
    platforms = []
    for platform_id, settings in PLATFORM_SETTINGS.items():
        platforms.append({
            "id": platform_id,
            "name": settings.get("name", platform_id.capitalize()),
            "char_limit": settings.get("char_limit", 0),
            "image_size": settings.get("image_size", ""),
            "hashtag_limit": settings.get("hashtag_limit", 0)
        })
    
    return {"platforms": platforms}

@router.get("/options", response_model=OptionsResponse)
async def get_options():
    """
    Elérhető vibe és stílus opciók
    """
    return {
        "vibe_options": VIBE_OPTIONS,
        "style_options": STYLE_OPTIONS
    }

@router.post("/profiles")
async def create_profile(profile: ProfileCreate, db: Session = Depends(get_db)):
    """
    Új platform profil létrehozása
    """
    try:
        db_profile = SavedProfile(
            name=profile.name,
            description=profile.description,
            settings=json.dumps(profile.settings)
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return {"id": db_profile.id, "name": db_profile.name, "message": "Profil sikeresen létrehozva"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/profiles")
async def get_profiles(db: Session = Depends(get_db)):
    """
    Összes profil lekérése
    """
    profiles = db.query(SavedProfile).all()
    result = []
    for profile in profiles:
        result.append({
            "id": profile.id,
            "name": profile.name,
            "description": profile.description,
            "settings": json.loads(profile.settings),
            "created_at": profile.created_at,
            "updated_at": profile.updated_at
        })
    return result

@router.get("/profiles/{profile_id}")
async def get_profile(profile_id: int, db: Session = Depends(get_db)):
    """
    Profil lekérése ID alapján
    """
    profile = db.query(SavedProfile).filter(SavedProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profil nem található")
    
    return {
        "id": profile.id,
        "name": profile.name,
        "description": profile.description,
        "settings": json.loads(profile.settings),
        "created_at": profile.created_at,
        "updated_at": profile.updated_at
    }

@router.put("/profiles/{profile_id}")
async def update_profile(profile_id: int, profile: ProfileUpdate, db: Session = Depends(get_db)):
    """
    Profil frissítése
    """
    db_profile = db.query(SavedProfile).filter(SavedProfile.id == profile_id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profil nem található")
    
    db_profile.name = profile.name
    db_profile.description = profile.description
    db_profile.settings = json.dumps(profile.settings)
    
    db.commit()
    db.refresh(db_profile)
    
    return {"id": db_profile.id, "name": db_profile.name, "message": "Profil sikeresen frissítve"}

@router.delete("/profiles/{profile_id}")
async def delete_profile(profile_id: int, db: Session = Depends(get_db)):
    """
    Profil törlése
    """
    db_profile = db.query(SavedProfile).filter(SavedProfile.id == profile_id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profil nem található")
    
    db.delete(db_profile)
    db.commit()
    
    return {"message": "Profil sikeresen törölve"}

@router.get("/history")
async def get_history(limit: int = 10, db: Session = Depends(get_db)):
    """
    Generálási előzmények lekérése
    """
    history = db.query(GenerationHistory).order_by(GenerationHistory.created_at.desc()).limit(limit).all()
    result = []
    for item in history:
        result.append({
            "id": item.id,
            "request_id": item.request_id,
            "message": item.message,
            "audience": item.audience,
            "vibe": item.vibe,
            "style": item.style,
            "use_emojis": item.use_emojis,
            "platforms": json.loads(item.platforms),
            "created_at": item.created_at
        })
    return result

@router.get("/history/{request_id}")
async def get_history_item(request_id: str, db: Session = Depends(get_db)):
    """
    Generálási előzmény lekérése request_id alapján
    """
    item = db.query(GenerationHistory).filter(GenerationHistory.request_id == request_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Generálási előzmény nem található")
    
    return {
        "id": item.id,
        "request_id": item.request_id,
        "message": item.message,
        "audience": item.audience,
        "vibe": item.vibe,
        "style": item.style,
        "use_emojis": item.use_emojis,
        "platforms": json.loads(item.platforms),
        "created_at": item.created_at,
        "result": json.loads(item.result)
    }
