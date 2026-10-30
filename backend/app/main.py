from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import weather, chat, upload, incidents

app = FastAPI(
    title="AERIS AI Backend",
    description="API for the AERIS AI environmental intelligence platform",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router, prefix="/api/weather", tags=["weather"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["incidents"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AERIS AI API"}
