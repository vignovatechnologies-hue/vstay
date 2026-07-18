"""User model – shape of a row from the users table."""
from pydantic import BaseModel
from typing import List, Optional


class UserModel(BaseModel):
    """Represents a user returned by the API (matches _fmt_user output in auth.py)."""
    id: str
    email: str
    fullName: str
    phone: Optional[str] = ""
    role: str  # "super_admin" | "owner" | "manager" | "reception" | "tenant"
    workspaceIds: List[str] = []
    createdAt: str
