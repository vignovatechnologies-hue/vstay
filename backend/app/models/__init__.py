"""
Database models (response shapes) for the Hostly API.

These Pydantic models describe the shape of rows returned from the
PostgreSQL database, used to type-check _fmt() outputs and API responses.
"""

from app.models.user import UserModel
from app.models.workspace import WorkspaceModel
from app.models.staff import StaffModel
from app.models.tenant import TenantModel
from app.models.room import RoomModel
from app.models.complaint import ComplaintModel
from app.models.invoice import InvoiceModel
from app.models.announcement import AnnouncementModel
from app.models.laundry import LaundryModel
from app.models.document import DocumentModel
from app.models.vehicle import VehicleModel

__all__ = [
    "UserModel",
    "WorkspaceModel",
    "StaffModel",
    "TenantModel",
    "RoomModel",
    "ComplaintModel",
    "InvoiceModel",
    "AnnouncementModel",
    "LaundryModel",
    "DocumentModel",
    "VehicleModel",
]
