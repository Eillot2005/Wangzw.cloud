from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.message import Message
from app.core.security import get_current_user
from app.core.audit import log_action
from app.schemas.message import MessageCreate, MessageResponse

router = APIRouter(prefix="/messages", tags=["messages"])


@router.get("", response_model=List[MessageResponse])
def list_messages(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all messages (admin and friend can see all messages)."""
    messages = db.query(Message).order_by(
        Message.created_at.desc()
    ).limit(limit).offset(offset).all()
    
    # Add sender username to each message
    result = []
    for msg in messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        msg_response = MessageResponse.from_orm(msg)
        msg_response.sender_username = sender.username if sender else "Unknown"
        result.append(msg_response)
    
    return result


@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new message (admin and friend)."""
    new_message = Message(
        sender_id=current_user.id,
        content=message.content
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    # Log action
    log_action(
        db=db,
        user_id=current_user.id,
        action="MESSAGE_CREATE",
        resource_type="message",
        resource_id=str(new_message.id),
        meta_json={"content_length": len(message.content)}
    )
    
    # Add sender username
    msg_response = MessageResponse.from_orm(new_message)
    msg_response.sender_username = current_user.username
    
    return msg_response


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a message. Friend can only delete own messages, admin can delete any."""
    message = db.query(Message).filter(Message.id == message_id).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Check permissions
    if current_user.role != "ADMIN" and message.sender_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only delete your own messages"
        )
    
    # Log action
    log_action(
        db=db,
        user_id=current_user.id,
        action="MESSAGE_DELETE",
        resource_type="message",
        resource_id=str(message.id),
        meta_json={
            "deleted_by_admin": current_user.role == "ADMIN",
            "original_sender_id": message.sender_id
        }
    )
    
    db.delete(message)
    db.commit()
    
    return None
