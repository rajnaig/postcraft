/**
 * PostCraft - AI Social Media Generator
 * Copyright (c) 2025 Gábor Rajnai
 * All rights reserved. Unauthorized use prohibited.
 * 
 * This file is part of PostCraft, a proprietary social media content 
 * generation system developed for technical demonstration purposes.
 * 
 * Contact: rajnaigabor3@gmail.com
 */

import json
import uuid
from datetime import datetime
import httpx
from typing import List, Dict, Any, Optional

from ..config.settings import OPENAI_API_KEY, PLATFORM_SETTINGS
from ..models.schemas import GeneratePostRequest

class LLMService:
    def __init__(self):
        self.api_key = OPENAI_API_KEY
        self.model = "gpt-4-turbo"  # Vagy bármilyen más megfelelő modell
        
    async def generate_posts(self, request: GeneratePostRequest) -> Dict[str, Any]:
        # Egyedi request_id generálása
        request_id = f"gen_{uuid.uuid4().hex[:8]}"
        
        # Platformonként külön-külön generált posztok
        posts = {}
        
        for platform in request.platforms:
            platform_settings = PLATFORM_SETTINGS.get(platform, {})
            
            # Prompt elkészítése
            system_prompt = self._create_system_prompt(platform, platform_settings, request)
            user_prompt = f"Marketing üzenet: {request.message}\\nCélközönség: {request.audience}"
            
            # OpenAI API hívás
            try:
                response = await self._call_openai_api(system_prompt, user_prompt)
                posts[platform] = self._parse_response(response, platform, request.ab_testing)
            except Exception as e:
                print(f"Hiba történt a generálás során: {str(e)}")
                # Egyszerű hibaeset kezelése
                posts[platform] = self._create_error_response(platform)
        
        # Válasz összeállítása
        return {
            "request_id": request_id,
            "generated_at": datetime.now().isoformat(),
            "posts": posts
        }
    
    def _create_system_prompt(self, platform: str, platform_settings: Dict[str, Any], request: GeneratePostRequest) -> str:
        """Rendszer prompt elkészítése a platform és a felhasználói beállítások alapján"""
        system_prompt = f"""
        Te egy professzionális social media szakértő vagy, aki {platform} platformra optimalizált posztokat készít.
        
        Platformspecifikus tudnivalók:
        - Platform: {platform_settings.get('name', platform.capitalize())}
        - Karakterkorlát: {platform_settings.get('char_limit', 2000)} karakter
        - Hashtag limit: {platform_settings.get('hashtag_limit', 5)} hashtag
        - Ajánlott poszt stílus: {platform_settings.get('post_style', 'Általános')}
        
        A felhasználó által kért hangnem és stílus:
        - Hangnem (vibe): {request.vibe}
        - Stílus: {request.style}
        - Emojik használata: {'Igen' if request.use_emojis else 'Nem'}
        
        Feladatod:
        1. Hozz létre {'két különböző kreatív változatot' if request.ab_testing else 'egy kreatív változatot'} a marketing üzenetből a {platform} platformra.
        2. A szöveg legyen magyar nyelvű, nyelvtanilag helyes.
        3. Tartsd be a platform karakterkorlátját.
        4. {'Használj releváns hashtageket.' if platform_settings.get('hashtag_limit', 0) > 0 else 'Ne használj hashtageket.'}
        5. {'Használj emojikat, ahol releváns.' if request.use_emojis else 'Ne használj emojikat.'}
        
        {f"6. Adj két kreatív képjavaslatot a poszthoz." if platform == "instagram" else ""}
        
        A választ JSON formátumban add meg, a következő struktúrában:
        
        ```json
        {{
          "versions": [
            {{
              "text": "A generált poszt szövege",
              "hashtags": ["hashtag1", "hashtag2"]
              {'"image_suggestions": ["Első képjavaslat", "Második képjavaslat"]' if platform == "instagram" else ""}
            }}
            {', {{ "text": "Második verzió szövege", "hashtags": ["hashtag1", "hashtag2"] }}' if request.ab_testing else ""}
          ]
        }}
        ```
        """
        
        return system_prompt
    
    async def _call_openai_api(self, system_prompt: str, user_prompt: str) -> str:
        """OpenAI API hívás végrehajtása"""
        if not self.api_key or self.api_key == "your_openai_api_key_here":
            # Ha nincs API kulcs, akkor példa választ adunk
            return self._generate_mock_response()
            
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.7
            }
            
            response = await client.post(
                "https://api.openai.com/v1/chat/completions", 
                headers=headers, 
                json=payload,
                timeout=60.0  # 60 másodperces timeout
            )
            
            if response.status_code != 200:
                raise Exception(f"OpenAI API hiba: {response.text}")
            
            json_response = response.json()
            return json_response["choices"][0]["message"]["content"]
    
    def _generate_mock_response(self) -> str:
        """Példa választ generál API kulcs hiányában"""
        return '''
        ```json
        {
          "versions": [
            {
              "text": "Ízelítő abból, amit a PostCraft tud! Kérjük, add meg a valódi OpenAI API kulcsodat a .env fájlban a valódi eredményekhez! ✨",
              "hashtags": ["#AIMarketing", "#PostCraft", "#Demo"]
            },
            {
              "text": "Ez egy példa második verzió! A valódi API kulcs hozzáadásával személyre szabott eredményeket kapsz minden platformra. 🚀",
              "hashtags": ["#SocialMediaAI", "#ContentCreation", "#TesztVerzió"]
            }
          ]
        }
        ```
        '''
    
    def _parse_response(self, response_text: str, platform: str, ab_testing: bool) -> Dict[str, Any]:
        """Az LLM válaszának feldolgozása"""
        # A JSON kinyerése a válaszból (ha van körülötte backtick vagy más szöveg)
        try:
            # Egyszerű JSON kinyerési kísérlet
            json_start = response_text.find('```json')
            if json_start != -1:
                json_content = response_text[json_start + 7:]
                json_end = json_content.find('```')
                if json_end != -1:
                    json_content = json_content[:json_end]
            else:
                json_content = response_text
                
            # Tisztítás és feldolgozás
            json_content = json_content.strip()
            data = json.loads(json_content)
            
            # Válasz struktúra kialakítása
            versions = []
            for i, version in enumerate(data.get("versions", [])):
                version_id = f"{platform[0:2]}_{chr(97 + i)}"  # pl. "fb_a", "fb_b"
                versions.append({
                    "id": version_id,
                    "text": version.get("text", ""),
                    "hashtags": version.get("hashtags", []),
                    **({"image_suggestions": version.get("image_suggestions", [])} if platform == "instagram" else {})
                })
            
            # Karakterek számolása (az első verzióból)
            char_count = len(versions[0]["text"]) if versions else 0
            
            return {
                "versions": versions,
                "tips": {
                    "optimal_posting_time": self._get_optimal_posting_time(platform),
                    "character_count": char_count
                }
            }
            
        except Exception as e:
            print(f"Hiba a válasz feldolgozása során: {str(e)}")
            return self._create_error_response(platform)
    
    def _create_error_response(self, platform: str) -> Dict[str, Any]:
        """Hibaválasz készítése"""
        return {
            "versions": [
                {
                    "id": f"{platform[0:2]}_error",
                    "text": "Sajnos hiba történt a poszt generálása során. Kérjük, próbáld újra!",
                    "hashtags": []
                }
            ],
            "tips": {
                "optimal_posting_time": None,
                "character_count": 0
            }
        }
    
    def _get_optimal_posting_time(self, platform: str) -> str:
        """Optimális posztolási idő meghatározása platformonként"""
        optimal_times = {
            "facebook": "17:00-20:00 (hétköznap)",
            "instagram": "12:00-15:00, 19:00-21:00",
            "linkedin": "9:00-11:00, 16:00-18:00 (kedd-csütörtök)",
            "x": "12:00-13:00, 17:00-18:00"
        }
        return optimal_times.get(platform, "Nincs ajánlott időpont")