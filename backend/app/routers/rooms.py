"""Rooms router – CRUD for workspace rooms."""
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.database import query, query_one

router = APIRouter(prefix="/api/rooms", tags=["rooms"])


class RoomIn(BaseModel):
    workspace_id: str
    room: str
    floor: Optional[str] = "Ground"
    type: Optional[str] = "Single"
    rent: Optional[str] = ""
    beds: Optional[str] = "0/1"
    status: Optional[str] = "vacant"


def _fmt(r: dict) -> dict:
    return {
        "id": r["id"],
        "room": r["room"],
        "floor": r.get("floor", ""),
        "type": r.get("type", ""),
        "rent": r.get("rent", ""),
        "beds": r.get("beds", ""),
        "status": r.get("status", "vacant"),
    }


@router.get("")
def list_rooms(workspaceId: str):
    rows = query("SELECT * FROM rooms WHERE workspace_id = %s ORDER BY room", (workspaceId,), fetch=True)
    return [_fmt(r) for r in (rows or [])]


@router.post("", status_code=201)
def create_room(body: RoomIn):
    import uuid
    rid = f"r-{uuid.uuid4().hex[:8]}"
    query(
        "INSERT INTO rooms (id,workspace_id,room,floor,type,rent,beds,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
        (rid, body.workspace_id, body.room, body.floor, body.type, body.rent, body.beds, body.status),
        commit=True,
    )
    r = query_one("SELECT * FROM rooms WHERE id = %s", (rid,))
    return _fmt(r)


@router.patch("/{room_id}")
def update_room(room_id: str, body: dict):
    r = query_one("SELECT * FROM rooms WHERE id = %s", (room_id,))
    if not r:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Room not found")

    allowed = {"room", "floor", "type", "rent", "beds", "status"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return _fmt(r)

    set_clause = ", ".join(f"{k} = %s" for k in updates)
    vals = list(updates.values()) + [room_id]
    query(f"UPDATE rooms SET {set_clause} WHERE id = %s", vals, commit=True)
    return _fmt(query_one("SELECT * FROM rooms WHERE id = %s", (room_id,)))


@router.delete("/{room_id}", status_code=204)
def delete_room(room_id: str):
    query("DELETE FROM rooms WHERE id = %s", (room_id,), commit=True)
