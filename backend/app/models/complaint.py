"""Complaint model – shape of a row from the complaints table."""
from pydantic import BaseModel
from typing import Optional


class ComplaintModel(BaseModel):
    """Represents a complaint returned by the API (matches _fmt output in complaints.py)."""
    id: str
    tenant: str = ""
    room: str = ""
    category: str = ""
    priority: str = "low"
    status: str = "open"    # "open" | "in_progress" | "resolved"
    # Owner-facing fields
    subject: str = ""
    raised: str = ""
    resolvedOn: str = ""
    # Tenant-facing fields
    title: str = ""
    date: str = ""
    note: str = ""
