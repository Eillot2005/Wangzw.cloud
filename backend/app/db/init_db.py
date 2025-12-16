from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.models.todo import Todo
from app.models.message import Message
from app.models.audit_log import AuditLog
from app.core.security import hash_password
from app.core.config import settings


def init_db():
    """Initialize database and create default users."""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create default users if not exists
    db = SessionLocal()
    try:
        existing_users = db.query(User).count()
        if existing_users == 0:
            # Create admin user
            admin = User(
                username="admin",
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                role="ADMIN",
            )
            db.add(admin)
            
            # Create friend user
            friend = User(
                username="wangzw",
                hashed_password=hash_password(settings.FRIEND_PASSWORD),
                role="FRIEND",
            )
            db.add(friend)
            
            db.commit()
            print("✓ Created default users: admin and wangzw")
        else:
            print("✓ Users already exist, skipping initialization")
    finally:
        db.close()
