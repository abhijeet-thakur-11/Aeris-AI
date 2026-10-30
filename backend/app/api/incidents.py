from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.services.supabase_client import get_supabase_client

router = APIRouter()
supabase = get_supabase_client()

@router.get("/")
def get_incidents():
    """
    Fetch all active incidents.
    """
    try:
        res = supabase.table("incidents").select("*").eq("status", "Active").execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
