"""Tenant schemas – request body for creating/updating tenants."""
from pydantic import BaseModel
from typing import Optional


class TenantIn(BaseModel):
    """Request body for POST /api/tenants."""
    workspace_id: str
    name: str
    room: Optional[str] = ""
    phone: Optional[str] = ""
    email: Optional[str] = ""
    since: Optional[str] = ""
    rent: Optional[str] = "due"
    kyc: Optional[str] = "pending"
