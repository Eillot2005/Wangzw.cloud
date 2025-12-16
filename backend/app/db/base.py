from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import all models here to ensure they are registered with Base
# This is important for Alembic or create_all to work correctly
# from app.models.user import User
# from app.models.todo import Todo
# from app.models.message import Message
# from app.models.audit_log import AuditLog
# from app.models.photo import Photo
