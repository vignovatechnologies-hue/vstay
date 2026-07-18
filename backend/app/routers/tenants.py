"""Tenants router – CRUD for workspace tenants."""
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.database import query, query_one

router = APIRouter(prefix="/api/tenants", tags=["tenants"])


class TenantIn(BaseModel):
    workspace_id: str
    name: str
    room: Optional[str] = ""
    phone: Optional[str] = ""
    email: Optional[str] = ""
    since: Optional[str] = ""
    rent: Optional[str] = "due"
    kyc: Optional[str] = "pending"


def _fmt(r: dict) -> dict:
    return {
        "id": r["id"],
        "name": r["name"],
        "initials": r.get("initials", ""),
        "room": r.get("room", ""),
        "phone": r.get("phone", ""),
        "email": r.get("email", ""),
        "since": r.get("since", ""),
        "rent": r.get("rent", "due"),
        "kyc": r.get("kyc", "pending"),
    }


@router.get("")
def list_tenants(workspaceId: str):
    rows = query("SELECT * FROM tenants WHERE workspace_id = %s ORDER BY created_at DESC", (workspaceId,), fetch=True)
    return [_fmt(r) for r in (rows or [])]


@router.post("", status_code=201)
def create_tenant(body: TenantIn):
    tid = f"t-{uuid.uuid4().hex[:8]}"
    parts = body.name.strip().split()
    initials = ((parts[0][0] if parts else "") + (parts[1][0] if len(parts) > 1 else "")).upper() or "T"
    query(
        "INSERT INTO tenants (id,workspace_id,name,initials,room,phone,email,since,rent,kyc) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
        (tid, body.workspace_id, body.name, initials, body.room, body.phone, body.email, body.since, body.rent, body.kyc),
        commit=True,
    )
    return _fmt(query_one("SELECT * FROM tenants WHERE id = %s", (tid,)))


@router.patch("/{tenant_id}")
def update_tenant(tenant_id: str, body: dict):
    r = query_one("SELECT * FROM tenants WHERE id = %s", (tenant_id,))
    if not r:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Tenant not found")
    allowed = {"name", "room", "phone", "email", "since", "rent", "kyc"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return _fmt(r)
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    vals = list(updates.values()) + [tenant_id]
    query(f"UPDATE tenants SET {set_clause} WHERE id = %s", vals, commit=True)
    return _fmt(query_one("SELECT * FROM tenants WHERE id = %s", (tenant_id,)))


@router.delete("/{tenant_id}", status_code=204)
def delete_tenant(tenant_id: str):
    query("DELETE FROM tenants WHERE id = %s", (tenant_id,), commit=True)
