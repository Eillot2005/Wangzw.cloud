import os
import sys
import shutil
import uuid
from datetime import datetime
from pathlib import Path

# Add backend to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.photo import Photo, PhotoStatus

def import_photos():
    db = SessionLocal()
    try:
        # Find admin user
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            print("Admin user not found. Creating photos with uploader_id=1 (fallback).")
            uploader_id = 1
        else:
            uploader_id = admin.id

        source_dir = Path("../Picture")
        target_dir = Path("uploads")
        target_dir.mkdir(parents=True, exist_ok=True)

        if not source_dir.exists():
            print(f"Source directory {source_dir} does not exist.")
            return

        count = 0
        print(f"Scanning {source_dir.absolute()}...")
        
        for file_path in source_dir.glob("*.*"):
            if file_path.suffix.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
                continue

            # Generate new name to avoid encoding issues and collisions
            ext = file_path.suffix.lower()
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            random_str = str(uuid.uuid4())[:8]
            new_filename = f"{timestamp}_{random_str}{ext}"
            
            target_path = target_dir / new_filename
            
            # Copy file
            shutil.copy2(file_path, target_path)
            
            # Create DB record
            # Use file modification time for created_at
            mtime = file_path.stat().st_mtime
            created_at = datetime.fromtimestamp(mtime)

            photo = Photo(
                filename=new_filename,
                uploader_id=uploader_id,
                status=PhotoStatus.APPROVED,
                created_at=created_at
            )
            db.add(photo)
            count += 1
            print(f"Imported {file_path.name} -> {new_filename}")

        db.commit()
        print(f"Successfully imported {count} photos.")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import_photos()
