from supabase import create_client, Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

def get_supabase_client() -> Client:
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        logger.warning("Supabase URL or Key is missing. Database operations will fail.")
        # Return a dummy or raise an exception in a real prod env
        # We'll let it fail at creation if the keys are truly missing
    try:
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        raise e
