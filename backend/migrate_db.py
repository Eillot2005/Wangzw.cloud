import sys
import os
from sqlalchemy import text

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine, SessionLocal
from app.models.user import User
from app.models.photo import Photo
from app.core.config import settings

def migrate():
    print("Starting database migration...")
    
    # 1. Create new tables (photos)
    # This will only create tables that don't exist
    from app.db.base import Base
    Base.metadata.create_all(bind=engine)
    print("✓ Created new tables (if missing)")

    # 2. Alter existing tables (messages)
    # Use separate transactions for each column to avoid transaction rollback issues
    
    # Check and add receiver_id
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT receiver_id FROM messages LIMIT 1"))
            print("✓ 'receiver_id' column already exists")
    except Exception:
        print("Adding 'receiver_id' column...")
        try:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE messages ADD COLUMN receiver_id INTEGER"))
            print("✓ Added 'receiver_id' column")
        except Exception as e:
            print(f"Note: {e}")
    
    # Check and add read_at
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT read_at FROM messages LIMIT 1"))
            print("✓ 'read_at' column already exists")
    except Exception:
        print("Adding 'read_at' column...")
        try:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE messages ADD COLUMN read_at TIMESTAMP"))
            print("✓ Added 'read_at' column")
        except Exception as e:
            print(f"Note: {e}")

    # 3. Backfill receiver_id for existing messages
    print("Backfilling receiver_id...")
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == "admin").first()
        friend = db.query(User).filter(User.username == "wangzw").first()
        
        if admin and friend:
            # Count messages that need backfilling
            result = db.execute(text("SELECT COUNT(*) FROM messages WHERE receiver_id IS NULL"))
            count = result.scalar()
            
            if count > 0:
                # Messages from admin -> friend
                db.execute(
                    text("UPDATE messages SET receiver_id = :friend_id WHERE sender_id = :admin_id AND receiver_id IS NULL"),
                    {"friend_id": friend.id, "admin_id": admin.id}
                )
                
                # Messages from friend -> admin
                db.execute(
                    text("UPDATE messages SET receiver_id = :admin_id WHERE sender_id = :friend_id AND receiver_id IS NULL"),
                    {"admin_id": admin.id, "friend_id": friend.id}
                )
                
                db.commit()
                print(f"✓ Backfilled receiver_id for {count} existing messages")
            else:
                print("✓ No messages need backfilling")
        else:
            print("⚠ Could not find admin or friend user for backfilling")
    except Exception as e:
        print(f"Note during backfilling: {e}")
        db.rollback()
    finally:
        db.close()
        
    print("Migration completed!")

if __name__ == "__main__":
    migrate()
