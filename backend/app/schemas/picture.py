from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PictureInfo(BaseModel):
    name: str
    size: int
    content_type: str
    created_at: float
    caption: Optional[str] = None
