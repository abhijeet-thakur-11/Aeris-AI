from openai import OpenAI
from app.core.config import settings
import logging
import json

logger = logging.getLogger(__name__)

# Initialize the OpenAI client for NVIDIA NIM
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=settings.NVIDIA_API_KEY
)

def analyze_incident_image(image_b64: str):
    """
    Analyzes an uploaded image using Llama 3.2 11B Vision Instruct on NVIDIA NIM.
    Returns a structured JSON categorization of the pollution incident.
    """
    if not settings.NVIDIA_API_KEY:
        logger.error("NVIDIA_API_KEY is missing.")
        return None

    try:
        response = client.chat.completions.create(
            model="meta/llama-3.2-11b-vision-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyze this image and identify if it shows an environmental pollution incident. Respond ONLY with a valid JSON object matching this schema: {\"type\": string, \"confidence\": number (0-100), \"severity\": string (Low/Medium/High/Critical), \"description\": string, \"recommended_action\": string}. Supported types: 'Garbage Burning', 'Construction Dust', 'Industrial Smoke', 'Vehicle Pollution', 'Open Fire', 'Unknown'."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_b64}"
                            }
                        }
                    ]
                }
            ],
            temperature=0.2,
            max_tokens=512,
        )
        
        result_text = response.choices[0].message.content
        # Try to parse the JSON response
        try:
            # Strip markdown code blocks if present
            if result_text.startswith("```json"):
                result_text = result_text[7:-3]
            elif result_text.startswith("```"):
                result_text = result_text[3:-3]
                
            return json.loads(result_text.strip())
        except json.JSONDecodeError:
            logger.error(f"Failed to parse AI response as JSON: {result_text}")
            return None

    except Exception as e:
        logger.error(f"AI Image Analysis failed: {e}")
        return None

def chat_with_assistant(query: str, context: str):
    """
    Responds to a user query using Llama 3.2 based on real-time app context.
    """
    try:
        response = client.chat.completions.create(
            model="meta/llama-3.2-11b-vision-instruct", # Using the same model for text tasks
            messages=[
                {
                    "role": "system",
                    "content": f"You are AERIS AI, an intelligent environmental monitoring assistant. Use the following real-time city data to answer the user's question accurately and concisely.\n\nContext Data:\n{context}"
                },
                {
                    "role": "user",
                    "content": query
                }
            ],
            temperature=0.5,
            max_tokens=512,
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"AI Chat failed: {e}")
        return "I am currently experiencing connectivity issues and cannot process your request at this time."
