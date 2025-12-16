from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from datetime import datetime
from app.db.base import Base
import enum

class PhotoStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class Photo(Base):
    __tablename__ = "photos"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False, unique=True)
    uploader_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default=PhotoStatus.PENDING, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    reviewed_at = Column(DateTime, nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
