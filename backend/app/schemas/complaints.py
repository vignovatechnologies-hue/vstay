"""Complaint schemas – request body for creating/updating complaints."""
from pydantic import BaseModel
from typing import Optional


class ComplaintIn(BaseModel):
    """Request body for POST /api/complaints."""
    workspace_id: str
    tenant: Optional[str] = ""
    room: Optional[str] = ""
    category: Optional[str] = ""
    priority: Optional[str] = "low"
    status: Optional[str] = "open"
    description: Optional[str] = ""
    subject: Optional[str] = ""
    title: Optional[str] = ""
    raised_on: Optional[str] = ""
    raised: Optional[str] = ""
    date: Optional[str] = ""
