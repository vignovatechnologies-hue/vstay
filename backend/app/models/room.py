"""Room model – shape of a row from the rooms table."""
from pydantic import BaseModel
from typing import Optional


class RoomModel(BaseModel):
    """Represents a room returned by the API (matches _fmt output in rooms.py)."""
    id: str
    room: str
    floor: str = ""
    type: str = ""
    rent: str = ""
    beds: str = ""
    status: str = "vacant"  # "vacant" | "occupied" | "maintenance"
