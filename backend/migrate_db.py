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
    # SQLite doesn't support simple ALTER TABLE for adding columns with constraints easily in all versions,
    # but for adding nullable columns it's usually fine.
    # We'll use raw SQL for simplicity as we don't have Alembic set up.
    
    with engine.connect() as conn:
        # Check if columns exist in messages
        try:
            # Try to select the new columns to see if they exist
            conn.execute(text("SELECT receiver_id, read_at FROM messages LIMIT 1"))
            print("✓ 'messages' table already has new columns")
        except Exception:
            print("Adding columns to 'messages' table...")
            try:
                conn.execute(text("ALTER TABLE messages ADD COLUMN receiver_id INTEGER REFERENCES users(id)"))
                conn.execute(text("ALTER TABLE messages ADD COLUMN read_at DATETIME"))
                conn.commit()
                print("✓ Added 'receiver_id' and 'read_at' to 'messages'")
            except Exception as e:
                print(f"Error altering table: {e}")

    # 3. Backfill receiver_id for existing messages
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == "admin").first()
        friend = db.query(User).filter(User.username == "wangzw").first()
        
        if admin and friend:
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
            print("✓ Backfilled receiver_id for existing messages")
    except Exception as e:
        print(f"Error backfilling data: {e}")
    finally:
        db.close()
        
    print("Migration completed!")

if __name__ == "__main__":
    migrate()
