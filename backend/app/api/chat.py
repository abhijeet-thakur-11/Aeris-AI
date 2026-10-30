from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import chat_with_assistant
from app.services.supabase_client import get_supabase_client
from app.services.weather_service import get_current_weather

router = APIRouter()
supabase = get_supabase_client()

class ChatRequest(BaseModel):
    message: str
    latitude: float | None = 28.6139
    longitude: float | None = 77.2090

class ChatResponse(BaseModel):
    reply: str

@router.post("/", response_model=ChatResponse)
def handle_chat(request: ChatRequest):
    try:
        # Fetch current active incidents for context
        res = supabase.table("incidents").select("pollution_type, severity, latitude, longitude").eq("status", "Active").execute()
        incidents = res.data
        
        context_str = f"Currently there are {len(incidents)} active pollution hotspots. "
        for inc in incidents:
            context_str += f"- {inc.get('pollution_type')} (Severity: {inc.get('severity')}) at {inc.get('latitude')}, {inc.get('longitude')}. "
            
        # Add weather context
        weather = get_current_weather(request.latitude, request.longitude)
        if weather:
            context_str += f"Current weather at location: {weather.get('temperature')}°C, {weather.get('humidity')}% humidity, wind {weather.get('wind_speed')} m/s. "

        # Call Nvidia Llama 3.2 11B Vision Instruct via OpenAI client
        reply = chat_with_assistant(request.message, context_str)
        return ChatResponse(reply=reply)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
