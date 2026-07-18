"""Staff schemas – request body for creating/updating staff members."""
from pydantic import BaseModel
from typing import Optional


class StaffIn(BaseModel):
    """Request body for POST /api/staff."""
    workspace_id: str
    name: str
    role: Optional[str] = "Reception"
    phone: Optional[str] = ""
    email: Optional[str] = ""
    shift: Optional[str] = "Day"
    status: Optional[str] = "active"
