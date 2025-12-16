"""
Import pictures from Picture/ folder to database and uploads/ folder.
This script runs during deployment to restore photos.
"""
import os
import shutil
from pathlib import Path
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.photo import Photo, PhotoStatus
from app.models.user import User
from app.db.base import Base

def import_pictures():
    """Import all pictures from Picture/ folder."""
    
    # Get database URL
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("Warning: DATABASE_URL not set, using local SQLite")
        database_url = "sqlite:///./friendapp.db"
    
    # PostgreSQL URL fix (psycopg2 driver)
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    
    # Create engine and session
    engine = create_engine(database_url)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # Ensure tables exist
        Base.metadata.create_all(bind=engine)
        
        # Find admin user (uploader_id)
        admin = db.query(User).filter(User.role == "ADMIN").first()
        if not admin:
            print("Warning: No admin user found, skipping import")
            return
        
        print(f"Found admin user: {admin.username} (id={admin.id})")
        
        # Setup directories
        picture_dir = Path("Picture")
        if not picture_dir.exists():
            picture_dir = Path("../Picture")  # Try parent directory
        
        uploads_dir = Path("uploads")
        if not uploads_dir.exists():
            uploads_dir = Path("backend/uploads")
        uploads_dir.mkdir(parents=True, exist_ok=True)
        
        if not picture_dir.exists():
            print(f"Warning: Picture directory not found at {picture_dir.absolute()}")
            return
        
        print(f"Picture directory: {picture_dir.absolute()}")
        print(f"Uploads directory: {uploads_dir.absolute()}")
        
        # Import each picture
        imported_count = 0
        skipped_count = 0
        
        for file_path in picture_dir.iterdir():
            if not file_path.is_file():
                continue
            
            # Check file extension
            ext = file_path.suffix.lower()
            if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
                print(f"Skipping non-image file: {file_path.name}")
                continue
            
            filename = file_path.name
            
            # Check if already in database
            existing = db.query(Photo).filter(Photo.filename == filename).first()
            if existing:
                print(f"Skipping existing photo: {filename}")
                skipped_count += 1
                
                # Ensure file exists in uploads/
                dest_path = uploads_dir / filename
                if not dest_path.exists():
                    shutil.copy2(file_path, dest_path)
                    print(f"  → Restored file to uploads/")
                continue
            
            # Copy file to uploads/
            dest_path = uploads_dir / filename
            shutil.copy2(file_path, dest_path)
            
            # Create database record
            photo = Photo(
                filename=filename,
                uploader_id=admin.id,
                status=PhotoStatus.APPROVED,
                created_at=datetime.utcnow(),
                reviewed_at=datetime.utcnow(),
                reviewed_by=admin.id
            )
            db.add(photo)
            
            print(f"Imported: {filename}")
            imported_count += 1
        
        # Commit all changes
        db.commit()
        
        print(f"\n✓ Import completed!")
        print(f"  Imported: {imported_count} photos")
        print(f"  Skipped: {skipped_count} photos (already in database)")
        
    except Exception as e:
        print(f"Error during import: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    import_pictures()
