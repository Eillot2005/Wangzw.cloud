import httpx
from typing import Any, Dict
from app.core.config import settings

# HARDCODED VALUES - DO NOT ALLOW FRONTEND TO OVERRIDE
HARDCODED_MODEL_NAME = "gpt-3.5-turbo"
HARDCODED_SYSTEM_PROMPT = "You are a helpful AI assistant. Provide clear, concise, and accurate responses."
HARDCODED_TEMPERATURE = 0.7
HARDCODED_MAX_TOKENS = 800


async def call_external_api(prompt: str) -> Dict[str, Any]:
    """
    Call external paid API with hardcoded parameters.
    Only the prompt comes from user input.
    """
    # Build request body with HARDCODED values
    request_body = {
        "model": HARDCODED_MODEL_NAME,
        "messages": [
            {
                "role": "system",
                "content": HARDCODED_SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": HARDCODED_TEMPERATURE,
        "max_tokens": HARDCODED_MAX_TOKENS
    }
    
    headers = {
        "Authorization": f"Bearer {settings.EXTERNAL_API_KEY}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient(timeout=settings.EXTERNAL_API_TIMEOUT_SECONDS) as client:
        response = await client.post(
            settings.EXTERNAL_API_URL,
            json=request_body,
            headers=headers
        )
        response.raise_for_status()
        return response.json()


def extract_text_from_response(raw_response: dict) -> str:
    """Extract text from external API response."""
    try:
        # Common OpenAI-like format
        if "choices" in raw_response and len(raw_response["choices"]) > 0:
            message = raw_response["choices"][0].get("message", {})
            return message.get("content", "")
    except Exception:
        pass
    return ""
