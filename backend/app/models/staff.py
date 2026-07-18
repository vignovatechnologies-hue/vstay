"""Staff model – shape of a row from the staff table."""
from pydantic import BaseModel
from typing import Optional


class StaffModel(BaseModel):
    """Represents a staff member returned by the API (matches _fmt output in staff.py)."""
    id: str
    name: str
    initials: str = ""
    role: str = ""
    phone: str = ""
    email: str = ""
    shift: str = "Day"
    status: str = "active"  # "active" | "leave"
