from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import analyze_incident_image
from app.services.supabase_client import get_supabase_client
import uuid
import datetime

router = APIRouter()
supabase = get_supabase_client()

class UploadRequest(BaseModel):
    image_b64: str
    latitude: float
    longitude: float

@router.post("/")
def upload_report(request: UploadRequest):
    # 1. Analyze image via AI
    ai_result = analyze_incident_image(request.image_b64)
    if not ai_result:
        raise HTTPException(status_code=500, detail="AI analysis failed or returned invalid format")
        
    # 2. Extract data
    pollution_type = ai_result.get("type", "Unknown")
    confidence = ai_result.get("confidence", 50)
    severity = ai_result.get("severity", "Medium")
    description = ai_result.get("description", "")
    suggested_action = ai_result.get("recommended_action", "")
    
    # Simple prediction heuristic
    predicted_radius = 1.0
    if severity == "Critical":
        predicted_radius = 3.5
    elif severity == "High":
        predicted_radius = 2.0
        
    # 3. Create incident in Supabase
    incident_data = {
        "id": str(uuid.uuid4()),
        "latitude": request.latitude,
        "longitude": request.longitude,
        "pollution_type": pollution_type,
        "severity": severity,
        "confidence": confidence,
        "description": description,
        "suggested_action": suggested_action,
        "predicted_radius": predicted_radius,
        "status": "Active"
    }
    
    try:
        supabase.table("incidents").insert(incident_data).execute()
        return {"status": "success", "incident": incident_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
