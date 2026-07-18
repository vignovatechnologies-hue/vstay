"""Laundry schemas – request body for creating/updating laundry bookings."""
from pydantic import BaseModel
from typing import Optional


class LaundryIn(BaseModel):
    """Request body for POST /api/laundry."""
    user_id: str
    workspace_id: Optional[str] = None
    date: Optional[str] = ""
    slot: Optional[str] = ""
    service: Optional[str] = "Wash & dry"
    machine: Optional[str] = "Machine 1"
    status: Optional[str] = "upcoming"
