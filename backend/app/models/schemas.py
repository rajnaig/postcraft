# backend/app/models/schemas.py
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

# Bemeneti modellek
class GeneratePostRequest(BaseModel):
    message: str = Field(..., description="Az eredeti marketing üzenet")
    audience: str = Field(..., description="Célközönség leírása")
    vibe: str = Field(..., description="A poszt hangulata/vibe-ja")
    style: str = Field(..., description="A poszt stílusa")
    use_emojis: bool = Field(True, description="Emojik használata")
    platforms: List[str] = Field(..., description="A platformok listája")
    ab_testing: bool = Field(False, description="A/B tesztelés engedélyezése")
    include_scheduling: bool = Field(False, description="Ütemezési javaslatok kérése")

# Kimeneti modellek
class PostVersion(BaseModel):
    id: str
    text: str
    hashtags: List[str] = []
    image_suggestions: Optional[List[str]] = None

class PlatformTips(BaseModel):
    optimal_posting_time: Optional[str] = None
    character_count: int

class PlatformPost(BaseModel):
    versions: List[PostVersion]
    tips: PlatformTips

class GeneratePostResponse(BaseModel):
    request_id: str
    generated_at: str
    posts: Dict[str, PlatformPost]

# Konfiguráció modellek
class PlatformConfig(BaseModel):
    id: str
    name: str
    char_limit: int
    image_size: str
    hashtag_limit: int
    
class OptionItem(BaseModel):
    id: str
    name: str
    description: str

class OptionsResponse(BaseModel):
    vibe_options: List[OptionItem]
    style_options: List[OptionItem]

class PlatformsResponse(BaseModel):
    platforms: List[PlatformConfig]

# Profil modellek
class ProfileBase(BaseModel):
    name: str
    description: Optional[str] = None
    settings: Dict[str, Any]

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass

class Profile(ProfileBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime
    updated_at: datetime