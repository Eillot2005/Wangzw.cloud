from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta

from app.db.session import get_db
from app.models.user import User
from app.models.todo import Todo
from app.models.message import Message
from app.models.audit_log import AuditLog
from app.core.security import require_role
from app.core.audit import log_action
from app.schemas.todo import TodoResponse
from app.schemas.message import MessageResponse
from app.schemas.audit_log import AuditLogResponse

from app.models.photo import Photo, PhotoStatus

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/overview")
def get_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Get overview dashboard statistics (admin only)."""
    # Get friend user
    friend = db.query(User).filter(User.username == "wangzw").first()
    if not friend:
        raise HTTPException(status_code=404, detail="Friend user not found")
    
    # Todo stats
    todo_total = db.query(Todo).filter(Todo.owner_id == friend.id).count()
    todo_open = db.query(Todo).filter(
        and_(Todo.owner_id == friend.id, Todo.done == False)
    ).count()
    
    # Message stats
    message_total = db.query(Message).count()
    
    # External API call stats
    today = datetime.utcnow().date()
    last_7d = datetime.utcnow() - timedelta(days=7)
    
    external_call_today = db.query(AuditLog).filter(
        and_(
            AuditLog.user_id == friend.id,
            AuditLog.action == "EXTERNAL_CALL",
            func.date(AuditLog.created_at) == today
        )
    ).count()
    
    external_call_last_7d = db.query(AuditLog).filter(
        and_(
            AuditLog.user_id == friend.id,
            AuditLog.action == "EXTERNAL_CALL",
            AuditLog.created_at >= last_7d
        )
    ).count()
    
    # Photo stats (Pending)
    pending_photos = db.query(Photo).filter(Photo.status == PhotoStatus.PENDING).count()
    
    # Last actions (Exclude PICTURE_VIEW)
    last_actions = db.query(AuditLog).filter(
        and_(
            AuditLog.user_id == friend.id,
            AuditLog.action != "PICTURE_VIEW"
        )
    ).order_by(AuditLog.created_at.desc()).limit(10).all()
    
    last_actions_data = []
    for log in last_actions:
        last_actions_data.append({
            "id": log.id,
            "action": log.action,
            "resource_type": log.resource_type,
            "created_at": log.created_at.isoformat()
        })
    
    return {
        "todo_total": todo_total,
        "todo_open": todo_open,
        "message_total": message_total,
        "external_call_today": external_call_today,
        "external_call_last_7d": external_call_last_7d,
        "pending_photos": pending_photos,
        "last_actions": last_actions_data
    }


@router.get("/audit", response_model=List[AuditLogResponse])
def get_audit_logs(
    action: Optional[str] = Query(None, description="Filter by action"),
    exclude_actions: Optional[str] = Query("PICTURE_VIEW", description="Comma separated actions to exclude"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Get audit logs with optional filters (admin only)."""
    query = db.query(AuditLog)
    
    # Apply filters
    if action:
        query = query.filter(AuditLog.action == action)
    
    if exclude_actions:
        excludes = [a.strip() for a in exclude_actions.split(",")]
        query = query.filter(AuditLog.action.notin_(excludes))
    
    if start_date:
        try:
            start = datetime.fromisoformat(start_date)
            query = query.filter(AuditLog.created_at >= start)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid start_date format")
    
    if end_date:
        try:
            end = datetime.fromisoformat(end_date)
            query = query.filter(AuditLog.created_at <= end)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid end_date format")
    
    logs = query.order_by(AuditLog.created_at.desc()).limit(limit).offset(offset).all()
    
    # Add username to each log
    result = []
    for log in logs:
        user = db.query(User).filter(User.id == log.user_id).first()
        log_response = AuditLogResponse.from_orm(log)
        log_response.username = user.username if user else "Unknown"
        result.append(log_response)
    
    return result

# Photo Review Endpoints

@router.get("/photos/pending", response_model=List[dict])
def list_pending_photos(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """List all pending photos for review."""
    photos = db.query(Photo).filter(Photo.status == PhotoStatus.PENDING).order_by(Photo.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "filename": p.filename,
            "created_at": p.created_at,
            "uploader_id": p.uploader_id
        }
        for p in photos
    ]

@router.post("/photos/{photo_id}/approve")
def approve_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Approve a photo."""
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
        
    photo.status = PhotoStatus.APPROVED
    photo.reviewed_at = datetime.utcnow()
    photo.reviewed_by = current_user.id
    db.commit()
    
    log_action(db, current_user.id, "PHOTO_APPROVE", "PHOTO", str(photo.id))
    return {"status": "success"}

@router.post("/photos/{photo_id}/reject")
def reject_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Reject a photo."""
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
        
    photo.status = PhotoStatus.REJECTED
    photo.reviewed_at = datetime.utcnow()
    photo.reviewed_by = current_user.id
    db.commit()
    
    log_action(db, current_user.id, "PHOTO_REJECT", "PHOTO", str(photo.id))
    return {"status": "success"}



@router.get("/friend/todos", response_model=List[TodoResponse])
def get_friend_todos(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Get all todos for friend user (admin only)."""
    friend = db.query(User).filter(User.username == "wangzw").first()
    if not friend:
        raise HTTPException(status_code=404, detail="Friend user not found")
    
    todos = db.query(Todo).filter(
        Todo.owner_id == friend.id
    ).order_by(Todo.created_at.desc()).all()
    
    return todos


@router.delete("/friend/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_friend_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Delete a friend's todo (admin only)."""
    friend = db.query(User).filter(User.username == "friend").first()
    if not friend:
        raise HTTPException(status_code=404, detail="Friend user not found")
    
    todo = db.query(Todo).filter(
        and_(Todo.id == todo_id, Todo.owner_id == friend.id)
    ).first()
    
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Log action
    log_action(
        db=db,
        user_id=current_user.id,
        action="TODO_DELETE",
        resource_type="todo",
        resource_id=str(todo.id),
        meta_json={
            "deleted_by_admin": True,
            "title": todo.title[:100]
        }
    )
    
    db.delete(todo)
    db.commit()
    
    return None


@router.get("/friend/messages", response_model=List[MessageResponse])
def get_friend_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Get all messages (admin view with sender info)."""
    messages = db.query(Message).order_by(Message.created_at.desc()).all()
    
    # Add sender username
    result = []
    for msg in messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        msg_response = MessageResponse.from_orm(msg)
        msg_response.sender_username = sender.username if sender else "Unknown"
        result.append(msg_response)
    
    return result
