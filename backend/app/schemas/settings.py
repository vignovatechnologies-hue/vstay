"""Settings schemas – request body for saving key-value settings."""
from pydantic import BaseModel
from typing import Any, Optional


class SettingsIn(BaseModel):
    """Request body for POST /api/settings."""
    key: str
    value: Any
    userId: Optional[str] = None
    workspaceId: Optional[str] = None
