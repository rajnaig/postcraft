import uvicorn
from app.config.settings import APP_PORT

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=APP_PORT, reload=True)