"""Announcement schemas – request body for creating/updating announcements."""
from pydantic import BaseModel
from typing import Optional


class AnnouncementIn(BaseModel):
    """Request body for POST /api/announcements."""
    workspace_id: Optional[str] = None
    title: str
    body: str
    audience: Optional[str] = "All"
    pinned: Optional[bool] = False
    author: Optional[str] = ""
    status: Optional[str] = "published"
