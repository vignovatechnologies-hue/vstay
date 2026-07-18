"""Staff router – CRUD for workspace staff."""
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.database import query, query_one

router = APIRouter(prefix="/api/staff", tags=["staff"])


class StaffIn(BaseModel):
    workspace_id: str
    name: str
    role: Optional[str] = "Reception"
    phone: Optional[str] = ""
    email: Optional[str] = ""
    shift: Optional[str] = "Day"
    status: Optional[str] = "active"


def _fmt(r: dict) -> dict:
    return {
        "id": r["id"],
        "name": r["name"],
        "initials": r.get("initials", ""),
        "role": r.get("role", ""),
        "phone": r.get("phone", ""),
        "email": r.get("email", ""),
        "shift": r.get("shift", "Day"),
        "status": r.get("status", "active"),
    }


@router.get("")
def list_staff(workspaceId: str):
    rows = query("SELECT * FROM staff WHERE workspace_id = %s ORDER BY created_at DESC", (workspaceId,), fetch=True)
    return [_fmt(r) for r in (rows or [])]


@router.post("", status_code=201)
def create_staff(body: StaffIn):
    sid = f"s-{uuid.uuid4().hex[:8]}"
    parts = body.name.strip().split()
    initials = ((parts[0][0] if parts else "") + (parts[1][0] if len(parts) > 1 else "")).upper() or "S"
    query(
        "INSERT INTO staff (id,workspace_id,name,initials,role,phone,email,shift,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
        (sid, body.workspace_id, body.name, initials, body.role, body.phone, body.email, body.shift, body.status),
        commit=True,
    )
    return _fmt(query_one("SELECT * FROM staff WHERE id = %s", (sid,)))


@router.patch("/{staff_id}")
def update_staff(staff_id: str, body: dict):
    r = query_one("SELECT * FROM staff WHERE id = %s", (staff_id,))
    if not r:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Staff not found")
    allowed = {"name", "role", "phone", "email", "shift", "status"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return _fmt(r)
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    vals = list(updates.values()) + [staff_id]
    query(f"UPDATE staff SET {set_clause} WHERE id = %s", vals, commit=True)
    return _fmt(query_one("SELECT * FROM staff WHERE id = %s", (staff_id,)))


@router.delete("/{staff_id}", status_code=204)
def delete_staff(staff_id: str):
    query("DELETE FROM staff WHERE id = %s", (staff_id,), commit=True)
