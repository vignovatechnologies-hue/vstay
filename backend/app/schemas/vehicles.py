"""Vehicle schemas – request body for creating/updating vehicle registrations."""
from pydantic import BaseModel
from typing import Optional


class VehicleIn(BaseModel):
    """
    Request body for POST /api/vehicles.

    Accepts both snake_case and camelCase variants to support different
    frontend calling conventions.
    """
    # User/workspace identifiers – accept both naming styles
    user_id: Optional[str] = None
    userId: Optional[str] = None
    workspace_id: Optional[str] = None
    workspaceId: Optional[str] = None

    # Vehicle details
    type: Optional[str] = "Car"

    # Registration number – accept both naming styles
    reg_number: Optional[str] = ""
    regNumber: Optional[str] = ""

    make: Optional[str] = ""
    model: Optional[str] = ""
    color: Optional[str] = ""

    # Parking – accept both naming styles
    parking_required: Optional[str] = "Yes"
    parkingRequired: Optional[str] = "Yes"
    parking_slot: Optional[str] = ""
    parkingSlot: Optional[str] = ""

    status: Optional[str] = "Pending"
    notes: Optional[str] = ""

    # Added date – accept both naming styles
    added_at: Optional[str] = ""
    addedAt: Optional[str] = ""
