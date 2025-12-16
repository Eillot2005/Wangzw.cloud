from pydantic import BaseModel, Field
from typing import Any, Optional


class ExternalApiRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=5000)


class ExternalApiResponse(BaseModel):
    text: str
    raw: dict
