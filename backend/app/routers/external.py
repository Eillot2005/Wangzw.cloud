from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.core.security import get_current_user
from app.core.audit import log_action
from app.core.rate_limit import rate_limiter
from app.schemas.external import ExternalApiRequest, ExternalApiResponse
from app.services.external_api import call_external_api, extract_text_from_response

router = APIRouter(prefix="/external", tags=["external"])


@router.post("/call", response_model=ExternalApiResponse)
async def call_external(
    request: ExternalApiRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Call external paid API with HARDCODED parameters.
    Only the prompt is provided by the user.
    Rate limited to 20 requests per minute per user.
    """
    # Check rate limit
    rate_limiter.check_rate_limit(current_user.id)
    
    start_time = datetime.utcnow()
    
    try:
        # Call external API
        raw_response = await call_external_api(request.prompt)
        
        # Extract text
        text = extract_text_from_response(raw_response)
        
        # Calculate latency
        end_time = datetime.utcnow()
        latency_ms = int((end_time - start_time).total_seconds() * 1000)
        
        # Log action (without sensitive data)
        log_action(
            db=db,
            user_id=current_user.id,
            action="EXTERNAL_CALL",
            resource_type="external",
            resource_id=None,
            meta_json={
                "latency_ms": latency_ms,
                "status": "success",
                "prompt_length": len(request.prompt),
                "response_length": len(text)
            }
        )
        
        return ExternalApiResponse(
            text=text,
            raw=raw_response
        )
        
    except Exception as e:
        # Log error
        end_time = datetime.utcnow()
        latency_ms = int((end_time - start_time).total_seconds() * 1000)
        
        log_action(
            db=db,
            user_id=current_user.id,
            action="EXTERNAL_CALL",
            resource_type="external",
            resource_id=None,
            meta_json={
                "latency_ms": latency_ms,
                "status": "error",
                "error_type": type(e).__name__
            }
        )
        
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"External API call failed: {str(e)}"
        )
