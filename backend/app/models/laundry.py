"""Laundry model – shape of a row from the laundry_bookings table."""
from pydantic import BaseModel
from typing import Optional


class LaundryModel(BaseModel):
    """Represents a laundry booking returned by the API (matches _fmt output in laundry.py)."""
    id: str
    date: str = ""
    slot: str = ""
    service: str = ""
    machine: str = ""
    status: str = "upcoming"   # "upcoming" | "done" | "cancelled"
