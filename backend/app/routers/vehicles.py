"""Vehicles router – tenant vehicle registrations."""
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.database import query, query_one

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


class VehicleIn(BaseModel):
    user_id: Optional[str] = None
    userId: Optional[str] = None
    workspace_id: Optional[str] = None
    workspaceId: Optional[str] = None
    type: Optional[str] = "Car"
    reg_number: Optional[str] = ""
    regNumber: Optional[str] = ""
    make: Optional[str] = ""
    model: Optional[str] = ""
    color: Optional[str] = ""
    parking_required: Optional[str] = "Yes"
    parkingRequired: Optional[str] = "Yes"
    parking_slot: Optional[str] = ""
    parkingSlot: Optional[str] = ""
    status: Optional[str] = "Pending"
    notes: Optional[str] = ""
    added_at: Optional[str] = ""
    addedAt: Optional[str] = ""


def _fmt(r: dict) -> dict:
    return {
        "id": r["id"],
        "type": r.get("type", "Car"),
        "regNumber": r.get("reg_number", ""),
        "make": r.get("make", ""),
        "model": r.get("model", ""),
        "color": r.get("color", ""),
        "parkingRequired": r.get("parking_required", "Yes"),
        "parkingSlot": r.get("parking_slot", ""),
        "status": r.get("status", "Pending"),
        "notes": r.get("notes", ""),
        "addedAt": r.get("added_at", ""),
    }


@router.get("")
def list_vehicles(userId: str):
    rows = query("SELECT * FROM vehicles WHERE user_id = %s ORDER BY created_at DESC", (userId,), fetch=True)
    return [_fmt(r) for r in (rows or [])]


@router.post("", status_code=201)
def create_vehicle(body: VehicleIn):
    vid = f"v-{uuid.uuid4().hex[:8]}"
    uid = body.user_id or body.userId or ""
    wid = body.workspace_id or body.workspaceId or None
    reg = body.reg_number or body.regNumber or ""
    park_req = body.parking_required or body.parkingRequired or "Yes"
    park_slot = body.parking_slot or body.parkingSlot or ""
    added = body.added_at or body.addedAt or ""
    query(
        "INSERT INTO vehicles (id,user_id,workspace_id,type,reg_number,make,model,color,parking_required,parking_slot,status,notes,added_at) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
        (vid, uid, wid, body.type, reg, body.make, body.model, body.color, park_req, park_slot, body.status, body.notes, added),
        commit=True,
    )
    return _fmt(query_one("SELECT * FROM vehicles WHERE id = %s", (vid,)))


@router.patch("/{vehicle_id}")
def update_vehicle(vehicle_id: str, body: dict):
    r = query_one("SELECT * FROM vehicles WHERE id = %s", (vehicle_id,))
    if not r:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    allowed = {
        "type", "reg_number", "regNumber", "make", "model", "color",
        "parking_required", "parkingRequired", "parking_slot", "parkingSlot",
        "status", "notes"
    }
    updates = {k: v for k, v in body.items() if k in allowed}
    # map frontend fields to db fields
    if "regNumber" in updates:
        updates["reg_number"] = updates.pop("regNumber")
    if "parkingRequired" in updates:
        updates["parking_required"] = updates.pop("parkingRequired")
    if "parkingSlot" in updates:
        updates["parking_slot"] = updates.pop("parkingSlot")

    if not updates:
        return _fmt(r)
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    vals = list(updates.values()) + [vehicle_id]
    query(f"UPDATE vehicles SET {set_clause} WHERE id = %s", vals, commit=True)
    return _fmt(query_one("SELECT * FROM vehicles WHERE id = %s", (vehicle_id,)))


@router.delete("/{vehicle_id}", status_code=204)
def delete_vehicle(vehicle_id: str):
    query("DELETE FROM vehicles WHERE id = %s", (vehicle_id,), commit=True)
