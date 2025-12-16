from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def log_action(
    db: Session,
    user_id: int,
    action: str,
    resource_type: str,
    resource_id: Optional[str] = None,
    meta_json: Optional[dict] = None,
):
    """Create an audit log entry."""
    audit_log = AuditLog(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        meta_json=meta_json or {},
        created_at=datetime.utcnow(),
    )
    db.add(audit_log)
    db.commit()
