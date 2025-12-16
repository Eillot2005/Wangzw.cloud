from pydantic import BaseModel, Field
from datetime import datetime


class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    content: str
    created_at: datetime
    sender_username: str = ""
    
    class Config:
        from_attributes = True
