from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AuditLogResponse(BaseModel):
    id: int
    user_id: int
    action: str
    resource_type: str
    resource_id: Optional[str]
    meta_json: Optional[dict]
    created_at: datetime
    username: str = ""
    
    class Config:
        from_attributes = True
