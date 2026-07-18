"""Announcements router – super-admin posts."""
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.database import query, query_one

router = APIRouter(prefix="/api/announcements", tags=["announcements"])


class AnnouncementIn(BaseModel):
    workspace_id: Optional[str] = None
    title: str
    body: str
    audience: Optional[str] = "All"
    pinned: Optional[bool] = False
    author: Optional[str] = ""
    status: Optional[str] = "published"


def _fmt(r: dict) -> dict:
    return {
        "id": r["id"],
        "title": r.get("title", ""),
        "body": r.get("body", ""),
        "audience": r.get("audience", "All"),
        "pinned": r.get("pinned", False),
        "author": r.get("author", "System"),
        "status": r.get("status", "published"),
        "createdAt": r["created_at"].isoformat() if hasattr(r.get("created_at"), "isoformat") else str(r.get("created_at", "")),
    }


@router.get("")
def list_announcements():
    rows = query("SELECT * FROM announcements ORDER BY pinned DESC, created_at DESC", fetch=True)
    return [_fmt(r) for r in (rows or [])]


@router.post("", status_code=201)
def create_announcement(body: AnnouncementIn):
    aid = f"ann-{uuid.uuid4().hex[:8]}"
    query(
        "INSERT INTO announcements (id,workspace_id,title,body,audience,pinned,author,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
        (aid, body.workspace_id, body.title, body.body, body.audience, body.pinned, body.author, body.status),
        commit=True,
    )
    return _fmt(query_one("SELECT * FROM announcements WHERE id = %s", (aid,)))


@router.patch("/{ann_id}")
def update_announcement(ann_id: str, body: dict):
    r = query_one("SELECT * FROM announcements WHERE id = %s", (ann_id,))
    if not r:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Announcement not found")
    allowed = {"title", "body", "audience", "pinned", "author", "status"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return _fmt(r)
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    vals = list(updates.values()) + [ann_id]
    query(f"UPDATE announcements SET {set_clause} WHERE id = %s", vals, commit=True)
    return _fmt(query_one("SELECT * FROM announcements WHERE id = %s", (ann_id,)))


@router.delete("/{ann_id}", status_code=204)
def delete_announcement(ann_id: str):
    query("DELETE FROM announcements WHERE id = %s", (ann_id,), commit=True)
