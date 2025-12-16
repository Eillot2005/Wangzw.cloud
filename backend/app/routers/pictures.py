from typing import List
import mimetypes
import os
from urllib.parse import unquote
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.core.security import get_current_user, decode_access_token
from app.core.audit import log_action
from app.schemas.picture import PictureInfo
from app.services.picture import list_pictures, get_picture_path

router = APIRouter(prefix="/pictures", tags=["pictures"])


def get_current_user_from_query(
    token: str = Query(..., description="Access token for image authentication"),
    db: Session = Depends(get_db)
) -> User:
    """
    Authenticate user via query parameter token (for <img> tags).
    """
    try:
        # Handle "Bearer " prefix if present (though usually not in query param)
        if token.startswith("Bearer "):
            token = token.split(" ")[1]
            
        payload = decode_access_token(token)
        user_id_str = payload.get("sub")
        
        if user_id_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
        
        # Convert string back to int
        try:
            user_id = int(user_id_str)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user ID in token",
            )
        
        user = db.query(User).filter(User.id == user_id).first()
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        return user
    except HTTPException:
        raise
    except Exception as e:
        print(f"Auth error: {str(e)}") # Simple logging
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )


@router.get("", response_model=List[PictureInfo])
def get_pictures(
    current_user: User = Depends(get_current_user)
):
    """List all pictures (requires authentication)."""
    return list_pictures()


@router.get("/{filename}")
def get_picture(
    filename: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_query)
):
    """
    Get a specific picture by filename (requires authentication via query param).
    Returns the image as a FileResponse.
    """
    try:
        # Decode filename (handle URL encoding)
        decoded_filename = unquote(filename)
        # print(f"Requested filename: {filename}, Decoded: {decoded_filename}")
        
        # Get picture path with safety checks
        file_path = get_picture_path(decoded_filename)
        
        # Log picture view action (especially for friend)
        try:
            log_action(
                db=db,
                user_id=current_user.id,
                action="PICTURE_VIEW",
                resource_type="picture",
                resource_id=decoded_filename,
                meta_json={
                    "size": file_path.stat().st_size,
                    "user_role": current_user.role
                }
            )
        except Exception as e:
            print(f"Logging error (non-fatal): {repr(e)}")

        # Determine content type
        content_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
        
        return FileResponse(
            path=file_path,
            media_type=content_type,
            filename=file_path.name
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get picture error: {repr(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
