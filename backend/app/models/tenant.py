"""Tenant model – shape of a row from the tenants table."""
from pydantic import BaseModel
from typing import Optional


class TenantModel(BaseModel):
    """Represents a tenant returned by the API (matches _fmt output in tenants.py)."""
    id: str
    name: str
    initials: str = ""
    room: str = ""
    phone: str = ""
    email: str = ""
    since: str = ""
    rent: str = "due"    # "paid" | "due" | "overdue"
    kyc: str = "pending"  # "verified" | "pending"
