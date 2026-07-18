"""Complaints router – read and update complaint status."""
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.database import query, query_one

router = APIRouter(prefix="/api/complaints", tags=["complaints"])


class ComplaintIn(BaseModel):
    workspace_id: str
    tenant: Optional[str] = ""
    room: Optional[str] = ""
    category: Optional[str] = ""
    priority: Optional[str] = "low"
    status: Optional[str] = "open"
    description: Optional[str] = ""
    subject: Optional[str] = ""
    title: Optional[str] = ""
    raised_on: Optional[str] = ""
    raised: Optional[str] = ""
    date: Optional[str] = ""


def _fmt(r: dict) -> dict:
    desc = r.get("description") or r.get("subject") or r.get("title") or ""
    raised = r.get("raised_on") or r.get("raised") or ""
    return {
        "id": r["id"],
        "tenant": r.get("tenant", ""),
        "room": r.get("room", ""),
        "category": r.get("category", ""),
        "priority": r.get("priority", "low"),
        "status": r.get("status", "open"),
        # Owner fields
        "subject": desc,
        "raised": raised,
        "resolvedOn": r.get("resolved_on", ""),
        # Tenant fields
        "title": desc,
        "date": raised,
        "note": r.get("resolved_on", "") or "Awaiting staff review.",
    }


@router.get("")
def list_complaints(workspaceId: Optional[str] = None, tenantName: Optional[str] = None):
    sql = "SELECT * FROM complaints WHERE 1=1"
    params = []
    if workspaceId:
        sql += " AND workspace_id = %s"
        params.append(workspaceId)
    if tenantName:
        sql += " AND LOWER(tenant) = LOWER(%s)"
        params.append(tenantName)
    sql += " ORDER BY created_at DESC"
    rows = query(sql, tuple(params), fetch=True)
    return [_fmt(r) for r in (rows or [])]


@router.post("", status_code=201)
def create_complaint(body: ComplaintIn):
    cid = f"c-{uuid.uuid4().hex[:8]}"
    desc = body.description or body.subject or body.title or ""
    raised = body.raised_on or body.raised or body.date or ""
    query(
        "INSERT INTO complaints (id,workspace_id,tenant,room,category,priority,status,description,raised_on) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
        (cid, body.workspace_id, body.tenant, body.room, body.category, body.priority, body.status, desc, raised),
        commit=True,
    )
    return _fmt(query_one("SELECT * FROM complaints WHERE id = %s", (cid,)))


@router.patch("/{complaint_id}")
def update_complaint(complaint_id: str, body: dict):
    r = query_one("SELECT * FROM complaints WHERE id = %s", (complaint_id,))
    if not r:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    allowed = {"tenant", "room", "category", "priority", "status", "description", "subject", "title", "raised_on", "raised", "resolved_on", "note"}
    updates = {k: v for k, v in body.items() if k in allowed}
    # map frontend fields to db fields
    if "subject" in updates:
        updates["description"] = updates.pop("subject")
    if "title" in updates:
        updates["description"] = updates.pop("title")
    if "raised" in updates:
        updates["raised_on"] = updates.pop("raised")
    if "note" in updates:
        updates["resolved_on"] = updates.pop("note")

    if not updates:
        return _fmt(r)
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    vals = list(updates.values()) + [complaint_id]
    query(f"UPDATE complaints SET {set_clause} WHERE id = %s", vals, commit=True)
    return _fmt(query_one("SELECT * FROM complaints WHERE id = %s", (complaint_id,)))


@router.delete("/{complaint_id}", status_code=204)
def delete_complaint(complaint_id: str):
    query("DELETE FROM complaints WHERE id = %s", (complaint_id,), commit=True)

