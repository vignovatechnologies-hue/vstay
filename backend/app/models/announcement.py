"""Announcement model – shape of a row from the announcements table."""
from pydantic import BaseModel
from typing import Optional


class AnnouncementModel(BaseModel):
    """Represents an announcement returned by the API (matches _fmt output in announcements.py)."""
    id: str
    title: str = ""
    body: str = ""
    audience: str = "All"
    pinned: bool = False
    author: str = "System"
    status: str = "published"   # "published" | "scheduled" | "draft"
    createdAt: str = ""
