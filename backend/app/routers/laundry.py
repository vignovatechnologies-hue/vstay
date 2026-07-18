"""Laundry bookings router."""
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.database import query, query_one

router = APIRouter(prefix="/api/laundry", tags=["laundry"])


class LaundryIn(BaseModel):
    user_id: str
    workspace_id: Optional[str] = None
    date: Optional[str] = ""
    slot: Optional[str] = ""
    service: Optional[str] = "Wash & dry"
    machine: Optional[str] = "Machine 1"
    status: Optional[str] = "upcoming"


def _fmt(r: dict) -> dict:
    return {
        "id": r["id"],
        "date": r.get("date", ""),
        "slot": r.get("slot", ""),
        "service": r.get("service", ""),
        "machine": r.get("machine", ""),
        "status": r.get("status", "upcoming"),
    }


@router.get("")
def list_bookings(userId: str):
    rows = query(
        "SELECT * FROM laundry_bookings WHERE user_id = %s ORDER BY created_at DESC",
        (userId,), fetch=True,
    )
    return [_fmt(r) for r in (rows or [])]


@router.post("", status_code=201)
def create_booking(body: LaundryIn):
    lid = f"L-{uuid.uuid4().hex[:6].upper()}"
    query(
        "INSERT INTO laundry_bookings (id,user_id,workspace_id,date,slot,service,machine,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
        (lid, body.user_id, body.workspace_id, body.date, body.slot, body.service, body.machine, body.status),
        commit=True,
    )
    return _fmt(query_one("SELECT * FROM laundry_bookings WHERE id = %s", (lid,)))


@router.patch("/{booking_id}")
def update_booking(booking_id: str, body: dict):
    r = query_one("SELECT * FROM laundry_bookings WHERE id = %s", (booking_id,))
    if not r:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Booking not found")
    allowed = {"date", "slot", "service", "machine", "status"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return _fmt(r)
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    vals = list(updates.values()) + [booking_id]
    query(f"UPDATE laundry_bookings SET {set_clause} WHERE id = %s", vals, commit=True)
    return _fmt(query_one("SELECT * FROM laundry_bookings WHERE id = %s", (booking_id,)))


@router.delete("/{booking_id}", status_code=204)
def delete_booking(booking_id: str):
    query("DELETE FROM laundry_bookings WHERE id = %s", (booking_id,), commit=True)
