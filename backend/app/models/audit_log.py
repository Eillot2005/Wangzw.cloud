from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text
from datetime import datetime
from app.db.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    action = Column(String(50), nullable=False, index=True)  # LOGIN, TODO_CREATE, etc.
    resource_type = Column(String(50), nullable=False)  # auth, todo, message, external, picture
    resource_id = Column(String(200), nullable=True)  # todo_id, message_id, filename, etc.
    meta_json = Column(JSON, nullable=True)  # Additional metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
