import os
import mimetypes
from pathlib import Path
from typing import List
from fastapi import HTTPException
from app.schemas.picture import PictureInfo

PICTURE_DIR = Path(__file__).parent.parent.parent / "Picture"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}


def get_picture_directory() -> Path:
    """Get the Picture directory path."""
    if not PICTURE_DIR.exists():
        raise HTTPException(status_code=500, detail="Picture directory not found")
    return PICTURE_DIR


def is_safe_filename(filename: str) -> bool:
    """Check if filename is safe (no path traversal)."""
    # Disallow .. and absolute paths
    if ".." in filename or filename.startswith("/") or filename.startswith("\\"):
        return False
    # Check extension
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        return False
    return True


def list_pictures() -> List[PictureInfo]:
    """List all pictures in the Picture directory."""
    picture_dir = get_picture_directory()
    pictures = []
    
    for file_path in picture_dir.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in ALLOWED_EXTENSIONS:
            content_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
            stat = file_path.stat()
            pictures.append(PictureInfo(
                name=file_path.name,
                size=stat.st_size,
                content_type=content_type,
                created_at=stat.st_mtime
            ))
    
    return sorted(pictures, key=lambda x: x.created_at, reverse=True)


def get_picture_path(filename: str) -> Path:
    """Get full path for a picture file, with safety checks."""
    if not is_safe_filename(filename):
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    picture_dir = get_picture_directory()
    file_path = picture_dir / filename
    
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Picture not found")
    
    # Additional safety: ensure file is actually within Picture directory
    try:
        file_path.resolve().relative_to(picture_dir.resolve())
    except ValueError:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return file_path
