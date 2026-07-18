"""Room schemas – request body for creating/updating rooms."""
from pydantic import BaseModel
from typing import Optional


class RoomIn(BaseModel):
    """Request body for POST /api/rooms."""
    workspace_id: str
    room: str
    floor: Optional[str] = "Ground"
    type: Optional[str] = "Single"
    rent: Optional[str] = ""
    beds: Optional[str] = "0/1"
    status: Optional[str] = "vacant"
