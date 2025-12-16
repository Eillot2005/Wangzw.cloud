from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token, get_current_user
from app.core.audit import log_action
from app.schemas.auth import LoginRequest, LoginResponse, UserInfo

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login endpoint - only admin and friend can login."""
    # Find user
    user = db.query(User).filter(User.username == request.username).first()
    
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    # Create access token (sub must be a string according to JWT spec)
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    
    # Log login action
    log_action(
        db=db,
        user_id=user.id,
        action="LOGIN",
        resource_type="auth",
        resource_id=None,
        meta_json={"username": user.username}
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        role=user.role
    )


@router.get("/me", response_model=UserInfo)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return UserInfo(
        id=current_user.id,
        username=current_user.username,
        role=current_user.role
    )
