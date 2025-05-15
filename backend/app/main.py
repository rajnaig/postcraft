# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import router
from .models.database import create_tables

app = FastAPI(title="PostCraft API", version="1.0.0")

# CORS middleware hozzáadása
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API router hozzáadása
app.include_router(router, prefix="/api/v1")

# Adatbázis táblák létrehozása induláskor
@app.on_event("startup")
async def startup_event():
    create_tables()

# Root endpoint
@app.get("/")
async def root():
    return {"message": "PostCraft API is running!"}