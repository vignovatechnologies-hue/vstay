"""Document schemas – request body for creating/updating tenant documents."""
from pydantic import BaseModel
from typing import Optional


class DocumentIn(BaseModel):
    """Request body for POST /api/documents."""
    user_id: str
    workspace_id: Optional[str] = None
    name: Optional[str] = ""
    type: Optional[str] = ""
    size: Optional[str] = ""
    uploaded: Optional[str] = ""
    status: Optional[str] = "pending"
