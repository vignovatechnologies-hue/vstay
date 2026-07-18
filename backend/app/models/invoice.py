"""Invoice model – shape of a row from the invoices table."""
from pydantic import BaseModel
from typing import Optional


class InvoiceModel(BaseModel):
    """Represents an invoice returned by the API (matches _fmt output in invoices.py)."""
    id: str
    tenant: str = ""
    room: str = ""
    month: str = ""
    amount: str = ""
    date: str = "—"
    method: str = "—"
    status: str = "due"   # "paid" | "due" | "overdue"
