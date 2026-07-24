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


@router.post("/update-occupancy")
def update_room_occupancy(workspace_id: str, room_name: str):
    """Recalculate beds occupancy and status for a room based on actual tenant count."""
    # Find the room
    room = query_one(
        "SELECT * FROM rooms WHERE workspace_id = %s AND room = %s",
        (workspace_id, room_name),
    )
    if not room:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Room not found")

    # Count tenants currently assigned to this room
    tenant_count_row = query_one(
        "SELECT COUNT(*) AS cnt FROM tenants WHERE workspace_id = %s AND room = %s",
        (workspace_id, room_name),
    )
    occupied = int(tenant_count_row["cnt"]) if tenant_count_row else 0

    # Parse total capacity from stored beds string e.g. "0/1" -> 1, or just "2" -> 2
    beds_raw = room.get("beds") or "0/1"
    if "/" in str(beds_raw):
        total = int(str(beds_raw).split("/")[1])
    else:
        total = int(beds_raw) if str(beds_raw).isdigit() else 1

    new_beds = f"{occupied}/{total}"
    new_status = "occupied" if occupied >= total else "vacant"

    query(
        "UPDATE rooms SET beds = %s, status = %s WHERE id = %s",
        (new_beds, new_status, room["id"]),
        commit=True,
    )
    return _fmt(query_one("SELECT * FROM rooms WHERE id = %s", (room["id"],)))
