from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.models.todo import Todo
from app.core.security import get_current_user, require_role
from app.core.audit import log_action
from app.schemas.todo import TodoCreate, TodoUpdate, TodoResponse

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("", response_model=List[TodoResponse])
def list_todos(
    done: Optional[int] = Query(None, description="Filter by done status: 0 or 1"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["FRIEND"]))
):
    """List all todos for the current user (friend only)."""
    query = db.query(Todo).filter(Todo.owner_id == current_user.id)
    
    if done is not None:
        query = query.filter(Todo.done == bool(done))
    
    todos = query.order_by(Todo.created_at.desc()).all()
    return todos


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo: TodoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["FRIEND"]))
):
    """Create a new todo (friend only)."""
    new_todo = Todo(
        owner_id=current_user.id,
        title=todo.title,
        done=False
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    
    # Log action
    log_action(
        db=db,
        user_id=current_user.id,
        action="TODO_CREATE",
        resource_type="todo",
        resource_id=str(new_todo.id),
        meta_json={"title": todo.title[:100]}
    )
    
    return new_todo


@router.patch("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    update: TodoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["FRIEND"]))
):
    """Update a todo (friend only)."""
    todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.owner_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Update fields
    if update.title is not None:
        todo.title = update.title
    if update.done is not None:
        todo.done = update.done
    
    todo.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(todo)
    
    # Log action
    log_action(
        db=db,
        user_id=current_user.id,
        action="TODO_UPDATE",
        resource_type="todo",
        resource_id=str(todo.id),
        meta_json={
            "title": todo.title[:100],
            "done": todo.done
        }
    )
    
    return todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["FRIEND"]))
):
    """Delete a todo (friend only)."""
    todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.owner_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Log action before deletion
    log_action(
        db=db,
        user_id=current_user.id,
        action="TODO_DELETE",
        resource_type="todo",
        resource_id=str(todo.id),
        meta_json={"title": todo.title[:100]}
    )
    
    db.delete(todo)
    db.commit()
    
    return None
