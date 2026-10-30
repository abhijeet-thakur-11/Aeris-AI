import requests
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

def get_current_weather(lat: float, lon: float):
    if not settings.OPENWEATHER_API_KEY:
        logger.error("OpenWeather API key is not configured.")
        return None

    # Using OpenWeatherMap Current Weather Data API
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={settings.OPENWEATHER_API_KEY}&units=metric"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        # Parse relevant data for AERIS AI (Wind Speed, Direction, Temp, Humidity)
        return {
            "temperature": data.get("main", {}).get("temp"),
            "humidity": data.get("main", {}).get("humidity"),
            "wind_speed": data.get("wind", {}).get("speed"),  # m/s
            "wind_direction_deg": data.get("wind", {}).get("deg"),
            "description": data.get("weather", [{}])[0].get("description")
        }
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to fetch weather data: {e}")
        return None
