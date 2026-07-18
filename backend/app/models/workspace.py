"""Workspace model – shape of a row from the workspaces table."""
from pydantic import BaseModel
from typing import Optional


class WorkspaceModel(BaseModel):
    """Represents a workspace returned by the API (matches _fmt output in workspaces.py)."""
    id: str
    name: str
    ownerId: str
    city: Optional[str] = None
    address: Optional[str] = None
    initials: Optional[str] = None
    totalBeds: int = 0
    occupiedBeds: int = 0
    accent: str = "blue"
    planId: Optional[str] = None
    createdAt: str
