"""
Pydantic schemas (request/response models) for the Vstay API.

All input/output schemas are defined here and imported into routers.
"""

from app.schemas.auth import LoginIn, SignupIn
from app.schemas.staff import StaffIn
from app.schemas.tenants import TenantIn
from app.schemas.rooms import RoomIn
from app.schemas.complaints import ComplaintIn
from app.schemas.invoices import InvoiceIn
from app.schemas.announcements import AnnouncementIn
from app.schemas.laundry import LaundryIn
from app.schemas.documents import DocumentIn
from app.schemas.vehicles import VehicleIn
from app.schemas.settings import SettingsIn

__all__ = [
    "LoginIn",
    "SignupIn",
    "StaffIn",
    "TenantIn",
    "RoomIn",
    "ComplaintIn",
    "InvoiceIn",
    "AnnouncementIn",
    "LaundryIn",
    "DocumentIn",
    "VehicleIn",
    "SettingsIn",
]
