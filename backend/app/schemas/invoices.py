"""Invoice schemas – request body for creating/updating invoices."""
from pydantic import BaseModel
from typing import Optional


class InvoiceIn(BaseModel):
    """Request body for POST /api/invoices."""
    workspace_id: str
    tenant: Optional[str] = ""
    room: Optional[str] = ""
    month: Optional[str] = ""
    amount: Optional[str] = ""
    date: Optional[str] = "—"
    method: Optional[str] = "—"
    status: Optional[str] = "due"
