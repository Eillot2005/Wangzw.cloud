from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    done: Optional[bool] = None


class TodoResponse(BaseModel):
    id: int
    owner_id: int
    title: str
    done: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
