"""Vehicle model – shape of a row from the vehicles table."""
from pydantic import BaseModel
from typing import Optional


class VehicleModel(BaseModel):
    """Represents a vehicle returned by the API (matches _fmt output in vehicles.py)."""
    id: str
    type: str = "Car"         # "Car" | "Motorcycle" | "Scooter" | "Bicycle" | "Other"
    regNumber: str = ""
    make: str = ""
    model: str = ""
    color: str = ""
    parkingRequired: str = "Yes"  # "Yes" | "No"
    parkingSlot: str = ""
    status: str = "Pending"   # "Verified" | "Pending" | "Rejected"
    notes: str = ""
    addedAt: str = ""
