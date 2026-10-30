from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.weather_service import get_current_weather

router = APIRouter()

class WeatherResponse(BaseModel):
    temperature: float | None
    humidity: int | None
    wind_speed: float | None
    wind_direction_deg: int | None
    description: str | None

@router.get("/current", response_model=WeatherResponse)
def get_weather(lat: float, lon: float):
    """
    Fetch live weather data (temperature, wind) for a given location.
    """
    weather_data = get_current_weather(lat, lon)
    if not weather_data:
        raise HTTPException(status_code=500, detail="Failed to retrieve weather data")
    
    return WeatherResponse(**weather_data)
